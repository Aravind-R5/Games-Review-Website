// -----------------------------------------------
// ReviewCard Component
// -----------------------------------------------
// Displays a single user review with avatar, item info,
// star rating, and review comment text.
// -----------------------------------------------

import { FiStar } from 'react-icons/fi';

function ReviewCard({ review }) {
  // Generate avatar URL (using DiceBear for demo)
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.username || 'user'}`;

  // Render star rating (1-5 filled stars)
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={14}
        fill={i < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
      />
    ));
  };

  // Format date to readable string
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="review-card">
      {/* Review Header — User Avatar & Name */}
      <div className="review-header">
        <img
          src={avatarUrl}
          alt={review.user?.username}
          className="review-avatar"
        />
        <div className="review-user-info">
          <div className="review-username">{review.user?.username}</div>
          <div className="review-date">{formatDate(review.created_at)}</div>
        </div>
      </div>

      {/* Item Info — Poster Thumbnail & Title */}
      {review.item_poster && (
        <div className="review-item-info">
          <img
            src={review.item_poster}
            alt={review.item_title}
            className="review-poster-thumb"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/45x65?text=?';
            }}
          />
          <div>
            <div className="review-item-title">{review.item_title}</div>
          </div>
        </div>
      )}

      {/* Star Rating */}
      <div className="review-stars">
        {renderStars(review.rating)}
      </div>

      {/* Review Comment */}
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

export default ReviewCard;
