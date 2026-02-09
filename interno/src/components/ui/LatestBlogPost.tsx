import { useBlogPosts } from '../../hooks/useBlogPosts';
import styles from './UiComponents.module.scss';
import { useNavigate } from 'react-router-dom';

export default function LatestBlogPost() {
  const navigate = useNavigate();
  const { data, isPending } = useBlogPosts(1, 6);

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
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="26" fill='#F4F0EC' />
              <path d="M23.771 32.6855L29.7139 25.9998L23.771 19.3141" stroke="#292F36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}