import Button from '../../components/ui/Button';
import styles from './Home.module.scss';
const Home = () => {
    return (<div className={styles.getStarted}>
        <div>
            <h2>Let Your Home Be Unique</h2>
            <p>There are many variations of the passages of
                lorem Ipsum fromavailable, majority.</p>
            <Button text="Get Started" BackgroundColor="#292F36" arrowColor="#CDA274" />
        </div>
    </div>)
}

export default Home;