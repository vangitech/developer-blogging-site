import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const { title, subtitle, content } = response.data;
      setFormData({ title, subtitle, content });
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('content', formData.content);
    if (image) data.append('image', image);

    try {
      await api.put(`/posts/${id}`, data);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 border rounded"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Subtitle (optional)"
          className="w-full p-3 border rounded"
          value={formData.subtitle}
          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
        />
        <textarea
          placeholder="Content"
          rows="10"
          className="w-full p-3 border rounded"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;