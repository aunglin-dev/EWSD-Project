import Document from "../Model//Document.js";
import Allocation from "../Model/Allocation.js";
import fs from "fs";
import path from "path";
import Student from '../Model/Student.js';
import Tutor from '../Model/Tutor.js';

const SERVER_URL = "http://localhost:8000"; 

// Upload a new document
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const docType = req.file.mimetype;
        const { role, allocationId, description } = req.body;

        // Generate file URL
        const url = `${SERVER_URL}/uploads/${req.file.filename}`;


        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);


        const newDocument = new Document({
            role: formattedRole,
            allocationId,
            docType,
            description,
            url, // Store URL instead of file path
        });

        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all documents
export const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().populate("comments");
        if (!documents) return res.status(404).json({ message: 'Documents not found' });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id).populate("comments");
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get documents by allocationId
export const getDocumentsByAllocationId = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const documents = await Document.find({ allocationId }).populate("comments");
        if (!documents.length) {
            return res.status(404).json({ error: "No documents found for the given allocationId" });
        }
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get documents by allocationId and role
export const getDocumentsByAllocationIdAndRole = async (req, res) => {
    try {
        const { allocationId, role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const documents = await Document.find({ allocationId, role: formattedRole }).populate("comments");
        if (!documents.length) {
            return res.status(404).json({ error: "No documents found for the given allocationId and role" });
        }
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get documents by role
export const getAllDocumentsByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const documents = await Document.find({ role: formattedRole }).populate("comments");
        if (!documents.length) {
            return res.status(404).json({ error: "No documents found for the given role" });
        }
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get latest documents
export const getLatestDocument = async (req, res) => {
    try {
        const document = await Document.find().sort({createdAt : -1}).limit(10)
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update a document
export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, allocationId, description } = req.body;

        const document = await Document.findById(id).populate("comments");
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        let url = document.url; // Keep existing URL by default

        // If a new file is uploaded, delete the old one
        if (req.file) {
            const oldFilePath = path.join("uploads", path.basename(document.url));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            url = `${SERVER_URL}/uploads/${req.file.filename}`;
        }


        // Capitalize first letter of role
        const formattedRole = role?.charAt(0).toUpperCase() + role?.slice(1);
        const docType = req?.file?.mimetype || document.docType

        document.role = formattedRole || document.role;
        document.allocationId = allocationId || document.allocationId;
        document.docType = docType || document.docType;
        document.description = description || document.description;
        document.url = url;

        await document.save();
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a document
export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findByIdAndDelete(id);

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Delete the actual file
        const filePath = path.join("uploads", path.basename(document.url));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get last five documents by allocationId and role, including uploader data from Allocation (Student or Tutor)
export const getLastFiveDocumentsByAllocationIdAndRole = async (req, res) => {
    try {
        const { allocationId, role } = req.params;

        // Capitalize the first letter of the role for consistency
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        // Find documents by allocationId and role
        const documents = await Document.find({ allocationId, role: formattedRole })
            .sort({ createdAt: -1 })
            .limit(5);

        if (!documents.length) {
            return res.status(404).json({ error: "No documents found for the given allocationId and role" });
        }

        // Retrieve the allocation data
        const allocation = await Allocation.findById(allocationId).populate("student tutor createdStaffId")
        

        // Retrieve uploader data based on allocation's role
        for (let document of documents) {
            if (document.role === 'Student') {
                // Populate student data
                document.uploader = allocation?.student;
            } else if (document.role === 'Tutor') {
                // Populate tutor data
                document.uploader = allocation?.tutor;
            }
        }

        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getLastFiveDocumentsByStudentOrTutorId = async (req, res) => {
    try {
        const { role, id } = req.params; // Either studentId or tutorId based on the role

        // Capitalize the first letter of the role for consistency
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        // Validate role
        if (formattedRole !== "Student" && formattedRole !== "Tutor") {
            return res.status(400).json({ error: "Invalid role. It should be 'Student' or 'Tutor'." });
        }
        // Find allocations by studentId or tutorId
        const allocations = await Allocation.find({ [formattedRole.toLowerCase()]: id });

        if (!allocations.length) {
            return res.status(404).json({ error: "No allocations found for the given student/tutor ID" });
        }

        const allocationIds = allocations.map(allocation => allocation._id);

        // Find documents related to these allocations
        const documents = await Document.find({ allocationId: { $in: allocationIds }, role: "Student" })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        if (!documents.length) {
            return res.json([]);
        }

        // Attach the correct user details (Student or Tutor) to each document based on its allocation
        const response = await Promise.all(documents.map(async (doc) => {
            let ownerDetails = null;

            // Find the allocation related to the current document
            const allocation = await Allocation.findById(doc.allocationId);

            ownerDetails = await Student.findById(allocation.student);

            return {
                ...doc,
                documentOwner: ownerDetails,
            };
        }));

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
