import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import logo from '../../assets/icons/Logo.svg';
import f from '../../assets/icons/f.svg';
import x from '../../assets/icons/x.svg';
import linkedIn from '../../assets/icons/in.svg';
import inst from '../../assets/icons/inst.svg';
const Footer = () => {

  return (
    <footer>
      <div className={styles.container}>
        <div className={styles.commonInfo}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
            <h1 className={styles.interno}>Interno</h1>
          </div>
          <div className={styles.note}>It is a long established fact that a reader will be distracted lookings.</div>
          <div className={styles.media}>
            <img src={f} alt="f" />
            <img src={x} alt="x" />
            <img src={linkedIn} alt="in" />
            <img src={inst} alt="inst" />
          </div>
        </div>
        <div className={styles.pages}>
          <h1>Pages</h1>
          <Link to="#">
            About Us
          </Link>
          <Link to="#">
            Our Projects
          </Link>
          <Link to="#">
            Our Team
          </Link>
          <Link to="#">
            Contact Us
          </Link>
          <Link to="#">
            Services
          </Link>
        </div>
        <div className={styles.services}>
          <h1>Services</h1>
          <Link to="#">
            Kitchan
          </Link>
          <Link to="#">
            Living Area
          </Link>
          <Link to="#">
            Bathroom
          </Link>
          <Link to="#">
            Dinning Hall
          </Link>
          <Link to="#">
            Bedroom
          </Link>
        </div>
        <div className={styles.contact}>
          <h1>Contact</h1>
          <div>55 East Birchwood Ave. Brooklyn, New York 11201</div>
          <div>contact@interno.com</div>
          <div>(123) 456 - 7890</div>
        </div>
      </div>
      <div className={styles.creators}>This site is not for sale. This site is just a term paper. o_0</div>
    </footer>
  );
};

export default Footer;