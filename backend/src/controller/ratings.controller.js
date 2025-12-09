import { dbQuery } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Submit or update a rating for a store (user with OWNER role)
const submitRatingController = async (req, res) => {
  const { storeId, rating } = req.body; // storeId is actually the owner user's id
  const userId = req.user.id; // From JWT middleware

  // Validate input
  if (!storeId || !rating) {
    return res
      .status(400)
      .json(new ApiError(400, "Store ID and rating are required."));
  }

  // Validate rating value (1-5)
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json(new ApiError(400, "Rating must be between 1 and 5."));
  }

  try {
    // Check if store owner exists and has OWNER role
    const storeOwner = await dbQuery(
      "SELECT * FROM user WHERE id = ? AND role = 'OWNER'",
      [storeId]
    ).then((results) => results[0]);

    if (!storeOwner) {
      return res.status(404).json(new ApiError(404, "Store not found."));
    }

    // Prevent users from rating themselves
    if (userId === storeId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot rate your own store."));
    }

    // Check if user has already rated this store
    const existingRating = await dbQuery(
      "SELECT * FROM rating WHERE userId = ? AND storeId = ?",
      [userId, storeId]
    ).then((results) => results[0]);

    if (existingRating) {
      // Update existing rating
      await dbQuery(
        "UPDATE rating SET rating = ?, updatedAt = NOW() WHERE userId = ? AND storeId = ?",
        [rating, userId, storeId]
      );
    } else {
      // Insert new rating
      await dbQuery(
        "INSERT INTO rating (userId, storeId, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
        [userId, storeId, rating]
      );
    }

    // Calculate new average rating for the store
    const ratingStats = await dbQuery(
      "SELECT AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM rating WHERE storeId = ?",
      [storeId]
    ).then((results) => results[0]);

    const averageRating = ratingStats.avgRating
      ? Math.round(ratingStats.avgRating * 10) / 10
      : 0;

    return res.status(200).json(
      new ApiResponse(
        200,
        existingRating
          ? "Rating updated successfully."
          : "Rating submitted successfully.",
        {
          rating,
          averageRating,
          totalRatings: ratingStats.ratingsCount,
        }
      )
    );
  } catch (error) {
    console.error("Error in submitRatingController:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while submitting the rating.")
      );
  }
};

// Get all ratings given by the authenticated user
const getAllUserRatingsController = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all ratings by this user
    const ratings = await dbQuery(
      "SELECT r.storeId, r.rating, r.createdAt, r.updatedAt, u.name as storeName, u.address as storeAddress FROM rating r INNER JOIN user u ON r.storeId = u.id WHERE r.userId = ?",
      [userId]
    );

    // Transform to object with storeId as key for easier frontend access
    const ratingsMap = {};
    ratings.forEach((rating) => {
      ratingsMap[rating.storeId] = {
        rating: rating.rating,
        storeName: rating.storeName,
        storeAddress: rating.storeAddress,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      };
    });

    return res.status(200).json(
      new ApiResponse(200, "User ratings fetched successfully.", {
        ratings: ratingsMap,
        totalRatings: ratings.length,
      })
    );
  } catch (error) {
    console.error("Error in getAllUserRatingsController:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch user ratings."));
  }
};

// Get average ratings for all stores
const getAllStoreAveragesController = async (req, res) => {
  try {
    // Get all stores (users with OWNER role) with their average ratings
    const storeAverages = await dbQuery(
      `SELECT 
        u.id as storeId, 
        u.name as storeName,
        AVG(r.rating) as avgRating,
        COUNT(r.id) as ratingsCount
      FROM user u
      LEFT JOIN rating r ON u.id = r.storeId
      WHERE u.role = 'OWNER'
      GROUP BY u.id, u.name`
    );

    // Transform to object with storeId as key
    const averagesMap = {};
    storeAverages.forEach((store) => {
      averagesMap[store.storeId] = {
        averageRating: store.avgRating
          ? Math.round(store.avgRating * 10) / 10
          : 0,
        totalRatings: store.ratingsCount || 0,
        storeName: store.storeName,
      };
    });

    return res.status(200).json(
      new ApiResponse(200, "Store averages fetched successfully.", {
        averages: averagesMap,
        totalStores: storeAverages.length,
      })
    );
  } catch (error) {
    console.error("Error in getAllStoreAveragesController:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch store averages."));
  }
};

// Get all ratings for a specific store
const getStoreRatingsController = async (req, res) => {
  const { storeId } = req.params;

  try {
    // Check if store owner exists and has OWNER role
    const storeOwner = await dbQuery(
      "SELECT * FROM user WHERE id = ? AND role = 'OWNER'",
      [storeId]
    ).then((results) => results[0]);

    if (!storeOwner) {
      return res.status(404).json(new ApiError(404, "Store not found."));
    }

    // Get all ratings for the store with user details
    const ratings = await dbQuery(
      "SELECT r.id, r.rating, r.createdAt, r.updatedAt, u.id as userId, u.name as userName, u.email as userEmail FROM rating r INNER JOIN user u ON r.userId = u.id WHERE r.storeId = ? ORDER BY r.updatedAt DESC",
      [storeId]
    );

    // Calculate average rating
    const ratingStats = await dbQuery(
      "SELECT AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM rating WHERE storeId = ?",
      [storeId]
    ).then((results) => results[0]);

    const averageRating = ratingStats.avgRating
      ? Math.round(ratingStats.avgRating * 10) / 10
      : 0;

    return res.status(200).json(
      new ApiResponse(200, "Ratings fetched successfully.", {
        ratings,
        averageRating,
        totalRatings: ratingStats.ratingsCount || 0,
        storeName: storeOwner.name,
        storeAddress: storeOwner.address,
      })
    );
  } catch (error) {
    console.error("Error in getStoreRatingsController:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch store ratings."));
  }
};

// Delete user's rating for a store
const deleteRatingController = async (req, res) => {
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    // Check if rating exists
    const existingRating = await dbQuery(
      "SELECT * FROM rating WHERE userId = ? AND storeId = ?",
      [userId, storeId]
    ).then((results) => results[0]);

    if (!existingRating) {
      return res.status(404).json(new ApiError(404, "Rating not found."));
    }

    // Delete the rating
    await dbQuery("DELETE FROM rating WHERE userId = ? AND storeId = ?", [
      userId,
      storeId,
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Rating deleted successfully."));
  } catch (error) {
    console.error("Error in deleteRatingController:", error);
    return res.status(500).json(new ApiError(500, "Failed to delete rating."));
  }
};

export {
  submitRatingController,
  getAllUserRatingsController,
  getAllStoreAveragesController,
  getStoreRatingsController,
  deleteRatingController,
};
