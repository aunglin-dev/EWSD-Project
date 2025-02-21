import Blog from "../Model/Blog.js";

// Create a new blog post
export const createBlog = async (req, res) => {
    try {
        const { role, allocationId, title, content } = req.body;

        const newBlog = new Blog({
            role,
            allocationId,
            title,
            content,
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all blog posts
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        if (!blogs.length) {
            return res.status(404).json({ error: "No blogs found" });
        }
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single blog post by ID
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get blogs by role and allocationId
export const getBlogsByRoleAndAllocationId = async (req, res) => {
    try {
        const { role, allocationId } = req.params;


        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const blogs = await Blog.find({ role: formattedRole, allocationId });
        if (!blogs.length) {
            return res.status(404).json({ error: "No blogs found for the given role and allocationId" });
        }
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get blogs by  allocationId
export const getBlogsByAllocationId = async (req, res) => {
    try {
        const {allocationId } = req.params;

        const blogs = await Blog.find({ allocationId });
        if (!blogs.length) {
            return res.status(404).json({ error: "No blogs found for the given allocationId" });
        }
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all blogs by role 
export const getBlogsByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const blogs = await Blog.find({ role: formattedRole });
        if (!blogs.length) {
            return res.status(404).json({ error: "No blogs found for the given role" });
        }
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Update a blog post
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, allocationId, title, content } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        blog.role = role || blog.role;
        blog.allocationId = allocationId || blog.allocationId;
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.updatedDate = Date.now();

        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Delete blogs by allocationId
export const deleteBlogsByAllocationId = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const result = await Blog.deleteMany({ allocationId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No blogs found for the given allocationId" });
        }
        res.json({ message: "Blogs deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete blogs by allocationId and role
export const deleteBlogsByAllocationIdAndRole = async (req, res) => {
    try {
        const { allocationId, role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const result = await Blog.deleteMany({ allocationId, role: formattedRole });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No blogs found for the given allocationId and role" });
        }
        res.json({ message: "Blogs deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};