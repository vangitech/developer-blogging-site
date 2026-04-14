import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">VangiTechDevBlog</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:text-blue-200">Create Post</Link>
              <span className="text-blue-200">Hello, {user.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/signup" className="hover:text-blue-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;