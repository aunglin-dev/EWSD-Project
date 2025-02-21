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

blogRouter.post("/", createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.get("/allocation/:role/:allocationId", getBlogsByRoleAndAllocationId);
blogRouter.get("/allocation/:allocationId", getBlogsByAllocationId);
blogRouter.get("/role/:role", getBlogsByRole);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);
blogRouter.delete("/allocation/:allocationId", deleteBlogsByAllocationId);
blogRouter.delete("/allocation/:role/:allocationId", deleteBlogsByAllocationIdAndRole);

export default blogRouter;
