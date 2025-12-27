import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logoutUser } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-xl text-gray-600 mb-6">Please log in to view your profile.</p>
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </div>
    );
  }

  const displayName = user.first_name || user.last_name
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : user.email || 'User';

  const avatarLetter = displayName.length > 0 ? displayName[0].toUpperCase() : 'U';

  const memberSince = user.created_date
    ? new Date(user.created_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  const postsCount = user.posts_count || 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Left: Avatar & Basic Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            {/* Centered Avatar */}
            <div className="flex justify-center mb-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-6xl font-light text-gray-400 border-4 border-gray-100">
                  {avatarLetter}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-1">{displayName}</h2>
            <p className="text-sm text-gray-500 text-center mb-8">{user.email}</p>

            <Link
              to="/edit-profile"
              className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition mb-3 text-center"
            >
              Edit Profile
            </Link>

            <button
              onClick={logoutUser}
              className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition text-center"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Right: Content */}
        <div className="md:col-span-2 space-y-8">
          {/* About Me */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
            {user.description ? (
              <p className="text-base text-gray-700 leading-relaxed">
                {user.description}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                No description yet. <Link to="/edit-profile" className="text-indigo-600 hover:underline">Add one</Link>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Stats</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{memberSince}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Posts created</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{postsCount}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/create-post"
                className="text-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition"
              >
                Write New Post
              </Link>
              <Link
                to="/my-posts"
                className="text-center py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-sm transition"
              >
                My Posts ({postsCount})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;