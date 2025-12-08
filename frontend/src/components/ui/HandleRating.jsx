import { useState } from "react";
import StarRating from "./StarRating";
import { useRating } from "../../context/RatingContext";

export default function HandleRating({ storeId }) {
  const { getRating, setRating } = useRating();
  const [value, setValue] = useState(getRating(storeId));

  const handleRatingChange = (newRating) => {
    setValue(newRating);
    setRating(storeId, newRating);
  };

  return (
    <StarRating currentRating={value} onRatingChange={handleRatingChange} />
  );
}
