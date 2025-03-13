import jwt from "jsonwebtoken";
import Student from "../Model/Student.js";
import Staff from "../Model/Staff.js";
import Tutor from "../Model/Tutor.js";
import UserActivity from "../Model/UserActivity.js";

const activityLogger = async (req, res, next) => {
  try {
    // Check if access_token exists in cookies
    const token = req.cookies.access_token;
    if (!token) return next(); // No token, move to next middleware
    // Verify and decode token
    const {id} = jwt.verify(token, process.env.SECRET);
    const userId = id; // Adjust based on your token payload structure

    let userObj = null;
    let role = null;

    // Check which model the user belongs to
    const studentObj = await Student.findById(id).select("-password");
    if (studentObj) {
      userObj = studentObj;
      role = "Student";
      studentObj.lastInteractionDate = new Date();
      await studentObj.save();
    }

    const staffObj = await Staff.findById(id).select("-password");
    if (staffObj) {
      userObj = staffObj;
      role = "Staff";
    }

    const tutorObj = await Tutor.findById(id).select("-password");
    if (tutorObj) {
      userObj = tutorObj;
      role = "Tutor";
    }

    // If user is not found
    if (!userObj) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Log only for specific methods
    if (["GET", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const activity = new UserActivity({
        user : userId,
        userModel : role,
        activityType: req.method, // Fetching, Updating, or Deleting
        pageViewed: req.originalUrl, // Capture the accessed route
        browserInfo: req.headers["user-agent"], // Browser details
        deviceInfo: req.headers["sec-ch-ua-platform"], // OS info
        ipAddress: req.ip, // IP Address
      });

      await activity.save(); // Store in DB
    }
  } catch (error) {
    console.error("Activity Logging Error:", error.message);
  }
  next(); // Continue with request processing
};

export default activityLogger;
