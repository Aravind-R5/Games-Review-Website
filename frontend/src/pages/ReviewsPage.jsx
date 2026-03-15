// -----------------------------------------------
// ReviewsPage — Browse All Reviews
// -----------------------------------------------
// Displays all reviews in a card grid layout.
// Users can see community reviews.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { getReviews } from '../api/api';
import ReviewCard from '../components/ReviewCard';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await getReviews({ page });
        setReviews(response.data.results || []);
        const count = response.data.count || 0;
        setTotalPages(Math.ceil(count / 12));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">Community Reviews</h1>
        <p className="page-subtitle">
          See what the community is saying about the latest video games.
        </p>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <h4>No reviews yet</h4>
            <p>Be the first to write a review!</p>
          </div>
        ) : (
          <div className="row g-3">
            {reviews.map((review) => (
              <div key={review.id} className="col-md-6 col-lg-4">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination pagination-custom">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
