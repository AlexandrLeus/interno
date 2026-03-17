import { useState } from 'react';
import { useBlogPosts, useBlogDelete } from '../../hooks/useBlogPosts';
import { useNavigate } from 'react-router-dom';
import BlogList from '../../components/ui/BlogList';
import styles from './MyPosts.module.scss';
import { useAuth } from '../../context/AuthContext';

const MyPosts = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const auth = useAuth();
    const params = {
         page: page, pageSize: pageSize,
        ...(auth.user?.role === 'Admin' ? {} : { author: auth.user?.id })
    };
    const { data, isLoading, isError } = useBlogPosts(params);
    const deleteMutation = useBlogDelete();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Error loading posts</div>;
    if (data.items.length === 0) return <div>You have no posts</div>;
    const handleDelete = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }
        setDeletingId(postId)
        await deleteMutation.mutateAsync(Number(postId));
        navigate('/my-posts');
        setDeletingId(null);
    };
    const handleEdit = async (postId: number) => {
        navigate(`/blog/edit/${postId}`)
    }
    return (
        <div className={styles.myPosts}>
            <BlogList
                title='My Posts'
                posts={data.items}
                totalPages={data.totalPages}
                currentPage={page}
                onPageChange={setPage}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
            />
        </div>
    );
};
export default MyPosts