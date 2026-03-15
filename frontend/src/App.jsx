// -----------------------------------------------
// App Component — Main Application Router
// -----------------------------------------------
// Sets up React Router for navigation between pages.
// Wraps the app with AuthProvider for global auth state.
// -----------------------------------------------

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ReviewsPage from './pages/ReviewsPage';

function App() {
  return (
    // AuthProvider gives all components access to auth state
    <AuthProvider>
      <Router>
        {/* Navbar appears on every page */}
        <Navbar />

        {/* Page Routes */}
        <main>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Browse Pages */}
            <Route path="/games" element={<GamesPage />} />

            {/* Detail Pages (game) */}
            <Route path="/game/:id" element={<DetailPage />} />

            {/* Reviews */}
            <Route path="/reviews" element={<ReviewsPage />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Profile */}
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </main>

        {/* Footer appears on every page */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
