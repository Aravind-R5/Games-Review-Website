// -----------------------------------------------
// DetailPage — Movie/Game Detail View
// -----------------------------------------------
// Shows full details of a movie or game, including
// reviews and a form to write a new review.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FiStar, FiClock, FiCalendar, FiUser, FiTrash2, FiEdit } from 'react-icons/fi';
import { getGameDetail, getReviews, createReview, updateReview, deleteReview } from '../api/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // This is a game detail page
  const type = 'game';

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch item details and reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch detail based on type
        const detailRes = await getGameDetail(id);
        setItem(detailRes.data);

        // Fetch reviews for this item
        const reviewsRes = await getReviews({ game: id });
        setReviews(reviewsRes.data.results || []);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  // Handle review submission (Create or Update)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating || !reviewComment.trim()) {
      setMessage('Please provide both a rating and comment.');
      return;
    }
    setSubmitting(true);
    try {
      const data = {
        game: parseInt(id),
        rating: reviewRating,
        comment: reviewComment,
      };

      if (editingReviewId) {
        await updateReview(editingReviewId, data);
        setMessage('Review updated successfully!');
      } else {
        await createReview(data);
        setMessage('Review submitted successfully!');
      }

      setReviewRating(0);
      setReviewComment('');
      setEditingReviewId(null);

      // Refresh reviews
      const reviewsRes = await getReviews({ game: id });
      setReviews(reviewsRes.data.results || []);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setMessage('');
    // Scroll to form
    window.scrollTo({ top: document.querySelector('form').offsetTop - 100, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewRating(0);
    setReviewComment('');
    setMessage('');
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      setMessage('Review deleted.');
    } catch (error) {
      setMessage('Failed to delete review.');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="empty-state">
        <h4>Item not found</h4>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          Detail Hero Section
          ========================================== */}
      <section className="detail-hero">
        <div
          className="detail-backdrop"
          style={{
            backgroundImage: `url("${item.backdrop_url || item.poster_url}")`
          }}
        />
        <div className="detail-backdrop-overlay" />

        <div className="container">
          <div className="detail-info">
            {/* Poster */}
            <img
              src={item.poster_url || 'https://via.placeholder.com/220x330?text=No+Poster'}
              alt={item.title}
              className="detail-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/220x330?text=No+Poster';
              }}
            />

            {/* Meta Information */}
            <div className="detail-meta">
              <h1 className="detail-title">{item.title}</h1>
              <div className="detail-subtitle">
                <span><FiCalendar size={14} /> {item.year}</span>
                <span style={{ textTransform: 'capitalize' }}>{item.genre}</span>
                {item.duration && (
                  <span><FiClock size={14} /> {item.duration} min</span>
                )}
                {item.director && (
                  <span><FiUser size={14} /> {item.director}</span>
                )}
                {item.developer && (
                  <span><FiUser size={14} /> {item.developer}</span>
                )}
                {item.platform_display && (
                  <span className="platform-badge" style={{ fontSize: '0.8rem' }}>
                    {item.platform_display}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="hero-rating mb-3">
                <RatingStars rating={Math.round(item.rating)} interactive={false} size={20} />
                <span className="rating-value">{item.rating?.toFixed(1)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ({item.review_count || 0} reviews)
                </span>
              </div>

              <p className="detail-description">{item.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          Reviews Section
          ========================================== */}
      <div className="container py-4">
        <div className="row">
          {/* Reviews List */}
          <div className="col-lg-8">
            <h3 className="section-title mb-4">
              Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="row g-3">
                {reviews.map((review) => (
                  <div key={review.id} className="col-12">
                    <div style={{ position: 'relative' }}>
                      <ReviewCard review={review} />
                      {/* Actions for reviews */}
                      {user && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                          {/* Owner can edit */}
                          {review.user?.id === user.id && (
                            <button
                              onClick={() => handleEditClick(review)}
                              style={{
                                background: 'rgba(245, 197, 24, 0.1)',
                                border: '1px solid rgba(245, 197, 24, 0.3)',
                                color: 'var(--accent-green)',
                                borderRadius: '6px',
                                padding: '0.3rem 0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                              }}
                              title="Edit Review"
                            >
                              <FiEdit size={14} />
                            </button>
                          )}
                          
                          {/* Owner or Admin can delete */}
                          {(review.user?.id === user.id || user.is_staff) && (
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              style={{
                                background: 'rgba(248, 81, 73, 0.1)',
                                border: '1px solid rgba(248, 81, 73, 0.3)',
                                color: '#f85149',
                                borderRadius: '6px',
                                padding: '0.3rem 0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                              }}
                              title={user.is_staff && review.user?.id !== user.id ? "Admin: Delete Review" : "Delete Review"}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review Form */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div
              style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                position: 'sticky',
                top: '80px',
              }}
            >
              <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>
                <FiEdit size={16} style={{ marginRight: '6px' }} />
                {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
              </h5>

              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview}>
                  {/* Star Rating */}
                  <div className="mb-3">
                    <label className="form-label-custom">Your Rating</label>
                    <div>
                      <RatingStars
                        rating={reviewRating}
                        onRate={setReviewRating}
                        size={28}
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <label className="form-label-custom">Your Review</label>
                    <textarea
                      className="form-control form-control-dark"
                      rows="4"
                      placeholder="Share your thoughts..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      id="review-comment"
                    />
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`alert alert-custom ${message.includes('Failed') ? 'alert-error' : ''} py-2`}>
                      {message}
                    </div>
                  )}

                  {/* Submit / Cancel Actions */}
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-submit flex-grow-1"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : (editingReviewId ? 'Update Review' : 'Submit Review')}
                    </button>
                    {editingReviewId && (
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Please <a href="/login">sign in</a> to write a review.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
