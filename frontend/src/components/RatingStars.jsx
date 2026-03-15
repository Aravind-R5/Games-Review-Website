// -----------------------------------------------
// RatingStars Component
// -----------------------------------------------
// Interactive star rating input (1-5 stars).
// Used in review forms to let users select a rating.
// -----------------------------------------------

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

function RatingStars({ rating = 0, onRate, size = 24, interactive = true }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
          fill={star <= (hovered || rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          // Hover effect — preview the rating
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          // Click — set the rating
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
}

export default RatingStars;
