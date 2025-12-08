import bcrypt from "bcrypt";
import { dbQuery } from "../db/index.js";
import { generateTokens } from "../utils/generateTokens.js";
import { validateSignupDetails } from "../utils/validateSingupDetails.js";

const signupController = async (req, res) => {
  // get user details from request body
  // validate user details
  // check if user with email already exists
  // hash password
  // create new user in the database
  // generate tokens
  // send response
  const { name, address, email, password } = req.body;

  const validDetails = validateSignupDetails(name, address, email, password);

  if (validDetails.length > 0) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validDetails,
    });
  }

  try {
    const existingUser = await dbQuery("SELECT * FROM user WHERE email = ?", [
      email.toLowerCase(),
    ]).then((results) => results[0]);

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await dbQuery(
      "INSERT INTO user (name, address, email, password) VALUES (?, ?, ?, ?)",
      [name, address, email.toLowerCase(), hashedPassword]
    );

    const { accessToken, refreshToken } = generateTokens({
      id: newUser.insertId,
      name,
      email: email.toLowerCase(),
      role: "USER", // default role
    });

    return res.status(201).json({
      message: "User signed up successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      location: "signupController",
    });
  }
};

const signinController = async (req, res) => {
  // get the user details from request body
  // check if user exists
  // validate password
  // generate token
  // remove password from user object
  // send cookies within the response
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    errors.push("Email must be a valid email address.");
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    // BUG: MySQL pool timeout using adapter (rust free engine), https://github.com/prisma/prisma/issues/28612
    // const existingUser = await prisma.user.findUnique({ where: { email } });

    const existingUser = await dbQuery("SELECT * FROM user WHERE email = ?", [
      email,
    ]).then((results) => results[0]);

    if (!existingUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    delete existingUser.password;
    const { accessToken, refreshToken } = generateTokens(existingUser);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        user: existingUser,
        message: "User signed in successfully.",
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      location: "signinController",
    });
  }
};

export { signupController, signinController };
