import express from "express";
import { uploadDocument, getAllDocuments, getDocumentById, deleteDocument, getDocumentsByAllocationIdAndRole, getDocumentsByAllocationId } from "../Controller/documentController.js";
import upload from "../Service/multerConfig.js";

export const documentRouter = express.Router();

documentRouter.post("/", upload.single("file"), uploadDocument);
documentRouter.put("/:id", upload.single("file"), uploadDocument);
documentRouter.get("/", getAllDocuments);
documentRouter.get("/:id", getDocumentById);
documentRouter.get("/allocation/:role/:allocationId", getDocumentsByAllocationIdAndRole);
documentRouter.get("/allocation/:allocationId", getDocumentsByAllocationId);
documentRouter.delete("/:id", deleteDocument);

export default documentRouter;
