import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import Pagination from './Pagination';
import styles from './UiComponents.module.scss';

export default function BlogList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, isError } = useBlogPosts(page, pageSize);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading posts</div>;

  const handlePostClick = (id: number) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div>
      <h1 className='title'>Articles And News</h1>
      <div className={styles.blogContainer}>
        {data.items.map(post => (
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
        ))}

      </div>
      <Pagination
        totalPages={data.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>

  );
}