import { createContext, useContext, useState, useCallback } from "react";

const RatingContext = createContext(null);

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
};

export const RatingProvider = ({ children }) => {
  // Store ratings as an object with storeId as key
  const [ratings, setRatings] = useState(() => {
    const savedRatings = sessionStorage.getItem("ratings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  const setRating = useCallback((storeId, rating) => {
    setRatings((prevRatings) => {
      const updatedRatings = {
        ...prevRatings,
        [storeId]: rating,
      };
      // Persist to sessionStorage
      sessionStorage.setItem("ratings", JSON.stringify(updatedRatings));
      return updatedRatings;
    });
  }, []);

  const getRating = useCallback(
    (storeId) => {
      return ratings[storeId] || 0;
    },
    [ratings]
  );

  const clearRating = useCallback((storeId) => {
    setRatings((prevRatings) => {
      const updatedRatings = { ...prevRatings };
      delete updatedRatings[storeId];
      sessionStorage.setItem("ratings", JSON.stringify(updatedRatings));
      return updatedRatings;
    });
  }, []);

  const clearAllRatings = useCallback(() => {
    setRatings({});
    sessionStorage.removeItem("ratings");
  }, []);

  const value = {
    ratings,
    setRating,
    getRating,
    clearRating,
    clearAllRatings,
  };

  return (
    <RatingContext.Provider value={value}>{children}</RatingContext.Provider>
  );
};

export default RatingContext;
