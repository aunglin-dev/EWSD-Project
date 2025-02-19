import Allocation from "../Model/Allocation.js";

// Create a new allocation
export const createAllocation = async (req, res) => {
    try {
        const allocation = new Allocation(req.body);
        await allocation.save();
        res.status(201).json(allocation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all allocations
export const getAllAllocations = async (req, res) => {
    try {
        const allocations = await Allocation.find().populate("tutor").populate("student").populate("createdStaffId");
        res.status(200).json(allocations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single allocation by ID
export const getAllocationById = async (req, res) => {
    try {
        const allocation = await Allocation.findById(req.params.id).populate("student tutor createdStaffId");
        if (!allocation) return res.status(404).json({ message: "Allocation not found" });
        res.status(200).json(allocation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an allocation by ID
export const updateAllocation = async (req, res) => {
    try {
        const allocation = await Allocation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("student tutor createdStaffId");
        if (!allocation) return res.status(404).json({ message: "Allocation not found" });
        res.status(200).json(allocation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an allocation by ID
export const deleteAllocation = async (req, res) => {
    try {
        const allocation = await Allocation.findByIdAndDelete(req.params.id);
        if (!allocation) return res.status(404).json({ message: "Allocation not found" });
        res.status(200).json({ message: "Allocation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all allocations for a specific tutor

export const getAllocationsByTutorId = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const allocations = await Allocation.find({ tutor: tutorId })
            .populate("student")
            .populate("createdStaffId")
            .populate("tutor");

    if (!allocations.length) {
      return res
        .status(404)
        .json({ message: "No allocations found for this tutor" });
    }
    const tutorInfo = allocations[0].tutor;

    // Transform allocations into student objects with allocation_id inside student
    const students = allocations.map((allocation, index) => ({
      student: {
        ...allocation.student.toObject(), // Ensure student is a plain object
        allocation_id: allocation._id, // Add allocation_id inside student object
      },
      createdStaffId: allocation.createdStaffId,
    }));

    // Send the response with structured data
    res.status(200).json({
      allocation: {
        tutor: tutorInfo,
        students,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

