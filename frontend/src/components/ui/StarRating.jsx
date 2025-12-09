import { useEffect, useState } from "react";

const StarRating = ({ currentRating = 0, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(currentRating);

  // Sync internal state when the parent updates currentRating (e.g., after async fetch)
  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleMouseEnter = (value) => setHoverRating(value);
  const handleMouseLeave = () => setHoverRating(0);
  const handleClick = (value) => {
    setRating(value);
    onRatingChange(value);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-8 h-8 cursor-pointer transition-all duration-300 ${
            star <= (hoverRating || rating)
              ? "text-yellow-400 transform scale-110"
              : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 100 100"
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
        >
          <polygon
            points="50,10 61,35 88,35 68,55 79,80 50,65 21,80 32,55 12,35 39,35"
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
