import Staff from "../Model/Staff.js";
import bcrypt from "bcryptjs";

// 📌 Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const { name, email, password, role, phNo, NRC, address, img, DateOfBirth } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = new Staff({
            name,
            email,
            password: hashedPassword,
            role,
            phNo,
            NRC,
            address,
            img,
            DateOfBirth,
        });

        await newStaff.save();
        res.status(201).json({ message: "Staff created successfully", staff: newStaff });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 📌 Get all staff members
export const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get a single staff member by ID
export const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Update staff details
export const updateStaff = async (req, res) => {
    try {
        const { password, ...updates } = req.body;

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const staff = await Staff.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        res.status(200).json({ message: "Staff updated successfully", staff });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 📌 Delete a staff member
export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
