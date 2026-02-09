import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import logo from '../../assets/icons/Logo.svg';

const Header = () => {

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
          <Link to="/services">
            Services
          </Link>
          <Link to="/project">
            Project
          </Link>
          <Link to="/blog">
            Blog
          </Link>
          <Link to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;