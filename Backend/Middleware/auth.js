import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

export default function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    try {
        const decoder = jsonwebtoken.verify(token, process.env.SECRET);
        req.user = decoder;
        next();
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: "Token not match!" });
    }
}