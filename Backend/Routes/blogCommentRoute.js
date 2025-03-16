import express from "express";
import {
    createComment,
    getAllBlogComments,
    getCommentsByBlogId,
    getCommentsByRole,
    getCommentsByBlogIdAndRole,
    getCommentById,
    updateComment,
    deleteComment,
    deleteCommentsByBlogId,
    deleteCommentsByBlogIdAndRole,
    getLatestBlogComment
} from "../Controller/blogCommentController.js";

export const blogCommentRouter = express.Router();

// Define blog comment routes
blogCommentRouter.get("/", getAllBlogComments); // Get all comments
blogCommentRouter.get("/recent", getLatestBlogComment); // Get all comments
blogCommentRouter.get("/:id", getCommentById); // Get a comment by comment ID
blogCommentRouter.get("/role/:role", getCommentsByRole); // Get all comments by role
blogCommentRouter.get("/blog/:blogId", getCommentsByBlogId); // Get all comments for a blog post
blogCommentRouter.get("/blog/:role/:blogId/", getCommentsByBlogIdAndRole); // Get comments by blog ID and role


blogCommentRouter.post("/", createComment); // Add a new comment

blogCommentRouter.put("/:id", updateComment); // Update a comment by ID

blogCommentRouter.delete("/:id", deleteComment); // Delete a comment by ID
blogCommentRouter.delete("/blog/:blogId", deleteCommentsByBlogId); // Delete all comments by blog ID
blogCommentRouter.delete("/blog/:role/:blogId/", deleteCommentsByBlogIdAndRole); // Delete all comments by blog ID and role

export default blogCommentRouter;
