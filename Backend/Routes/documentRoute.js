import express from "express";
import { uploadDocument, getAllDocuments, getDocumentById, getAllDocumentsByRole, deleteDocument, getDocumentsByAllocationIdAndRole, getDocumentsByAllocationId } from "../Controller/documentController.js";
import upload from "../Service/multerConfig.js";

export const documentRouter = express.Router();

documentRouter.get("/", getAllDocuments); // Get all documents
documentRouter.get("/:id", getDocumentById); // Get a document by ID
documentRouter.get("/role/:role", getAllDocumentsByRole); // Get a document by ID
documentRouter.get("/allocation/:allocationId", getDocumentsByAllocationId); // Get documents by allocationId
documentRouter.get("/allocation/:role/:allocationId", getDocumentsByAllocationIdAndRole); // Get documents by allocationId and role


documentRouter.post("/", upload.single("file"), uploadDocument); // Create a document

documentRouter.put("/:id", upload.single("file"), uploadDocument); // Update a document

documentRouter.delete("/:id", deleteDocument); // Delete a document

export default documentRouter;
