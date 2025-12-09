import express from "express";
import {
  submitRatingController,
  getAllUserRatingsController,
  getAllStoreAveragesController,
  getStoreRatingsController,
  deleteRatingController,
} from "../controller/ratings.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/submit", submitRatingController);

// Get all ratings by the authenticated user - for USER and ADMIN Dashboard
router.get("/user/all", getAllUserRatingsController);

// Get average ratings for all stores - for USER and ADMIN Dashboard
router.get("/averages/all", getAllStoreAveragesController);

// Get all ratings for a specific store - for OWNER Dashboard
router.get("/store/:storeId", getStoreRatingsController);

// Delete user's rating for a store - for USER Dashboard
router.delete("/:storeId", deleteRatingController);

export default router;
