import express from "express";
import {
  signinController,
  signupController,
} from "../controller/auth.controller.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.post("/signin", signinController);
router.post("/signup", isAdmin, signupController);

export default router;
