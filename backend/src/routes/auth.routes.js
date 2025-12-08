import express from "express";
import {
  signinController,
  signupController,
  userSignupController,
} from "../controller/auth.controller.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.post("/signin", signinController);
// signup route for admin to create store owners, admins and normal users
router.post("/signup", isAdmin, signupController);
// singup route for normal users
router.post("/user/signup", userSignupController);

export default router;
