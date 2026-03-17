import styles from './Blog.module.scss'
import PageHeader from '../../components/ui/PageHeader';
import BlogImg from '../../assets/images/Blog.png'
import BlogList from '../../components/ui/BlogList';
import LatestBlogPost from '../../components/ui/LatestBlogPost';
import { useState } from 'react';
import { useBlogPosts } from '../../hooks/useBlogPosts';
const Blog = () => {
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const { data, isLoading, isError } = useBlogPosts({page:page, pageSize:pageSize});

    if (isLoading) return <div>Loading posts...</div>;
    if (isError || !data) return <div>Error loading posts</div>;

    return (<div>
        <PageHeader text='Articles & News' imageUrl={BlogImg} />
        <div className={styles.latestPost}>
            <LatestBlogPost />
        </div>
        <div className={styles.articlesAndNews}>
            <BlogList
                title='Articles And News'
                posts={data.items}
                totalPages={data.totalPages}
                currentPage={page}
                onPageChange={setPage}
            />
        </div>
    </div>)
}

export default Blog;