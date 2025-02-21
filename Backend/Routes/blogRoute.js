import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    getBlogsByRole,
    getBlogsByAllocationId,
    getBlogsByRoleAndAllocationId,
    updateBlog,
    deleteBlog,
    deleteBlogsByAllocationId,
    deleteBlogsByAllocationIdAndRole
} from "../Controller/blogController.js";

export const blogRouter = express.Router();


blogRouter.get("/", getAllBlogs); // Get all blogs
blogRouter.get("/:id", getBlogById); // Get a blog by ID
blogRouter.get("/role/:role", getBlogsByRole); // Get blogs by role
blogRouter.get("/allocation/:allocationId", getBlogsByAllocationId); // Get blogs by allocationId
blogRouter.get("/allocation/:role/:allocationId", getBlogsByRoleAndAllocationId); // Get blogs by role and allocationId


blogRouter.post("/", createBlog); // Create a blog

blogRouter.put("/:id", updateBlog); // Update blog by ID

blogRouter.delete("/:id", deleteBlog); // Delete blog by ID
blogRouter.delete("/allocation/:allocationId", deleteBlogsByAllocationId); // Delete blogs by allocationId
blogRouter.delete("/allocation/:role/:allocationId", deleteBlogsByAllocationIdAndRole); // Delete blogs by role and allocationId

export default blogRouter;
