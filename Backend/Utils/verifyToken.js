import Jwt from "jsonwebtoken";
import { ErrorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const Token = req.cookies.access_token;
  //Check Token Exsitence
  if (!Token) return next(ErrorHandler(401, "You have no access"));

  const PrimaryToken = process.env.SECRET;
  Jwt.verify(Token, PrimaryToken, (err, data) => {
    if (err) return next(ErrorHandler(403, "You have no validation"));
    req.user = data;

    next();
  });
};
