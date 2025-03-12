import Staff from "../Model/Staff.js";
import Student from "../Model/Student.js";
import Tutor from "../Model/Tutor.js";
import UserActivity from "../Model/UserActivity.js";

export const logActivity =  async (req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'];
    console.log(ip);

    const { activityType, pageViewed, browserInfo, deviceInfo, ipAddress } = req.body;

    const userId = req.user.id

    let userObj = null;

    // Check which model the user belongs to
    const studentObj = await Student.findById(userId).select('-password');
    if (studentObj) {
      userObj = studentObj;
    }

    const staffObj = await Staff.findById(userId).select('-password');
    if (staffObj) {
      userObj = staffObj;
    }

    const tutorObj = await Tutor.findById(userId).select('-password');
    if (tutorObj) {
      userObj = tutorObj;
    }

    if (!userObj) {
        return res.status(404).json({ message: "User Doesn't Exist!" });
      }
    const activity = new UserActivity({
        userId,
        activityType,
        pageViewed, 
        browserInfo, // From frontend
        deviceInfo, // From frontend
        ipAddress: ip || ipAddress,
        timestamp: new Date()
    });

    activity.save();
    res.status(201).json({success : true, message : 'Activity logged' });
}

export const logLogin = async(id, address) => {
    const activity = new UserActivity({
        userId : id,
        activityType : 'login',
        ipAddress: address,
        timestamp: new Date()
    });

    activity.save();
}


