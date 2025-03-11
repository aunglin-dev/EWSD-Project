import express from "express";
import {
    addComment,
    getAllComments,
    getCommentsById,
    getCommentsByRole,
    getDocumentCommentsByDocumentId,
    getDocumentCommentsByDocumentIdAndRole,
    updateComment,
    deleteComment,
    deleteCommentsByDocumentId,
    deleteCommentsByDocumentIdAndRole
} from "../Controller/documentCommentController.js";

export const documentCommentRouter = express.Router();

documentCommentRouter.get("/", getAllComments); // Get all comments
documentCommentRouter.get("/:id", getCommentsById); // Get a comment by Comment ID
documentCommentRouter.get("/role/:role", getCommentsByRole); // Get All Document Comments by Role
documentCommentRouter.get("/document/:documentId", getDocumentCommentsByDocumentId); // Get All Document Comments by Document ID
documentCommentRouter.get("/document/:role/:documentId", getDocumentCommentsByDocumentIdAndRole); // Get All Document Comments by Document ID and Role

documentCommentRouter.post("/", addComment); // Add a comment

documentCommentRouter.put("/:id", updateComment); // Update a comment by ID

documentCommentRouter.delete("/:id", deleteComment); // Delete a comment by ID
documentCommentRouter.delete("/document/:documentId", deleteCommentsByDocumentId); // Route to delete all comments by document ID
documentCommentRouter.delete("/document/:role/:documentId", deleteCommentsByDocumentIdAndRole); // Route to delete all comments by document ID and role



export default documentCommentRouter;
