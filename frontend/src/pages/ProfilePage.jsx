// -----------------------------------------------
// ProfilePage — User Profile View
// -----------------------------------------------
// Shows user info, avatar, bio, stats,
// and all reviews written by the user.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiMonitor } from 'react-icons/fi';
import { getProfile } from '../api/api';
import ReviewCard from '../components/ReviewCard';

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile and reviews
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile(id);
        setProfile(response.data.profile);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <h4>User not found</h4>
      </div>
    );
  }

  // All reviews are games now
  const gameReviews = reviews.length;

  return (
    <div className="page-container">
      <div className="container">
        {/* Profile Header Card */}
        <div className="profile-header">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user?.username}`}
            alt={profile.user?.username}
            className="profile-avatar"
          />
          <div>
            <h2 className="profile-name">{profile.user?.username}</h2>
            <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{profile.review_count || 0}</div>
                <div className="profile-stat-label">
                  <FiStar size={12} /> Reviews
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{gameReviews}</div>
                <div className="profile-stat-label">
                  <FiMonitor size={12} /> Games Reviewed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Reviews */}
        <h3 className="section-title mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>This user hasn't written any reviews yet.</p>
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
      </div>
    </div>
  );
}

export default ProfilePage;
