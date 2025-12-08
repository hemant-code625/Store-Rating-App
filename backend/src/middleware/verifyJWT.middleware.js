import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { dbQuery } from "../db/index.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiError(401, "Access token missing."));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json(new ApiError(401, "Access token expired."));
      }
      return res.status(401).json(new ApiError(401, "Invalid access token."));
    }

    const user = await dbQuery(
      "SELECT id, name, email, role FROM user WHERE id = ?",
      [decodedToken.id]
    );

    if (user.length === 0) {
      return res.status(401).json(new ApiError(401, "User not found."));
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error."));
  }
};

export { verifyJWT };
