import BlogComment from "../Model/BlogComment.js";
import Blog from "../Model/Blog.js";

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { blogId, role, comment } = req.body;

        // Check if blog post exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Capitalize role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const newComment = new BlogComment({
            blogId,
            role: formattedRole,
            comment
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all comments for a specific blog post
export const getAllBlogComments = async (req, res) => {
    try {
        const comments = await BlogComment.find();

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all comments for a specific blog post
export const getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await BlogComment.find({ blogId });

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for this blog post" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single comment by ID
export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await BlogComment.findById(id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get comments by blog ID and role
export const getCommentsByBlogIdAndRole = async (req, res) => {
    try {
        const { blogId, role } = req.params;
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
        const comments = await BlogComment.find({ blogId, role: formattedRole });

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for this blog post and role" });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get comments by role
export const getCommentsByRole = async (req, res) => {
    try {
        const {role } = req.params;
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
        const comments = await BlogComment.find({role: formattedRole });

        if (!comments.length) {
            return res.status(404).json({ error: "No comments found for this role" });
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

        const existingComment = await BlogComment.findById(id);
        if (!existingComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Capitalize role if provided
        const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : existingComment.role;

        existingComment.role = formattedRole;
        existingComment.comment = comment || existingComment.comment;
        await existingComment.save();

        res.json(existingComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await BlogComment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all comments for a specific blog post
export const deleteCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const result = await BlogComment.deleteMany({ blogId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No comments found for this blog post" });
        }
        res.json({ message: "Comments deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete comments by blog ID and role
export const deleteCommentsByBlogIdAndRole = async (req, res) => {
    try {
        const { blogId, role } = req.params;
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
        const result = await BlogComment.deleteMany({ blogId, role: formattedRole });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No comments found for this blog post and role" });
        }
        res.json({ message: "Comments deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
