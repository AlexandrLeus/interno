import { useBlogPosts } from '../../hooks/useBlogPosts';
import styles from './UiComponents.module.scss';
import { useNavigate } from 'react-router-dom';
import ArrowBlogItem from '../../assets/icons/ArrowBlogItem.svg'

export default function LatestBlogPost() {
  const navigate = useNavigate();
  const { data, isPending } = useBlogPosts({page:1,pageSize:6});

  if (isPending || !data) return null;

  const latestPost = data.items[0];
  if (!latestPost) return null;

 const handlePostClick = (id: number) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div>
      <h1 className='title'>Latest Post</h1>
      <div onClick={() => handlePostClick(latestPost.id)} className={styles.LatestBlogPost}>
        <img src={latestPost.imageUrl} alt={latestPost.title} />
        <div >
          <h2>{latestPost.title}</h2>
          <p>{latestPost.description}</p>
          <div >
            {new Date(latestPost.createdAt).toLocaleDateString()}
            <img src={ArrowBlogItem} alt="arrow" className={styles.arrow} />
          </div>
        </div>
      </div>
    </div>
  );
}