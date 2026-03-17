import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.scss';
import logo from '../../assets/icons/Logo.svg';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
          <h1 className={styles.interno}>Interno</h1>
        </div>
        <div className={styles.navLink}>
          <Link to="/">
            Home
          </Link>
          <Link to="/about">
            About Us
          </Link>
          {/* <Link to="/services">
            Services
          </Link> */}
          <Link to="/project">
            Project
          </Link>
          <Link to="/blog">
            Blog
          </Link>
          {/* <Link to="/contact">
            Contact
          </Link> */}
          {isAuthenticated ? (<>
            <div className={styles.profileMenu} ref={dropdownRef}>
              <span
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user?.username}
              </span>
              {isDropdownOpen && (<div className={styles.Dropdown}>
                <Link to="/blog/create">Create Post</Link>
                <Link to="/my-posts">My Posts</Link>
                <Link to="/profile">Profile</Link>
                <a onClick={handleLogout}>Logout</a></div>)}
            </div>
          </>) : (<Link to="/login">Login</Link>)}
        </div>
      </div>
    </header>
  );
};

export default Header;