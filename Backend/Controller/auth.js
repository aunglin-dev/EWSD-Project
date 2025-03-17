import bcrypt from "bcryptjs";
import Student from "../Model/Student.js";
import Staff from "../Model/Staff.js";
import Tutor from "../Model/Tutor.js";
import { ErrorHandler } from "../Utils/error.js";
import Jwt from "jsonwebtoken";
import Allocation from "../Model/Allocation.js";
import { logLogin } from "./userActivityController.js";
import { forgotPasswordEmail } from "../Service/emailTemplates.js";
import emailTransporter, { emailAddress } from "../Service/emailService.js";

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

    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
    console.log(formattedRole);
    //Find user from database
    const user =
      formattedRole === "Staff"
        ? await Staff.findOne({ email })
        : formattedRole === "Student"
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
    if (formattedRole == "Student") {
      allocations = await Allocation.find({ student: user._id });
    }

    if (formattedRole == "Tutor") {
      allocations = await Allocation.find({ tutor: user._id });
    }

    //Create a token
    const Usertoken = { name: user.name, id: user._id };

    const token = Jwt.sign(Usertoken, process.env.SECRET);

    //Retrive data except password
    const { password, ...other } = user._doc;

    const address = req.ip || req.headers["x-forwarded-for"];
    user.lastLoginDate = new Date();
    const userModal = formattedRole;
    await user.save();
    await logLogin(user._id, userModal, address, formattedRole);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json({ ...other, allocations });
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
    const studentObj = await Student.findById(id).select("-password");
    if (studentObj) {
      userObj = studentObj;
      role = "Student";
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
    let allocations = null;
    if (role == "Student") {
      allocations = await Allocation.find({ student: userObj._id });
    }

    if (role == "Tutor") {
      allocations = await Allocation.find({ tutor: userObj._id });
    }

    // Return user info along with role
    return res.json({
      success: true,
      message: `${userObj.name} fetched!`,
      data: { ...userObj.toObject(), role, allocations },
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const user =
    formattedRole === "Staff"
      ? await Staff.findOne({ email })
      : formattedRole === "Student"
      ? await Student.findOne({ email })
      : await Tutor.findOne({ email });

  if (!user) return next(ErrorHandler(400, "Invalid Email or Role"));

  const token = Jwt.sign({ email, formattedRole }, process.env.SECRET, {
    expiresIn: "1h",
  });

  const forgotPasswordEmailDraft = forgotPasswordEmail(user, token);

  const userMailOptions = {
    from: emailAddress,
    to: user.email,
    subject: forgotPasswordEmailDraft.subject,
    text: forgotPasswordEmailDraft.text,
    html: forgotPasswordEmailDraft.html,
  };

  const send = await emailTransporter.sendMail(userMailOptions);
  console.log(send);

  res.status(200).json({
    message: "Mail Sent Successfully",
    status: true,
  });
};

export const handleForgotPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    console.log(token);
    if (!token) {
      return res.status(400).send(`<p>Token not found!</p>`);
    }

    // Verify the token
    const { email, formattedRole } = Jwt.verify(token, process.env.SECRET);

    // Render a form for password reset
    res.send(`
      <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .reset-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      .reset-form h2 {
        margin-bottom: 1.5rem;
        color: #333;
      }
      .reset-form input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
      }
      .reset-form button {
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .reset-form button:hover {
        background-color: #0056b3;
      }
      .reset-form p {
        margin-top: 1rem;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="reset-form">
      <h2>Reset Your Password</h2>
      <form id="resetForm" action="/api/auth/reset-password" method="POST">
        <input type="hidden" name="token" value="${token}" />
        <input type="password" name="newPassword" placeholder="Enter New Password" required />
        <button type="submit">Reset Password</button>
      </form>
      <p>Enter a new password and click "Reset Password" to update.</p>
    </div>

    <script>
      document.getElementById('resetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        alert(result.message);
        if (response.ok) {
          window.location.href = 'http://localhost:3000'; // Redirect to login page
        }
      });
    </script>
  </body>
  </html>
    `);
  } catch (err) {
    return next(ErrorHandler(400, err.message));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token again for security
    const decoded = Jwt.verify(token, process.env.SECRET);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const role = decoded.formattedRole;
    const email = decoded.email;
    if (role === "Student") {
      await Student.updateOne({ email }, { password: hashedPassword });
    }
    if (role === "Tutor") {
      await Tutor.updateOne({ email }, { password: hashedPassword });
    }
    if (role === "Staff") {
      await Staff.updateOne({ email }, { password: hashedPassword });
    }

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    return next(ErrorHandler(400, err.message));
  }
};
