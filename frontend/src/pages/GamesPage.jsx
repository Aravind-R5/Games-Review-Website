// -----------------------------------------------
// GamesPage — Browse All Games
// -----------------------------------------------
// Similar to MoviesPage but with platform filters.
// Displays games in a poster grid layout.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGames } from '../api/api';
import PosterCard from '../components/PosterCard';
import SearchBar from '../components/SearchBar';

// Genre options for games
const GENRES = [
  'All', 'Action', 'Adventure', 'RPG', 'Shooter', 'Strategy',
  'Sports', 'Racing', 'Puzzle', 'Horror', 'Simulation',
  'Fighting', 'Open World'
];

// Platform filter options
const PLATFORMS = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Multi-Platform'];
const PLATFORM_VALUES = ['all', 'pc', 'playstation', 'xbox', 'nintendo', 'multi'];

function GamesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [platform, setPlatform] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Handle filter clicks by updating the URL
  const handleFilterChange = (type, value) => {
    const queryParams = new URLSearchParams(location.search);
    if (value === 'All' || value === 'all') {
      queryParams.delete(type);
    } else {
      queryParams.set(type, value.toLowerCase().replace(' ', '-'));
    }
    queryParams.delete('page'); // Reset to page 1 on filter change
    navigate(`/games?${queryParams.toString()}`);
  };

  // Fetch games when URL query parameters change
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const urlGenre = queryParams.get('genre');
        const urlPlatform = queryParams.get('platform');
        const urlSearch = queryParams.get('search');
        const urlOrdering = queryParams.get('ordering');
        const urlPage = queryParams.get('page') || '1';

        // Update local state for UI consistency
        if (urlGenre) {
          const matchedGenre = GENRES.find(g => g.toLowerCase().replace(' ', '-') === urlGenre.toLowerCase());
          if (matchedGenre) setGenre(matchedGenre);
        } else {
          setGenre('All');
        }

        if (urlPlatform) {
          if (PLATFORM_VALUES.includes(urlPlatform.toLowerCase())) {
            setPlatform(urlPlatform.toLowerCase());
          }
        } else {
          setPlatform('all');
        }

        if (urlSearch) setSearch(urlSearch);
        else setSearch('');

        setPage(parseInt(urlPage));

        // Build API params
        const params = { page: urlPage };
        if (urlSearch) params.search = urlSearch;
        if (urlGenre) params.genre = urlGenre;
        if (urlPlatform) params.platform = urlPlatform;
        if (urlOrdering) params.ordering = urlOrdering;

        const response = await getGames(params);
        setGames(response.data.results || []);
        const count = response.data.count || 0;
        setTotalPages(Math.ceil(count / 12));
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [location.search]);

  return (
    <div className="page-container">
      <div className="container">
        {/* Page Header */}
        <h1 className="page-title">Games</h1>
        <p className="page-subtitle">
          Discover and review video games across all platforms.
        </p>

        {/* Search Bar */}
        <div className="row mb-3">
          <div className="col-md-6">
            <SearchBar
              value={search}
              onChange={(v) => handleFilterChange('search', v)}
              placeholder="Search games by title, developer..."
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="filter-bar">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`filter-btn ${genre === g ? 'active' : ''}`}
              onClick={() => handleFilterChange('genre', g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="filter-bar mb-3">
          {PLATFORMS.map((p, i) => (
            <button
              key={p}
              className={`filter-btn ${platform === PLATFORM_VALUES[i] ? 'active' : ''}`}
              onClick={() => handleFilterChange('platform', PLATFORM_VALUES[i])}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h4>No games found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="poster-grid">
            {games.map((game) => (
              <PosterCard key={game.id} item={game} type="game" />
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

export default GamesPage;
