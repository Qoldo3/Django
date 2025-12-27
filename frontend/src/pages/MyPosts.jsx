import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import api from '../services/api';

function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        const response = await api.get('/blog/api/v1/posts/');
        // Filter client-side (or add backend filter later)
        const myPosts = response.data.filter(post => post.author.id === user.id);
        setPosts(myPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadMyPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-xl text-gray-600 mb-6">Please log in to view your posts.</p>
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-light text-gray-900 mb-12 text-center tracking-wide">
        My Posts
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading your posts...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 mb-8">You haven't written any posts yet.</p>
          <Link
            to="/create-post"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition shadow-md"
          >
            Write Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="relative group">
              <PostCard post={post} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition opacity duration-300 flex space-x-2">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="p-2 bg-white/90 rounded-full shadow-md hover:bg-indigo-100 transition"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Delete this post?')) {
                      api.delete(`/blog/api/v1/posts/${post.id}/`).then(() => {
                        setPosts(posts.filter(p => p.id !== post.id));
                      });
                    }
                  }}
                  className="p-2 bg-white/90 rounded-full shadow-md hover:bg-red-100 transition"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPosts;