import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('content', formData.content);
    if (image) {
      data.append('image', image);
      console.log('Uploading image:', image.name, 'Size:', image.size);
    }

    console.log('Form data:', { title: formData.title, subtitle: formData.subtitle, content: formData.content, hasImage: !!image });

    try {
      const response = await api.post('/posts', data);
      console.log('Upload successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to create post: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
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
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            console.log('Selected file:', file);
          }}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;