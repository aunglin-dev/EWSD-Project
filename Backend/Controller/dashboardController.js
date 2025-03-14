import Allocation from "../Model/Allocation.js";
import Document from "../Model/Document.js";
import Meeting from "../Model/Meeting.js";
import Student from "../Model/Student.js";
import Tutor from "../Model/Tutor.js";

export const totalTutor = async (req, res) => {
  try {
    const count = await Tutor.countDocuments();
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const totalStudent = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const unallocatedTutorCount = async (req, res) => {
  try {
    const allocatedTutors = await Allocation.distinct("tutor");
    const unallocatedTutors = await Tutor.find({
      _id: { $nin: allocatedTutors }, // $nin = Not In
    });
    res.status(200).json(unallocatedTutors.length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const unallocatedTutors = async (req, res) => {
  try {
    const allocatedTutors = await Allocation.distinct("tutor");
    const unallocatedTutors = await Tutor.find({
      _id: { $nin: allocatedTutors }, // $nin = Not In
    });
    res.status(200).json(unallocatedTutors);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const unallocatedStudentCount = async (req, res) => {
  try {
    const allocatedStudents = await Allocation.distinct("student");
    const unallocatedStudents = await Student.find({
      _id: { $nin: allocatedStudents }, // $nin = Not In
    });
    res.status(200).json(unallocatedStudents.length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const unallocatedStudents = async (req, res) => {
  try {
    const allocatedStudents = await Allocation.distinct("student");
    const unallocatedStudents = await Student.find({
      _id: { $nin: allocatedStudents }, // $nin = Not In
    });
    res.status(200).json(unallocatedStudents);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const assignedStudentByTutorId = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }

    const students = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const student = await Student.findById(allocation.student);
        return student;
      })
    );

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const assignedStudentByTutorIdCount = async (req, res) => {
    try {
      const id = req.params.tutorId;
      const tutorAllocations = await Allocation.find({ tutor: id }).exec();
      if (!tutorAllocations) {
        return res
          .status(404)
          .json({ message: "No allocation found for this tutor" });
      }
  
      const students = await Promise.all(
        tutorAllocations.map(async (allocation) => {
          const student = await Student.findById(allocation.student);
          return student;
        })
      );
  
      res.status(200).json(students.length);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

export const upcommingMeetings = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const currentDate = new Date(); // Current date and time
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status : 1,
          dateTime: { $gte: currentDate },
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat());
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const upcommingMeetingCount = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const currentDate = new Date(); // Current date and time
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status : 1,
          dateTime: { $gte: currentDate },
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat().length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const pendingMeetings = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const currentDate = new Date(); // Current date and time
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status: 0,
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat());
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const pendingMeetingCount = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const currentDate = new Date(); // Current date and time
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status: 0,
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat().length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const meetingCompletedThisMonth = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status: 4,
          dateTime: { $gte: startOfMonth, $lte: endOfMonth },
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat().length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const confirmedMeetingTdy = async (req, res) => {
  try {
    const id = req.params.tutorId;
    const tutorAllocations = await Allocation.find({ tutor: id }).exec();
    if (!tutorAllocations) {
      return res
        .status(404)
        .json({ message: "No allocation found for this tutor" });
    }
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ); // Start of the day (00:00:00)
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    ); // End of the day (23:59:59)
    const meetings = await Promise.all(
      tutorAllocations.map(async (allocation) => {
        const meeting = await Meeting.find({
          allocationId: allocation._id,
          status: 1,
          dateTime: { $gte: startOfDay, $lte: endOfDay },
        }).exec();
        return meeting;
      })
    );

    res.status(200).json(meetings.flat().length);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const recentDocumentByTutor = async (req, res) => {
    try {
      const id = req.params.tutorId;
      const tutorAllocations = await Allocation.find({ tutor: id }).exec();
      if (!tutorAllocations) {
        return res
          .status(404)
          .json({ message: "No allocation found for this tutor" });
      }
      const documents = await Promise.all(
        tutorAllocations.map(async (allocation) => {
          const meeting = await Document.find({
            allocationId: allocation._id,
            role: "Tutor",
          }).limit(5).exec();
          return meeting;
        })
      );
  
      res.status(200).json(documents.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const recentCommentByTutor = async (req, res) => {
    try {
      const id = req.params.tutorId;
      const tutorAllocations = await Allocation.find({ tutor: id }).exec();
      if (!tutorAllocations) {
        return res
          .status(404)
          .json({ message: "No allocation found for this tutor" });
      }
      const documents = await Promise.all(
        tutorAllocations.map(async (allocation) => {
          const meeting = await Comment.find({
            allocationId: allocation._id,
            role: "Tutor",
          }).limit(2).exec();
          return meeting;
        })
      );
  
      res.status(200).json(documents.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const getLatestDocument = async (req, res) => {
    try {
        const document = await Document.find().sort({createdAt : -1}).limit(10)
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//Student

export const upcommingMeetingsOfStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this student" });
      }
      const currentDate = new Date(); // Current date and time
      const meetings = await Meeting.find({
        allocationId: studentAllocation._id,
        status : 1,
        dateTime: { $gte: currentDate },
      });
  
      res.status(200).json(meetings.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const upcommingMeetingCountOfStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this student" });
      }
      const currentDate = new Date(); // Current date and time
      const meetings = await Meeting.find({
        allocationId: studentAllocation._id,
        status : 1,
        dateTime: { $gte: currentDate },
      });
  
      res.status(200).json(meetings.flat().length);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const requestedMeetingsOfStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this tutor" });
      }
      const currentDate = new Date(); // Current date and time
      const meetings = await Meeting.find({
        allocationId: studentAllocation._id,
        status : 0,
        dateTime: { $gte: currentDate },
      });
  
      res.status(200).json(meetings.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const requestedMeetingCountOfStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this student" });
      }
      const currentDate = new Date(); // Current date and time
      const meetings = await Meeting.find({
        allocationId: studentAllocation._id,
        status : 0,
        dateTime: { $gte: currentDate },
      });
  
      res.status(200).json(meetings.flat().length);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const recentDocumentByStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this student" });
      }
      const meetings = await Document.find({
        allocationId: studentAllocation._id,
        role : 'Student'
      }).limit(5);
  
      res.status(200).json(meetings.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  export const recentCommentByStudent = async (req, res) => {
    try {
      const id = req.params.studentId;
      const studentAllocation = await Allocation.findOne({ student: id }).exec();
      if (!studentAllocation) {
        return res
          .status(404)
          .json({ message: "No allocation found for this student" });
      }
      const meetings = await Comment.find({
        allocationId: studentAllocation._id,
        role : 'Student'
      }).limit(2);
  
      res.status(200).json(meetings.flat());
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
