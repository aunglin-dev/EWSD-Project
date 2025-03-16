import express from "express";
import { uploadDocument, getAllDocuments, getDocumentById, getAllDocumentsByRole, deleteDocument, getDocumentsByAllocationIdAndRole, getDocumentsByAllocationId, updateDocument, getLatestDocument, getLastFiveDocumentsByAllocationIdAndRole, getLastFiveDocumentsByStudentOrTutorId } from "../Controller/documentController.js";
import upload from "../Service/multerConfig.js";

export const documentRouter = express.Router();

documentRouter.get("/", getAllDocuments); // Get all documents
documentRouter.get("/recent", getLatestDocument); // Get all documents
documentRouter.get("/:id", getDocumentById); // Get a document by ID
documentRouter.get("/role/:role", getAllDocumentsByRole); // Get a document by ID
documentRouter.get("/allocation/:allocationId", getDocumentsByAllocationId); // Get documents by allocationId
documentRouter.get("/allocation/:role/:allocationId", getDocumentsByAllocationIdAndRole); // Get documents by allocationId and role
// New endpoint for last five documents by uploader id and role
documentRouter.get("/allocation/:role/:id/last-five", getLastFiveDocumentsByStudentOrTutorId); // Get last five documents by uploader and role


documentRouter.post("/", upload.single("file"), uploadDocument); // Create a document

documentRouter.put("/:id", upload.single("file"), updateDocument); // Update a document

documentRouter.delete("/:id", deleteDocument); // Delete a document

export default documentRouter;
