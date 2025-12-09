import express from "express";
import {
  submitRatingController,
  getAllUserRatingsController,
  getAllStoreAveragesController,
  getStoreRatingsController,
  deleteRatingController,
} from "../controller/ratings.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/submit", submitRatingController);

router.get("/user/all", getAllUserRatingsController);

// Get average ratings for all stores
router.get("/averages/all", isAdmin, getAllStoreAveragesController);

// Get all ratings for a specific store
router.get("/store/:storeId", getStoreRatingsController);

// Delete user's rating for a store
router.delete("/:storeId", deleteRatingController);

export default router;
