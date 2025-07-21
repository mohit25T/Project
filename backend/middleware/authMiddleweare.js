import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // ✅ Check token in cookies first
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // ✅ If no token in cookies, check headers
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.error("No Token Found!");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export { protect };
