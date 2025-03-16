import DocumentComment from "../Model/DocumentComment.js";
import Allocation from "../Model/Allocation.js";
import Document from "../Model/Document.js";


// Create a new comment
export const addComment = async (req, res) => {
    try {
        const { documentId, role, comment } = req.body;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
        
        if(formattedRole === 'Student'){
          return res.status(400).json({success : false, message : "Students cannot comment on documents."})
        }

        const newComment = new DocumentComment({ documentId, role: formattedRole, comment });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await DocumentComment.find().populate("documentId");
        if (!comments.length) {
            return res.status(404).json({ error: "No comments found" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all comments by role
export const getCommentsByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const comments = await DocumentComment.find({ role: formattedRole }).populate("documentId");

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for the given role" });
        }

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get comments by documentId
export const getCommentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await DocumentComment.findById(id).populate("documentId");
        if (!comments) {
            return res.status(404).json({ error: "No comment found for the given comment Id" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get document comments by document ID
export const getDocumentCommentsByDocumentId = async (req, res) => {
    try {
        const { documentId } = req.params;
        const comments = await DocumentComment.find({ documentId }).populate("documentId");
        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for the given document Id" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get document comments by document ID and role
export const getDocumentCommentsByDocumentIdAndRole = async (req, res) => {
    try {
        const { role, documentId } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const comments = await DocumentComment.find({ documentId, role: formattedRole }).populate("documentId");
        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for the given document ID and role" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get latest comment
export const getLatestComment = async (req, res) => {
    try {
        const comment = await DocumentComment.find().sort({createdAt : -1}).limit(10)
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, comment } = req.body;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const updatedComment = await DocumentComment.findByIdAndUpdate(
            id,
            { role: formattedRole, comment },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all comments by document ID
export const deleteCommentsByDocumentId = async (req, res) => {
    try {
        const { documentId } = req.params;
        const deletedComments = await DocumentComment.deleteMany({ documentId });

        if (deletedComments.deletedCount === 0) {
            return res.status(404).json({ error: "No comments found for the given document ID" });
        }

        res.json({ message: "All comments deleted successfully for the given document ID" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete all comments by document ID and role
export const deleteCommentsByDocumentIdAndRole = async (req, res) => {
    try {
        const { role, documentId } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const deletedComments = await DocumentComment.deleteMany({ documentId, role: formattedRole });

        if (deletedComments.deletedCount === 0) {
            return res.status(404).json({ error: "No comments found for the given document ID and role" });
        }

        res.json({ message: "All comments deleted successfully for the given document ID and role" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await DocumentComment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getLastTwoCommentsByTutorOrStudentId = async (req, res) => {
    try {
        const { id, role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        // Validate the role
        if (formattedRole !== 'Student' && formattedRole !== 'Tutor') {
            return res.status(400).json({ error: "Invalid role. It should be 'Student' or 'Tutor'." });
        }

        // Find allocation by studentId or tutorId
        const allocation = await Allocation.findOne({
            [formattedRole.toLowerCase()]: id,
        }).populate("student tutor createdStaffId");

        if (!allocation) {
            return res.status(404).json({error: "Allocation not found for the given student/tutor ID"});
        }

        // Find the last two comments based on allocationId and role
        const documents = await Document.find({ allocationId: allocation._id });

        if (!documents.length) {
            return res.status(404).json({ error: "No document found for the given uploader id & role" });
        }

        const documentIds = documents.map(doc => doc._id);
        // Fetch last two comments across all documents
        const comments = await DocumentComment.find({ documentId: { $in: documentIds }, role: formattedRole })
            .sort({ createdAt: -1 })
            .limit(2);

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for the given uploader id & role" });
        }
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
