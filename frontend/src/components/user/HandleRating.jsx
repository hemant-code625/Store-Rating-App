import { useEffect, useState } from "react";
import StarRating from "../ui/StarRating";
import { useRating } from "../../context/RatingContext";

export default function HandleRating({ storeId }) {
  const { getRating, setRating } = useRating();
  const [value, setValue] = useState(getRating(storeId));

  // Update local value when context rating changes (e.g., after fetch)
  useEffect(() => {
    setValue(getRating(storeId));
  }, [getRating, storeId]);

  const handleRatingChange = (newRating) => {
    setValue(newRating);
    setRating(storeId, newRating);
  };

  return (
    <StarRating currentRating={value} onRatingChange={handleRatingChange} />
  );
}
