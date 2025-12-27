import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import api from '../services/api';

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const loadCategories = async () => {
      try {
        const response = await api.get('/blog/api/v1/categories/');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage('Please add a title.');
      return;
    }
    if (!editor || editor.isEmpty) {
      setMessage('Please write some content.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', editor.getHTML());
      formData.append('status', true);
      if (category) formData.append('category', category);

      await api.post('/blog/api/v1/posts/', formData);

      setMessage('Post published successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage('Failed to publish. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-xl text-gray-600 mb-6">Log in to write a post.</p>
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Write a New Post</h1>
        <p className="text-lg text-gray-600">Share your thoughts with the world.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          {/* Title Section */}
          <div className="p-12">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A compelling title that draws readers in..."
              className="w-full text-4xl font-light text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
              required
            />
          </div>

          {/* Category Section */}
          {categories.length > 0 && (
            <div className="px-12 py-8 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Category (optional)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full max-w-md px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base bg-white"
              >
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content Editor */}
          <div className="p-12">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Content
            </label>
            <EditorContent editor={editor} />
            <p className="mt-6 text-sm text-gray-600">
              Use bold, italics, lists, headings, links, and code blocks to format your post.
            </p>
          </div>

          {/* Submit Bar */}
          <div className="px-12 py-8 bg-gray-50 flex justify-between items-center">
            <Link to="/" className="text-indigo-600 hover:underline text-base font-medium">
              ← Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-base transition disabled:opacity-70 shadow-md"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>

        {message && (
          <div className="px-12 pb-10 text-center">
            <p className={`text-lg font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;