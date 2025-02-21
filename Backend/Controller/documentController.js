import Document from "../Model//Document.js";
import fs from "fs";
import path from "path";


const SERVER_URL = "http://localhost:8000"; 

// Upload a new document
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { role, allocationId, docType, description } = req.body;

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


// Update a document
export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, allocationId, docType, description } = req.body;

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
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);


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
