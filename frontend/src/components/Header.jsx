import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { user, logoutUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const displayName = user
    ? user.first_name || user.last_name
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : user.email || 'User'
    : null;

  const avatarLetter = displayName && displayName.length > 0
    ? displayName[0].toUpperCase()
    : 'U';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Artistic & Minimal Header */}
      <header className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group">
            <h1 className="text-4xl font-extralight tracking-widest text-gray-900 group-hover:text-indigo-600 transition duration-700">
              MyBlog
            </h1>
            <p className="text-xs tracking-widest text-gray-400 uppercase mt-1 opacity-60">
              Reflections · Art · Code
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link
              to="/"
              className={`text-base font-light tracking-wide transition duration-500 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-px after:bg-indigo-600 after:transition-all after:duration-500 hover:after:w-full hover:after:left-0 ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-base font-light tracking-wide transition duration-500 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-px after:bg-indigo-600 after:transition-all after:duration-500 hover:after:w-full hover:after:left-0 ${
                isActive('/about') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/archive"
              className={`text-base font-light tracking-wide transition duration-500 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-px after:bg-indigo-600 after:transition-all after:duration-500 hover:after:w-full hover:after:left-0 ${
                isActive('/archive') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Archive
            </Link>

            {user ? (
              <div className="flex items-center space-x-8">
                {/* Write Button */}
                <Link
                  to="/create-post"
                  className="px-7 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium text-sm tracking-wide transition transform hover:scale-105 shadow-lg"
                >
                  Write
                </Link>

                {/* User Area */}
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover ring-4 ring-white shadow-md transition transform group-hover:scale-110 duration-500"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center text-indigo-700 font-medium text-base ring-4 ring-white shadow-md transition transform group-hover:scale-110 duration-500">
                        {avatarLetter}
                      </div>
                    )}
                  </div>

                  <p className="text-base font-medium text-gray-900">{displayName}</p>

                  <div className="flex items-center space-x-5 text-sm">
                    <Link to="/profile" className="text-gray-500 hover:text-indigo-600 transition font-light">
                      Profile
                    </Link>
                    <Link to="/edit-profile" className="text-gray-500 hover:text-indigo-600 transition font-light">
                      Edit
                    </Link>
                    <button onClick={logoutUser} className="text-gray-500 hover:text-red-600 transition font-light">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="px-9 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium text-sm tracking-wide transition transform hover:scale-105 shadow-lg"
              >
                Enter
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-3 rounded-full bg-white shadow-inner hover:shadow-md transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu — Artistic Full-Screen */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-xl z-50 flex items-center justify-center">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-3xl text-gray-300 hover:text-gray-500 transition"
          >
            ×
          </button>

          <div className="text-center space-y-12">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-4xl font-extralight text-gray-800 hover:text-indigo-600 transition duration-700"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-4xl font-extralight text-gray-800 hover:text-indigo-600 transition duration-700"
            >
              About
            </Link>
            <Link
              to="/archive"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-4xl font-extralight text-gray-800 hover:text-indigo-600 transition duration-700"
            >
              Archive
            </Link>

            {user ? (
              <div className="space-y-12 pt-12">
                <div className="mb-12">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                      className="w-32 h-32 rounded-full object-cover mx-auto shadow-2xl border-8 border-white"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center text-5xl font-extralight text-indigo-700 mx-auto shadow-2xl border-8 border-white">
                      {avatarLetter}
                    </div>
                  )}
                  <p className="text-2xl font-light text-gray-900 mt-6">{displayName}</p>
                </div>

                <div className="space-y-8">
                  <Link
                    to="/create-post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-light text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Write New Post
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-light text-gray-700 hover:text-indigo-600 transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/edit-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-light text-gray-700 hover:text-indigo-600 transition"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-2xl font-light text-red-500 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-14 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium text-xl tracking-wide transition transform hover:scale-110 shadow-2xl"
              >
                Enter
              </button>
            )}
          </div>
        </div>
      )}
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default Header;