import bcrypt from "bcryptjs";
import Student from "../Model/Student.js";
import { ErrorHandler } from "../Utils/error.js";
import Jwt from "jsonwebtoken";

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
        const { email } = req.body;

        //Find user from database
        const user = await Student.findOne({ email });

        //Check Password
        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(req.body.password, user.password);

        if (!(user && passwordCorrect))
            return next(ErrorHandler(400, "Invalid Username or Password"));

        //Create a token
        const Usertoken = { name: user.name, id: user._id };

        const token = Jwt.sign(Usertoken, process.env.SECRET);

        //Retrive data except password
        const { password, ...other } = user._doc;

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(other);
    } catch (err) {
        next(err);
    }
};