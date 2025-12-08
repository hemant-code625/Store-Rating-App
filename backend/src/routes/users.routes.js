import express from "express";
import { getAllUsersController } from "../controller/users.controller.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.get("/getUsers", isAdmin, getAllUsersController);

export default router;
