import { useState, useEffect, useCallback } from 'react';
import PostCard from '../components/PostCard';
import { fetchPosts, fetchCategories } from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Load posts with debounce on search/filter changes
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPosts({
        page: currentPage,
        search: searchTerm,
        category: selectedCategory
      });
      
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [loadPosts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory]);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(selectedCategory === catName ? '' : catName);
  };

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button 
          onClick={loadPosts}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            MyBlog
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Simple, honest writing about learning React, design systems, and the joy of building.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
            />
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Categories
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-sm text-indigo-600 hover:underline font-normal"
                  >
                    Clear
                  </button>
                )}
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-10">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedCategory === cat.name
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No categories yet</p>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Subscribe</h4>
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  alert('Thanks for subscribing! (Demo feature)');
                }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* Posts */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900">
                {searchTerm || selectedCategory ? 'Search Results' : 'Latest Posts'}
              </h2>
              {totalCount > 0 && (
                <span className="text-gray-600">
                  {totalCount} {totalCount === 1 ? 'post' : 'posts'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-3xl shadow-md p-10 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl mb-4">
                  {searchTerm || selectedCategory 
                    ? 'No posts match your search.' 
                    : 'No posts available yet.'}
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-2">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-xl font-medium transition ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;