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
    let role = null;

    // Check which model the user belongs to
    const studentObj = await Student.findById(userId).select('-password');
    if (studentObj) {
      userObj = studentObj;
      role = 'Student'
    }

    const staffObj = await Staff.findById(userId).select('-password');
    if (staffObj) {
      userObj = staffObj;
      role = 'Staff'
    }

    const tutorObj = await Tutor.findById(userId).select('-password');
    if (tutorObj) {
      userObj = tutorObj;
      role = 'Tutor'
    }

    if (!userObj) {
        return res.status(404).json({ message: "User Doesn't Exist!" });
      }
    const activity = new UserActivity({
        user : userId,
        userModel : role,
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

export const logLogin = async(id, role, address) => {
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
    const activity = new UserActivity({
        user : id,
        userModel : formattedRole,
        activityType : 'login',
        ipAddress: address,
        timestamp: new Date()
    });

    activity.save();
}

export const getAll = async(req, res) => {
  try {
    const activities = await UserActivity.find().populate("user");
    if (!activities.length) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllByPage = async(req, res) => {
  try {
    const activities = await UserActivity.find({pageViewed : req.params.page}).populate("user");
    if (!activities.length) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const mostViewPage = async (req, res) => {
  try {
    const mostViewedPages = await UserActivity.aggregate([
      // Group by 'pageViewed' and count the occurrences
      {
        $group: {
          _id: "$pageViewed", // Group by the pageViewed field
          count: { $sum: 1 }  // Count the number of occurrences
        }
      },
      // Sort by count in descending order
      {
        $sort: { count: -1 }
      },
      // Limit to the top 10 results
      {
        $limit: 10
      },
      // Optionally, project the fields for a cleaner output
      {
        $project: {
          _id: 0,            // Exclude the default _id field
          page: "$_id",      // Rename _id to 'page'
          count: 1            // Include the count field
        }
      }
    ]);

    // Check if there are any results
    if (!mostViewedPages.length) {
      return res.status(404).json({ message: 'No activities found' });
    }

    // Return the top 10 most viewed pages
    res.status(200).json(mostViewedPages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const mostActiveUser = async (req, res) => {
  try {
    // Step 1: Aggregate to find the top 10 most active users
    const mostActiveUsers = await UserActivity.aggregate([
      // Group by 'userId' and count the occurrences
      {
        $group: {
          _id: "$user", // Group by the userId field
          count: { $sum: 1 } // Count the number of activities
        }
      },
      // Sort by count in descending order
      {
        $sort: { count: -1 }
      },
      // Limit to the top 10 results
      {
        $limit: 10
      },
      // Project the required fields
      {
        $project: {
          _id: 0, // Exclude the default _id field
          user: "$_id", // Include the userId
          count: 1 // Include the count
        }
      }
    ]);

    // Step 2: Check if there are any results
    if (!mostActiveUsers.length) {
      return res.status(404).json({ message: 'No active users found' });
    }

    // Step 3: Optionally, populate user details (if needed)
    const populatedUsers = await Promise.all(
      mostActiveUsers.map(async (user) => {
        // Determine if the user is a Student or Tutor
        const student = await Student.findById(user.user);
        const tutor = await Tutor.findById(user.user);
        const staff = await Staff.findById(user.user);

        // Add user details to the response
        user.user = student || tutor || staff;
        return user;
      })
    );

    // Step 4: Return the top 10 most active users
    res.status(200).json(populatedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


