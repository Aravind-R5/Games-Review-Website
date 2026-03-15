// -----------------------------------------------
// Navbar Component
// -----------------------------------------------
// Top navigation bar with logo, nav links, search,
// and authentication buttons/user profile.
// -----------------------------------------------

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { IoGameController } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Check if a nav link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link className="navbar-brand navbar-brand-custom d-flex align-items-center gap-2" to="/">
          <IoGameController size={32} />
          <span>GameVault</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-custom ${isActive('/games') && !location.search ? 'active' : ''}`}
                to="/games"
              >
                Games
              </Link>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link nav-link-custom ${location.hash === '#popular' ? 'active' : ''}`}
                href="/#popular"
              >
                Popular
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link nav-link-custom ${location.hash === '#new-releases' ? 'active' : ''}`}
                href="/#new-releases"
              >
                New Releases
              </a>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-custom ${isActive('/reviews') ? 'active' : ''}`}
                to="/reviews"
              >
                Reviews
              </Link>
            </li>

            {/* Platform Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-link-custom dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Platforms
              </a>
              <ul className="dropdown-menu dropdown-menu-dark dropdown-custom" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?platform=pc">PC</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?platform=playstation">PlayStation</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?platform=xbox">Xbox</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?platform=nintendo">Nintendo Switch</Link></li>
              </ul>
            </li>

            {/* Genre Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-link-custom dropdown-toggle"
                href="#"
                id="genreDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Genres
              </a>
              <ul className="dropdown-menu dropdown-menu-dark dropdown-custom" aria-labelledby="genreDropdown">
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?genre=action">Action</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?genre=adventure">Adventure</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?genre=rpg">RPG</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?genre=horror">Horror</Link></li>
                <li><Link className="dropdown-item dropdown-item-custom" to="/games?genre=shooter">Shooter</Link></li>
              </ul>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                className="form-control search-input"
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="navbar-search"
              />
            </div>
          </form>

          {/* Auth Section */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                {user?.is_staff && (
                  <a
                    href="http://localhost:8000/admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-login d-flex align-items-center gap-1"
                    style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
                  >
                    Admin
                  </a>
                )}
                <Link
                  to={`/profile/${user?.id}`}
                  className="btn btn-login d-flex align-items-center gap-1"
                >
                  <FiUser size={14} />
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-login d-flex align-items-center gap-1"
                >
                  <FiLogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-register">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
