// -----------------------------------------------
// Footer Component
// -----------------------------------------------
// Site footer with about info, navigation links,
// and social media links.
// -----------------------------------------------

import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import { IoGameController } from 'react-icons/io5';

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container-fluid px-lg-5">
        <div className="row">
          {/* Brand & Description */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="footer-brand d-flex align-items-center gap-2">
              <IoGameController size={28} />
              <span>GameVault</span>
            </div>
            <p className="footer-text">
              Your ultimate destination for video game reviews.
              Rate, review, and discover your next favorite game.
            </p>
            {/* Social Links */}
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="mailto:info@gamevault.com" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <div className="footer-title">Explore</div>
            <Link to="/games" className="footer-link">Games</Link>
            <Link to="/reviews" className="footer-link">Reviews</Link>
          </div>

          {/* Resources */}
          <div className="col-6 col-lg-2">
            <div className="footer-title">Account</div>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Join Free</Link>
          </div>

          {/* About */}
          <div className="col-lg-4">
            <div className="footer-title">About GameVault</div>
            <p className="footer-text">
              GameVault is a community-driven platform where gamers come
              together to share their thoughts, rate their favorites,
              and discover their next big adventure.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} GameVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
