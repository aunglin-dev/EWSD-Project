import bcrypt from "bcryptjs";
import Student from "../Model/Student.js";
import Staff from "../Model/Staff.js";
import Tutor from "../Model/Tutor.js";
import { ErrorHandler } from "../Utils/error.js";
import Jwt from "jsonwebtoken";
import Allocation from "../Model/Allocation.js";
import { logLogin } from "./userActivityController.js";

//Registeration
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new Student({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("Successfully User added");
  } catch (err) {
    next(err);
  }
};

//Login Student
export const signin = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    //Find user from database
    const user =
      role === "staff"
        ? await Staff.findOne({ email })
        : role === "student"
        ? await Student.findOne({ email })
        : await Tutor.findOne({ email });

    //Check Password
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(req.body.password, user.password);

    if (!(user && passwordCorrect))
      return next(ErrorHandler(400, "Invalid Username or Password"));

    let allocations = null;
    if(role == "student"){
      allocations = await Allocation.find({student : user._id});
    }

    if(role == "tutor"){
      allocations = await Allocation.find({tutor : user._id});
    }

    //Create a token
    const Usertoken = { name: user.name, id: user._id };

    const token = Jwt.sign(Usertoken, process.env.SECRET);

    //Retrive data except password
    const { password, ...other } = user._doc;

    const address = req.ip || req.headers['x-forwarded-for'];
    user.lastLoginDate = new Date();
    const userModal = role.charAt(0).toUpperCase() + role.slice(1);
    await user.save()
    await logLogin(user._id, userModal, address, role);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        domain : "localhost",
        sameSite : "lax",
        secure : false
      })
      .status(200)
      .json({...other, allocations});
  } catch (err) {
    next(err);
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
      role = "Student";
    }

    const staffObj = await Staff.findById(id).select('-password');
    if (staffObj) {
      userObj = staffObj;
      role = "Staff";
    }

    const tutorObj = await Tutor.findById(id).select('-password');
    if (tutorObj) {
      userObj = tutorObj;
      role = "Tutor";
    }

    // If user is not found
    if (!userObj) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    let allocations = null;
    if(role == "Student"){
      allocations = await Allocation.find({student : userObj._id});
    }

    if(role == "Tutor"){
      allocations = await Allocation.find({tutor : userObj._id});
    }

    // Return user info along with role
    return res.json({success : true, message: `${userObj.name} fetched!` ,data: { ...userObj.toObject(), role, allocations } });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
