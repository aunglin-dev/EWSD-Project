import jwt from "jsonwebtoken";
import Student from "../Model/Student.js";
import Staff from "../Model/Staff.js";
import Tutor from "../Model/Tutor.js";
import UserActivity from "../Model/UserActivity.js";
import { UAParser } from "ua-parser-js";

const activityLogger = async (req, res, next) => {
  try {
    // Check if access_token exists in cookies
    const token = req.cookies.access_token;
    if (!token) return next(); // No token, move to next middleware
    // Verify and decode token
    const { id } = jwt.verify(token, process.env.SECRET);
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

    if (["GET", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const userAgent = req.headers["user-agent"];
      const isPostman = userAgent.includes("PostmanRuntime"); // Check if the request is from Postman

      // Parse browser, device, and OS info if not Postman
      const parser = new UAParser(userAgent);
      const browserInfo = isPostman ? null : parser.getBrowser();
      const deviceInfo = isPostman ? null : parser.getDevice();
      const osInfo = isPostman ? null : parser.getOS();

      // Format device info (if not Postman)
      const formattedDeviceInfo = deviceInfo
        ? `${deviceInfo.vendor || ""} ${deviceInfo.model || ""} ${
            deviceInfo.type || ""
          }`.trim()
        : "Desktop/Laptop";

      const activity = new UserActivity({
        user: userId,
        userModel: role,
        activityType: req.method, // Fetching, Updating, or Deleting
        pageViewed: req.originalUrl, // Capture the accessed route
        browserInfo: isPostman
          ? "postman"
          : `${browserInfo.name} ${browserInfo.version}`, // Set to 'postman' if request is from Postman
        deviceInfo: isPostman ? "postman" : formattedDeviceInfo, // Set to 'postman' if request is from Postman
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
