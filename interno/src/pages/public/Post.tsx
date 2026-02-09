import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useBlogPost, useSearch } from '../../hooks/useBlogPosts';
import styles from './Post.module.scss';

const Post = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const postId = parseInt(id || '0');
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: searchLoading,
        isError: searchError,
    } = useSearch(searchTerm, 5);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (
            scrollHeight - scrollTop <= clientHeight + 20 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    };
    const items =
        data?.pages.flatMap(page => page.items) ?? [];

    const {
        data: post,
        isLoading,
        isError,
    } = useBlogPost(postId);

    const handlePostClick = (id: number) => {
        setSearchTerm('');
        navigate(`/blog/${id}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError || !post) return <div>Error loading posts</div>;

    return (<div className={styles.post}>
        <div className={styles.postContent}>
            <h1 className='title'>{post.title}</h1>
            <img src={post.imageUrl} alt={post.title} />
            <div>
                <small>Created {new Date(post.createdAt).toLocaleDateString()}</small>
                {post.updatedAt && (
                    <small>Updated {new Date(post.updatedAt).toLocaleDateString()}</small>
                )}
            </div>
            <p>{post.description}</p>
            <p>{post.content}</p>
        </div>
        <div className={styles.sideBar}>
            <div className={styles.search}>
                <input value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value);
                }} type="text" placeholder="Search" />

                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.5197 24.2898L20.4143 18.1691C21.8842 16.2073 22.6777 13.8195 22.675 11.3659C22.675 5.09879 17.589 0 11.3375 0C5.08605 0 0 5.09879 0 11.3659C0 17.633 5.08605 22.7318 11.3375 22.7318C13.7849 22.7345 16.1668 21.939 18.1237 20.4654L24.2291 26.5862C24.5382 26.8631 24.9413 27.011 25.3556 26.9994C25.77 26.9877 26.1642 26.8175 26.4574 26.5237C26.7505 26.2298 26.9203 25.8346 26.9319 25.4192C26.9435 25.0038 26.796 24.5997 26.5197 24.2898ZM3.23929 11.3659C3.23929 9.76023 3.71424 8.1906 4.60408 6.85552C5.49393 5.52043 6.7587 4.47986 8.23845 3.86539C9.71821 3.25092 11.3465 3.09015 12.9174 3.4034C14.4883 3.71666 15.9313 4.48987 17.0638 5.62526C18.1964 6.76066 18.9676 8.20724 19.2801 9.78208C19.5926 11.3569 19.4322 12.9893 18.8193 14.4727C18.2063 15.9562 17.1684 17.2241 15.8366 18.1162C14.5049 19.0083 12.9392 19.4844 11.3375 19.4844C9.19052 19.4818 7.1322 18.6257 5.61405 17.1037C4.09589 15.5818 3.24186 13.5183 3.23929 11.3659Z" fill="#CDA274" />
                </svg>
                {searchTerm.length >= 2 && (
                    <div
                        className={styles.dropdown}
                        onScroll={handleScroll}
                    >
                        {searchLoading && <div className={styles.item}>Loading...</div>}
                        {searchError && <div className={styles.item}>Error</div>}

                        {items.map(item => (
                            <div
                                onClick={() => handlePostClick(item.id)}
                                key={item.id}
                                className={styles.item}
                            >
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        ))}

                        {isFetchingNextPage && (
                            <div className={styles.item}>
                                Loading...
                            </div>
                        )}
                        {!searchLoading && !searchError && items.length === 0 && (
                            <div className={styles.item}>
                                Nothing was found
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.categories}>
                <h2>Categories</h2>
                {post.categories.map(c => (
                    <p key={c.id}>{c.name}</p>
                ))}
            </div>
            <div className={styles.tags}>
                <h2>Tags</h2>
                {post.tags.map(t => (
                    <p key={t.id}>{t.name}</p>
                ))}
            </div>

        </div>
    </div>);
};

export default Post;