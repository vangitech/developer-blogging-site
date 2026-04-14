import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (!post) return <div className="text-center py-8">Loading...</div>;

  const isAuthor = user && user.id === post.author?._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{post.subtitle}</h2>
          )}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>By {post.author?.username}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
          
          {isAuthor && (
            <div className="mt-8 flex space-x-4">
              <Link
                to={`/edit/${post._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ViewPost;