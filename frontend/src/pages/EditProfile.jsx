import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

function EditProfile() {
  const { user, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    description: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        description: user.description || '',
        image: null,
      });
      setPreviewImage(user.image || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Please select a valid image (JPG, PNG, GIF, WebP)');
      e.target.value = ''; // clear input
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError('Image must be smaller than 5MB');
      e.target.value = '';
      return;
    }

    // Valid — update state
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setImageError('');

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await api.patch('/accounts/api/v1/profile/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      loginUser(response.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.image?.[0] || 'Failed to update profile.';
      setMessage(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-xl text-gray-600 mb-6">Please log in to edit your profile.</p>
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </div>
    );
  }

  const displayName = user.first_name || user.last_name
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : user.email || 'User';

  const avatarLetter = displayName.length > 0 ? displayName[0].toUpperCase() : 'U';

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Edit Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload & Preview */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-6xl font-light text-gray-400 border-4 border-gray-100">
                  {avatarLetter}
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-4 text-sm text-gray-600">Click the + to upload (max 5MB, JPG/PNG/GIF/WebP)</p>

            {imageError && (
              <p className="mt-3 text-sm text-red-600 font-medium">{imageError}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about yourself..."
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-base"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6">
            <Link to="/profile" className="text-indigo-600 hover:underline text-base">
              ← Back to Profile
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-base transition disabled:opacity-70 shadow-md"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {message && (
            <p className={`text-center text-base font-medium mt-6 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditProfile;