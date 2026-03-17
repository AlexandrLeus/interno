import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import styles from './UiComponents.module.scss';
import ArrowBlogItem from '../../assets/icons/ArrowBlogItem.svg'

interface BlogListProps {
  posts: any[];
  totalPages?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
  title?: string;
}

export default function BlogList({
  posts,
  totalPages = 1,
  currentPage,
  onPageChange,
  showActions = false,
  onEdit,
  onDelete,
  deletingId,
  title = ""
}: BlogListProps) {
  const navigate = useNavigate();

  const handlePostClick = (id: number) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div>
      <h1 className='title'>{title}</h1>
      <div className={styles.blogContainer}>
        {posts.map(post => (<div>
          <div onClick={() => handlePostClick(post.id)} key={post.id} className={styles.blogList}>
            <img src={post.imageUrl} alt={post.title} />
            <h2 >{post.title}</h2>
            <div>
              {new Date(post.createdAt).toLocaleDateString()}
              <img src={ArrowBlogItem} alt="arrow" className={styles.arrow} />
            </div>
          </div>
          {showActions && (
            <div className={styles.postActions}>
              <button className={styles.actionButton} onClick={() => {onEdit?.(post.id)}}>
                Edit
              </button>
              <button className={styles.actionButton} onClick={() => {onDelete?.(post.id)}} disabled={deletingId === post.id}>
                {deletingId === post.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}