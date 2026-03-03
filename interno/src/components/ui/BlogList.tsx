import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import Pagination from './Pagination';
import styles from './UiComponents.module.scss';
import ArrowBlogItem from '../../assets/icons/ArrowBlogItem.svg'

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
              <img src={ArrowBlogItem} alt="arrow" />
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