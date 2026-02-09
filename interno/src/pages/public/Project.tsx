import { useState, useEffect } from 'react';
import { useTags, useBlogPosts } from '../../hooks/useBlogPosts';
import PageHeader from '../../components/ui/PageHeader';
import ProjectImg from '../../assets/images/Projects.png';
import styles from './Project.module.scss';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';

const Project = () => {

    const navigate = useNavigate();
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const { data: tags, isLoading: isLoadingTags } = useTags();

    useEffect(() => {
        if (tags && tags.length > 0 && selectedTagId === null) {
            setSelectedTagId(tags[0].id);
        }
    }, [tags, selectedTagId]);

    const {
        data: posts,
        isLoading: isLoadingPosts,
        isError,
    } = useBlogPosts(page,
        pageSize,
        selectedTagId ? [selectedTagId] : undefined);

    const handleTagClick = (tagId: number) => {
        setSelectedTagId(tagId);
        setPage(1);
    };

    const handlePostClick = (id: number) => {
        navigate(`/blog/${id}`);
    };

    if (isLoadingPosts) return <div>Loading posts...</div>;
    if (isError || !posts) return <div>Error loading posts</div>;
    if (isLoadingTags) return <div>Loading tags...</div>;

    return (<div className={styles.project}>
        <PageHeader text='Our Project' imageUrl={ProjectImg} />
        <div className={styles.tagsContainer}>
            <div className={styles.tags}>
                {tags?.map(tag => (
                    <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className={`${styles.button} ${selectedTagId === tag.id ? styles.active : ''}`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>

        <div className={styles.blogContainer}>
            {posts?.items.length === 0 ? (
                <div className="no-posts">
                    {selectedTagId
                        ? `No posts found with this tag`
                        : `No posts found`}
                </div>
            ) : (
                posts?.items.map(post => (
                    <div onClick={() => handlePostClick(post.id)} key={post.id} className={styles.blogList}>
                        <img src={post.imageUrl} alt={post.title} />
                        <h2 >{post.title}</h2>
                        <div>
                            {new Date(post.createdAt).toLocaleDateString()}
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="26" cy="26" r="26" fill='#F4F0EC' />
                                <path d="M23.771 32.6855L29.7139 25.9998L23.771 19.3141" stroke="#292F36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                ))
            )}
        </div>
        
            <Pagination
                totalPages={posts.totalPages}
                currentPage={page}
                onPageChange={setPage}
            />
        
    </div>)
}

export default Project;