import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
        {post.subtitle && (
          <p className="text-gray-600 mb-3">{post.subtitle}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {post.author?.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <Link 
          to={`/post/${post._id}`}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;