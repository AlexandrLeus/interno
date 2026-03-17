import { useState, useEffect } from 'react';
import { useTags, useBlogPosts } from '../../hooks/useBlogPosts';
import PageHeader from '../../components/ui/PageHeader';
import ProjectImg from '../../assets/images/Projects.png';
import styles from './Project.module.scss';
import BlogList from '../../components/ui/BlogList';

const Project = () => {

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
    } = useBlogPosts({page, pageSize, tag: selectedTagId ? [selectedTagId] : undefined});

    const handleTagClick = (tagId: number) => {
        setSelectedTagId(tagId);
        setPage(1);
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
        {posts?.items.length === 0 ? (
            <div className="no-posts">
                {selectedTagId
                    ? `No posts found with this tag`
                    : `No posts found`}
            </div>
        ) : (
            <BlogList
                posts={posts.items}
                totalPages={posts.totalPages}
                currentPage={page}
                onPageChange={setPage}
            />
        )}
    </div>)
}

export default Project;