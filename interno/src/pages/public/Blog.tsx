import styles from './Blog.module.scss'
import PageHeader from '../../components/ui/PageHeader';
import BlogImg from '../../assets/images/Blog.png'
import BlogList from '../../components/ui/BlogList';
import LatestBlogPost from '../../components/ui/LatestBlogPost';
const Blog = () => {
    return (<div>
        <PageHeader text='Articles & News' imageUrl={BlogImg}/>
        <div className={styles.latestPost}>
            <LatestBlogPost />
        </div>
        <div className={styles.articlesAndNews}>
            <BlogList/>
        </div>
    </div>)
}

export default Blog;