import { Link } from 'react-router-dom';

function PostCard({ post }) {
  // Safe snippet — use backend snippet if available, fallback to content
  const snippet = post.snippet || (post.content ? post.content.substring(0, 200) + '...' : 'No preview available');

  // Format date
  const formattedDate = new Date(post.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link to={`/post/${post.id}`} className="block group">
      <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Header: Date + Category */}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <time className="font-medium">{formattedDate}</time>
            {post.category && (
              <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {post.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-10 flex flex-col flex-grow">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-5 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-3">
            {post.title}
          </h2>

          {/* Snippet */}
          <p className="text-base text-gray-600 leading-relaxed mb-8 flex-grow line-clamp-4">
            {snippet}
          </p>

          {/* Read More */}
          <div className="mt-auto">
            <span className="inline-flex items-center text-indigo-600 font-semibold text-base group-hover:underline">
              Read more
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;