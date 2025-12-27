import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import api from '../services/api';

function EditPost() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-96 p-10 text-gray-800 bg-white rounded-xl border border-gray-200 shadow-inner',
      },
    },
  });

  useEffect(() => {
    const loadPostAndCategories = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          api.get(`/blog/api/v1/posts/${id}/`),
          api.get('/blog/api/v1/categories/'),
        ]);
        const post = postRes.data;
        if (post.author.id !== user.id) {
          navigate('/');
          return;
        }
        setTitle(post.title);
        setCategory(post.category?.id || '');
        editor.commands.setContent(post.content);
        setCategories(catRes.data);
      } catch (err) {
        setMessage('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    if (user) loadPostAndCategories();
  }, [id, user, editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', editor.getHTML());
      if (category) formData.append('category', category);

      await api.patch(`/blog/api/v1/posts/${id}/`, formData);

      setMessage('Post updated successfully!');
      setTimeout(() => navigate('/my-posts'), 1500);
    } catch (err) {
      setMessage('Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-xl text-gray-600 mb-6">Log in to edit posts.</p>
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-32">Loading post...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-light text-gray-900 mb-12 text-center tracking-wide">
        Edit Post
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          <div className="p-12">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-light text-gray-900 placeholder-gray-400 border-none focus:outline-none"
              required
            />
          </div>

          {categories.length > 0 && (
            <div className="px-12 py-8 bg-gray-50">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full max-w-md px-6 py-4 border border-gray-300 rounded-lg focus:ring-indigo-500 bg-white"
              >
                <option value="">No category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="p-12">
            <EditorContent editor={editor} />
          </div>

          <div className="px-12 py-8 bg-gray-50 flex justify-between">
            <Link to="/my-posts" className="text-indigo-600 hover:underline">
              ← Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {message && (
          <div className="px-12 pb-10 text-center">
            <p className={`text-lg ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPost;