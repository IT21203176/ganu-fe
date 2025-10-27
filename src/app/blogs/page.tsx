"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs, Blog, getBlogId } from "@/api/api";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'article' | 'pdf'>('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setError(null);
      const blogsData = await getBlogs(); // Use public endpoint to get only published blogs
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blog articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isNew = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Consider as "new" if posted within last 7 days
  };

  // Filter blogs based on type
  const filteredBlogs = blogs
    .filter(blog => filter === 'all' || 
      (filter === 'article' && !blog.isPdfPost) || 
      (filter === 'pdf' && blog.isPdfPost)
    )
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()); // Sort by creation date

  const blogTypeCounts = {
    'all': blogs.length,
    'article': blogs.filter(b => !b.isPdfPost).length,
    'pdf': blogs.filter(b => b.isPdfPost).length,
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-midnightBlue">Loading blog articles...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={fetchBlogs}
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-midnightBlue mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover insights, stories, and resources from our team. Stay updated with the latest news and articles.
          </p>
          <div className="bg-desertSun text-white px-6 py-3 rounded-lg inline-block">
            <span className="font-semibold">{filteredBlogs.length}</span> blog post{filteredBlogs.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(['all', 'article', 'pdf'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                filter === type
                  ? 'bg-midnightBlue text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {type === 'all' ? 'All Posts' : type.charAt(0).toUpperCase() + type.slice(1)}
              <span className="ml-2 text-sm opacity-80">({blogTypeCounts[type]})</span>
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No blog posts yet' : `No ${filter} posts available`}
            </h3>
            <p className="text-gray-500 text-lg">
              {filter === 'all' 
                ? "We haven't published any blog posts yet. Please check back later!"
                : `We don't have any ${filter} posts available. Try checking all posts.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All Posts
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => {
              const blogId = getBlogId(blog);
              const newPost = blog.createdAt && isNew(blog.createdAt);
              const isPdf = blog.isPdfPost;
              
              return (
                <div
                  key={blogId || `blog-${index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  {/* Blog Image or PDF Icon */}
                  {blog.imageUrl && !isPdf ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-midnightBlue to-navyBlue flex items-center justify-center">
                      {isPdf ? (
                        <div className="text-center text-white">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-semibold">PDF Document</span>
                          {blog.fileSize && (
                            <p className="text-sm opacity-80 mt-1">{blog.fileSize}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="font-semibold">Blog Article</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Header with Type Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        isPdf 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isPdf ? 'PDF' : 'Article'}
                      </span>
                      {newPost && (
                        <span className="inline-block px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                    </div>

                    {/* Blog Title */}
                    <h3 className="text-xl font-bold text-midnightBlue mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Author and Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="mr-4">{blog.author}</span>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{blog.createdAt ? formatDate(blog.createdAt) : 'Recently'}</span>
                    </div>

                    {/* Excerpt or Content Preview */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || (blog.content ? truncateText(blog.content, 150) : 'No content available')}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {isPdf ? (
                        <>
                          <a
                            href={blog.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-desertSun hover:bg-burntOrange text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                          >
                            View PDF
                          </a>
                          <a
                            href={blog.pdfUrl}
                            download={blog.pdfFileName || 'document.pdf'}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                          >
                            Download
                          </a>
                        </>
                      ) : (
                        <button className="flex-1 bg-desertSun hover:bg-burntOrange text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-midnightBlue mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Subscribe to our newsletter to get the latest blog posts and updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}