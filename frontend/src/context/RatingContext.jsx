import { createContext, useContext } from "react";

const RatingContext = createContext(null);

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
};

export default RatingContext;
