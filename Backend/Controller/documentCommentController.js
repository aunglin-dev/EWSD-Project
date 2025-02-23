import DocumentComment from "../Model/DocumentComment.js";


// Create a new comment
export const addComment = async (req, res) => {
    try {
        const { documentId, role, comment } = req.body;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

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

