import jsonwebtoken from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Unauthorized!");
  }

  try {
    const decoder = jsonwebtoken.verify(token, "secretkey");
    req.user = decoder;
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).send("Token not match!");
  }
}
