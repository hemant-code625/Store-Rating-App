import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
  // get token from cookies or authorization header
  // jwt.verify()
  // check if user role is admin
  // proceed to next middleware/controller
  try {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decodedToken.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      location: "isAdminMiddleware",
    });
  }
};

export { isAdmin };
