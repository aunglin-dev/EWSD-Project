import Staff from "../Model/Staff.js";
import UserActivity from "../Model/UserActivity.js";

// 📌 Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
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
        if (!staff.length) return res.status(404).json({ message: "Staffs not found" });
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
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
        await UserActivity.deleteMany({userId:req.params.id});
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
