import bcrypt from "bcryptjs";
import Student from "../Model/Student.js";
import Jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";
import Tutor from "../Model/Tutor.js";
import Staff from "../Model/Staff.js";

// login schema
const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required().min(3).max(255),
});

// Login
export const signin = async (req, res) => {
  try {
    // Validate the request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    console.log(password);
    
    // Check which model the user belongs to
    let userObj = null;
    let role = null;

    const studentObj = await Student.findOne({ email });
    if (studentObj) {
      userObj = studentObj;
      role = "student";
    }

    const staffObj = await Staff.findOne({ email });
    if (staffObj) {
      userObj = staffObj;
      role = "staff";
    }

    const tutorObj = await Tutor.findOne({ email });
    if (tutorObj) {
      userObj = tutorObj;
      role = "tutor";
    }

    // If user is not found in any model
    if (!userObj) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    console.log(userObj);

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // Generate authentication token with role
    const Usertoken = { name: userObj.name, id: userObj._id, role };
    const token = Jwt.sign(Usertoken, process.env.SECRET, { expiresIn: "7d" });

    // Send token in the response headers
    res.header("Access-Control-Expose-Headers", "x-auth-token");

    return res
      .header("x-auth-token", token)
      .json({ message: "Login Successfully!" });

  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const id = req.user.id; // Get the authenticated user's ID from the middleware
    let userObj = null;
    let role = null;

    // Check which model the user belongs to
    const studentObj = await Student.findById(id).select('-password');
    if (studentObj) {
      userObj = studentObj;
      role = "student";
    }

    const staffObj = await Staff.findById(id).select('-password');
    if (staffObj) {
      userObj = staffObj;
      role = "staff";
    }

    const tutorObj = await Tutor.findById(id).select('-password');
    if (tutorObj) {
      userObj = tutorObj;
      role = "tutor";
    }

    // If user is not found
    if (!userObj) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Return user info along with role
    return res.json({ data: { ...userObj.toObject(), role } });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

