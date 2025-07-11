import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime'); // Clear session info as well
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md px-4 md:px-8 py-2 rounded-b-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.png" alt="Trustwell Logo" className="h-12 w-auto" />
        </div>

        {/* Nav Links */}
        <nav className="flex items-center space-x-4 text-sm gap-5 md:text-base">
          {!isAdmin && (
            <>
              <Link to="/mission" className="text-blue-600 font-medium hover:underline">
                About_us
              </Link>
              <Link to="/sell" className="text-blue-600 font-medium hover:underline">
                Post_Your_Property
              </Link>
              <Link to="/contact" className="text-blue-600 font-medium hover:underline">
                Contact
              </Link>
              {user && (
                <Link to="/liked-properties" className="text-red-500 font-medium hover:underline">
                  ❤️ Liked
                </Link>
              )}
            </>
          )}

          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">
                👋 Hi, {user.name.split(' ')[0]}
              </span>
              {isAdmin && (
                <Link to="/admin" className="text-blue-600 hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-red-500 font-medium hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
