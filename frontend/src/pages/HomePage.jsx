// -----------------------------------------------
// HomePage — Main Landing Page (Games Only)
// -----------------------------------------------
// Displays: Featured games, Popular Games, 
// Latest Reviews, Top Rated Games,
// and Community Activity feed.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames, getFeatured, getActivity, getTopRated, getReviews } from '../api/api';
import PosterCard from '../components/PosterCard';
import ReviewCard from '../components/ReviewCard';
import { FiStar, FiArrowRight, FiTrendingUp, FiActivity, FiZap, FiEdit3 } from 'react-icons/fi';

function HomePage() {
  // State for each section
  const [featured, setFeatured] = useState(null);
  const [games, setGames] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [topRated, setTopRated] = useState({ games: [] });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch all homepage data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for speed
        const [featuredRes, gamesRes, newGamesRes, reviewsRes, topRes, activityRes] = await Promise.all([
          getFeatured(),
          getGames({ page_size: 12 }),
          getGames({ page_size: 6, ordering: '-year' }), // Fake new releases by year
          getReviews({ page_size: 6 }),
          getTopRated(),
          getActivity(),
        ]);

        // Robustly extract list from response
        const getResults = (data) => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (data.results && Array.isArray(data.results)) return data.results;
          return [];
        };

        setFeatured(featuredRes.data);
        setGames(getResults(gamesRes.data));
        setNewReleases(getResults(newGamesRes.data));
        setReviews(getResults(reviewsRes.data));
        setTopRated(topRes.data);
        setActivity(getResults(activityRes.data));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (featured?.data && Array.isArray(featured.data) && featured.data.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featured.data.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featured]);

  // Loading state
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Get current game for the hero section
  const currentFeatured = Array.isArray(featured?.data) 
    ? featured.data[currentSlide] 
    : featured?.data;

  return (
    <div>
      {/* ==========================================
          1. Featured Section (Hero Banner Slideshow)
          ========================================== */}
      {currentFeatured && (
        <section className="hero-section">
          {/* Background Image with key for fade transition */}
          <div
            key={`bg-${currentFeatured.id}`}
            className="hero-backdrop active-slide"
            style={{
              backgroundImage: `url("${currentFeatured.backdrop_url || currentFeatured.poster_url}")`
            }}
          />
          {/* Dark Overlay */}
          <div className="hero-overlay" />

          {/* Content with key for fade transition */}
          <div key={`content-${currentFeatured.id}`} className="hero-content active-slide">
            <span className="hero-badge">Featured Game</span>
            <h1 className="hero-title">{currentFeatured.title}</h1>

            {/* Meta Info */}
            <div className="hero-meta">
              <span>{currentFeatured.year}</span>
              <span>|</span>
              <span style={{ textTransform: 'capitalize' }}>{currentFeatured.genre}</span>
              <span>|</span>
              <span style={{ textTransform: 'capitalize' }}>{currentFeatured.platform_display}</span>
            </div>

            {/* Rating */}
            <div className="hero-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={18}
                    fill={star <= Math.round(currentFeatured.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="rating-value">{currentFeatured.rating?.toFixed(1)}</span>
            </div>

            <p className="hero-description">
              {currentFeatured.description?.substring(0, 200)}
              {currentFeatured.description?.length > 200 ? '...' : ''}
            </p>

            <Link
              to={`/game/${currentFeatured.id}`}
              className="btn btn-view-details"
            >
              View Game Details <FiArrowRight />
            </Link>

            {/* Carousel Nav Dots */}
            {Array.isArray(featured?.data) && featured.data.length > 1 && (
              <div className="hero-dots">
                {featured.data.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="container-fluid px-4">
        {/* ==========================================
            2. Popular Games Section
            ========================================== */}
        <section id="popular" className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <FiTrendingUp size={20} style={{ marginRight: '8px', color: 'var(--accent-green)' }} />
              Popular Games
            </h2>
            <Link to="/games" className="section-link">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="poster-grid">
            {games.slice(0, 6).map((game) => (
              <PosterCard key={game.id} item={game} type="game" />
            ))}
          </div>
        </section>

        {/* ==========================================
            3. New Releases Section
            ========================================== */}
        <section id="new-releases" className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <FiZap size={20} style={{ marginRight: '8px', color: 'var(--accent-green)' }} />
              New Releases
            </h2>
            <Link to="/games?ordering=-year" className="section-link">
              Browse New <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="poster-grid">
            {newReleases.map((game) => (
              <PosterCard key={game.id} item={game} type="game" />
            ))}
          </div>
        </section>

        {/* ==========================================
            4. Latest Reviews Section
            ========================================== */}
        <section className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <FiEdit3 size={20} style={{ marginRight: '8px', color: 'var(--accent-green)' }} />
              Latest Game Reviews
            </h2>
            <Link to="/reviews" className="section-link">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="row g-3">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="col-md-6 col-lg-4">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            5. Top Rated Section (Horizontal Scroll)
            ========================================== */}
        <section className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <FiStar size={20} style={{ marginRight: '8px', color: 'var(--accent-green)' }} />
              Critically Acclaimed Games
            </h2>
          </div>
          <div className="horizontal-scroll">
            {topRated.games?.map((game) => (
              <PosterCard key={game.id} item={game} type="game" />
            ))}
          </div>
        </section>

        {/* ==========================================
            6. Community Activity Feed
            ========================================== */}
        <section className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <FiActivity size={20} style={{ marginRight: '8px', color: 'var(--accent-green)' }} />
              Gamer Activity
            </h2>
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div
                style={{
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}
              >
                {activity.length > 0 ? (
                  activity.slice(0, 8).map((item) => (
                    <div key={item.id} className="activity-item">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.username}`}
                        alt={item.user?.username}
                        className="activity-avatar"
                      />
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{item.user?.username}</strong> rated{' '}
                          <span className="highlight">{item.item_title}</span>{' '}
                          <span style={{ color: 'var(--accent-green)' }}>
                            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                          </span>
                        </div>
                        <div className="activity-time">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted">No recent activity</div>
                )}
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="col-lg-4 mt-3 mt-lg-0">
              <div
                style={{
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem'
                }}
              >
                <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>Vault Stats</h5>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: 'var(--text-secondary)' }}>Total Games</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{games.length}+</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: 'var(--text-secondary)' }}>Platforms</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>5+</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: 'var(--text-secondary)' }}>Reviews</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{activity.length}+</span>
                </div>
                <hr style={{ borderColor: 'var(--border-color)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 0 }}>
                  Join the community and share your video game reviews!
                </p>
                <Link to="/register" className="btn btn-view-details w-100 mt-3" style={{ fontSize: '0.9rem', justifyContent: 'center' }}>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
