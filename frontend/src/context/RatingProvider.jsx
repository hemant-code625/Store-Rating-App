import { useState, useCallback, useEffect, useTransition } from "react";
import { fetchAPI } from "../config/api";
import { useAuth } from "./AuthContext";
import RatingContext from "./RatingContext";

export const RatingProvider = ({ children }) => {
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  // Store user ratings as an object with storeId as key
  const [ratings, setRatings] = useState(() => {
    if (!user?.id) return {};
    const savedRatings = sessionStorage.getItem(`ratings_${user.id}`);
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  // Store average ratings for each store
  const [averageRatings, setAverageRatings] = useState(() => {
    if (!user?.id) return {};
    const savedAvgRatings = sessionStorage.getItem(`averageRatings_${user.id}`);
    return savedAvgRatings ? JSON.parse(savedAvgRatings) : {};
  });

  // Load ratings when user changes
  useEffect(() => {
    if (user?.id) {
      const savedRatings = sessionStorage.getItem(`ratings_${user.id}`);
      const savedAvgRatings = sessionStorage.getItem(
        `averageRatings_${user.id}`
      );

      startTransition(() => {
        setRatings(savedRatings ? JSON.parse(savedRatings) : {});
        setAverageRatings(savedAvgRatings ? JSON.parse(savedAvgRatings) : {});
      });
    } else {
      startTransition(() => {
        setRatings({});
        setAverageRatings({});
      });
    }
  }, [user?.id]);

  // Submit rating to API and update local state
  const setRating = useCallback(
    async (storeId, rating) => {
      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      try {
        // Submit to backend
        const response = await fetchAPI("/api/ratings/submit", {
          method: "POST",
          body: JSON.stringify({
            storeId: Number(storeId),
            rating: Number(rating),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Update local state
          setRatings((prevRatings) => {
            const updatedRatings = {
              ...prevRatings,
              [storeId]: rating,
            };
            sessionStorage.setItem(
              `ratings_${user.id}`,
              JSON.stringify(updatedRatings)
            );
            return updatedRatings;
          });

          // Update average rating from server response
          if (data.data && data.data.averageRating) {
            setAverageRatings((prevAvgRatings) => {
              const newAvgRatings = {
                ...prevAvgRatings,
                [storeId]: data.data.averageRating,
              };
              sessionStorage.setItem(
                `averageRatings_${user.id}`,
                JSON.stringify(newAvgRatings)
              );
              return newAvgRatings;
            });
          }

          return { success: true, data: data.data };
        } else {
          console.error("Failed to submit rating:", data.message);
          return { success: false, error: data.message };
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        return { success: false, error: "Failed to submit rating" };
      }
    },
    [user]
  );

  // Fetch user's rating for a store from API (single store - rarely used)
  const fetchUserRating = useCallback(
    async (storeId) => {
      if (!user?.id) return 0;

      try {
        const response = await fetchAPI(`/api/ratings/user/${storeId}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok && data.data) {
          const rating = data.data.rating || 0;

          // Update local state
          setRatings((prevRatings) => {
            const updatedRatings = {
              ...prevRatings,
              [storeId]: rating,
            };
            sessionStorage.setItem(
              `ratings_${user.id}`,
              JSON.stringify(updatedRatings)
            );
            return updatedRatings;
          });

          return rating;
        }
        return 0;
      } catch (error) {
        console.error("Error fetching user rating:", error);
        return 0;
      }
    },
    [user]
  );

  // Fetch all user ratings and all store averages in one call (OPTIMIZED)
  const initializeAllRatings = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch user's ratings and store averages in parallel
      const [userRatingsResponse, storeAveragesResponse] = await Promise.all([
        fetchAPI("/api/ratings/user/all", { method: "GET" }),
        fetchAPI("/api/ratings/averages/all", { method: "GET" }),
      ]);

      const userRatingsData = await userRatingsResponse.json();
      const storeAveragesData = await storeAveragesResponse.json();

      const allUserRatings = {};
      const allAverageRatings = {};

      // Process user ratings
      if (userRatingsResponse.ok && userRatingsData.data?.ratings) {
        Object.entries(userRatingsData.data.ratings).forEach(
          ([storeId, ratingData]) => {
            allUserRatings[storeId] = ratingData.rating;
          }
        );
      }

      // Process store averages
      if (storeAveragesResponse.ok && storeAveragesData.data?.averages) {
        Object.entries(storeAveragesData.data.averages).forEach(
          ([storeId, avgData]) => {
            allAverageRatings[storeId] = avgData.averageRating;
          }
        );
      }

      // Update state with all ratings
      startTransition(() => {
        setRatings(allUserRatings);
        setAverageRatings(allAverageRatings);
      });

      // Persist to sessionStorage
      sessionStorage.setItem(
        `ratings_${user.id}`,
        JSON.stringify(allUserRatings)
      );
      sessionStorage.setItem(
        `averageRatings_${user.id}`,
        JSON.stringify(allAverageRatings)
      );
    } catch (error) {
      console.error("Error initializing ratings:", error);
    }
  }, [user]); // Fetch all store ratings from API
  const fetchStoreRatings = useCallback(
    async (storeId) => {
      if (!user?.id) return null;

      try {
        const response = await fetchAPI(`/api/ratings/store/${storeId}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok && data.data) {
          // Update average rating
          setAverageRatings((prevAvgRatings) => {
            const newAvgRatings = {
              ...prevAvgRatings,
              [storeId]: data.data.averageRating || 0,
            };
            sessionStorage.setItem(
              `averageRatings_${user.id}`,
              JSON.stringify(newAvgRatings)
            );
            return newAvgRatings;
          });

          return data.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching store ratings:", error);
        return null;
      }
    },
    [user]
  );

  const getRating = useCallback(
    (storeId) => {
      return ratings[storeId] || 0;
    },
    [ratings]
  );

  const getAverageRating = useCallback(
    (storeId) => {
      return averageRatings[storeId] || 0;
    },
    [averageRatings]
  );

  const clearRating = useCallback(
    async (storeId) => {
      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      try {
        // Delete from backend
        const response = await fetchAPI(`/api/ratings/${storeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Update local state
          setRatings((prevRatings) => {
            const updatedRatings = { ...prevRatings };
            delete updatedRatings[storeId];
            sessionStorage.setItem(
              `ratings_${user.id}`,
              JSON.stringify(updatedRatings)
            );
            return updatedRatings;
          });

          // Refresh average rating
          await fetchStoreRatings(storeId);

          return { success: true };
        }
        return { success: false };
      } catch (error) {
        console.error("Error deleting rating:", error);
        return { success: false };
      }
    },
    [user, fetchStoreRatings]
  );

  const clearAllRatings = useCallback(() => {
    if (!user?.id) return;

    setRatings({});
    setAverageRatings({});
    sessionStorage.removeItem(`ratings_${user.id}`);
    sessionStorage.removeItem(`averageRatings_${user.id}`);
  }, [user]);

  const value = {
    ratings,
    averageRatings,
    setRating,
    getRating,
    getAverageRating,
    fetchUserRating,
    fetchStoreRatings,
    initializeAllRatings,
    clearRating,
    clearAllRatings,
  };

  return (
    <RatingContext.Provider value={value}>{children}</RatingContext.Provider>
  );
};

export default RatingProvider;
