// -----------------------------------------------
// MoviesPage — Browse All Movies
// -----------------------------------------------
// Displays a grid of movies with search and genre
// filter functionality. Supports pagination.
// -----------------------------------------------

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies } from '../api/api';
import PosterCard from '../components/PosterCard';
import SearchBar from '../components/SearchBar';

// Genre options for filtering
const GENRES = [
  'All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Thriller', 'Animation', 'Romance', 'Documentary', 'Fantasy',
  'Adventure', 'Mystery'
];

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies when search, genre, or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = { page };
        if (search) params.search = search;
        if (genre !== 'All') params.genre = genre.toLowerCase();

        const response = await getMovies(params);
        setMovies(response.data.results || []);
        // Calculate total pages from count
        const count = response.data.count || 0;
        setTotalPages(Math.ceil(count / 12));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [search, genre, page]);

  // Debounced search handler
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Genre filter handler
  const handleGenreFilter = (g) => {
    setGenre(g);
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Page Header */}
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">
          Browse and discover movies. Filter by genre or search for your favorites.
        </p>

        {/* Search Bar */}
        <div className="row mb-3">
          <div className="col-md-6">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search movies by title, director..."
            />
          </div>
        </div>

        {/* Genre Filter Buttons */}
        <div className="filter-bar">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`filter-btn ${genre === g ? 'active' : ''}`}
              onClick={() => handleGenreFilter(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : movies.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <h4>No movies found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          /* Movie Grid */
          <div className="poster-grid">
            {movies.map((movie) => (
              <PosterCard key={movie.id} item={movie} type="movie" />
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

export default MoviesPage;
