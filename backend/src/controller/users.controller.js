import { dbQuery } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllUsersController = async (req, res) => {
  // fetch all users from the database
  try {
    const userArray = await dbQuery(
      "SELECT id, name, address, email, role FROM user",
      []
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully.", userArray));
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", null));
  }
};

const getAllStoreListController = async (req, res) => {
  try {
    const storeArray = await dbQuery(
      "SELECT id, name, address, role FROM user WHERE role = 'OWNER'",
      []
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "Stores fetched successfully.", storeArray));
  } catch (error) {
    console.error("Error fetching stores: ", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", null));
  }
};

export { getAllUsersController, getAllStoreListController };
