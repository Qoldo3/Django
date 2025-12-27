import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPostById } from '../services/api';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div className="text-center py-32 text-xl text-gray-600">Loading...</div>;
  if (!post) return <div className="text-center py-32 text-2xl text-red-600">Post not found</div>;

  const formattedDate = new Date(post.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      <Link to="/" className="inline-block mb-12 text-indigo-600 hover:underline text-base font-medium">
        ← All posts
      </Link>

      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center space-x-6 text-base text-gray-600">
          <time className="font-medium">{formattedDate}</time>
          {post.category && (
            <>
              <span className="text-gray-400">•</span>
              <span className="px-5 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                {post.category.name}
              </span>
            </>
          )}
        </div>
      </header>

      <div
        className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-20 pt-12 border-t border-gray-200">
        <Link to="/" className="text-indigo-600 hover:underline text-base font-medium">
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}

export default PostDetail;