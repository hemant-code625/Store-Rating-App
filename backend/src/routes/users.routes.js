import express from "express";
import {
  getAllStoreListController,
  getAllUsersController,
} from "../controller/users.controller.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const router = express.Router();

router.get("/getUsers", isAdmin, getAllUsersController);
router.get("/getStores", verifyJWT, getAllStoreListController);

export default router;
