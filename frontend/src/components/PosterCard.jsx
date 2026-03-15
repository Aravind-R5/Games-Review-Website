// -----------------------------------------------
// PosterCard Component
// -----------------------------------------------
// Displays a movie or game poster with hover effect
// showing title, year, rating, and a quick review button.
// -----------------------------------------------

import { useNavigate } from 'react-router-dom';
import { FiStar, FiEdit3 } from 'react-icons/fi';

function PosterCard({ item, type = 'game' }) {
  const navigate = useNavigate();

  // Navigate to detail page on click
  const handleClick = () => {
    navigate(`/game/${item.id}`);
  };

  // Resolve poster image URL
  const getPosterUrl = () => {
    if (!item.poster_url) return 'https://via.placeholder.com/300x450?text=No+Poster';
    return item.poster_url;
  };

  const posterUrl = getPosterUrl();

  return (
    <div className="poster-card animate-in" onClick={handleClick}>
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt={item.title}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
        }}
      />

      {/* Hover Overlay with Info */}
      <div className="poster-overlay">
        <div className="poster-title">{item.title}</div>
        <div className="poster-year">{item.year}</div>

        {/* Rating */}
        <div className="poster-rating">
          <FiStar fill="currentColor" size={14} />
          <span>{item.rating?.toFixed(1) || 'N/A'}</span>
        </div>

        {/* Platform badge for games */}
        {item.platform_display && (
          <span className="platform-badge">{item.platform_display}</span>
        )}

        {/* Quick Review Button */}
        <button
          className="poster-quick-review"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            navigate(`/game/${item.id}`);
          }}
        >
          <FiEdit3 size={12} />
          Review
        </button>
      </div>
    </div>
  );
}

export default PosterCard;
