"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-midnightBlue">Loading blog articles...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover insights, stories, and resources from our team. Stay updated with the latest news and articles.
          </p>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Blog Posts Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We have not published any blog posts yet. Please check back later for insightful articles and updates from our team.
              </p>
              <Link
                href="/"
                className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  Latest Articles
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore our collection of articles, insights, and resources.
                </p>
                <div className="mt-4 bg-desertSun text-white px-6 py-2 rounded-lg inline-block">
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
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All Posts' : type.charAt(0).toUpperCase() + type.slice(1)}
                    <span className="ml-2 text-sm opacity-80">({blogTypeCounts[type]})</span>
                  </button>
                ))}
              </div>

              {/* Blogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => {
                  const blogId = getBlogId(blog);
                  const newPost = blog.createdAt && isNew(blog.createdAt);
                  const isPdf = blog.isPdfPost;
                  
                  return (
                    <div
                      key={blogId || `blog-${index}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
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
            </>
          )}
        </div>
      </section>

      {/* Why Read Our Blog Section */}
      <section className="py-20 bg-navyBlue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Read Our Blog?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyReadItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              }
              title="Expert Insights"
              text="Gain valuable knowledge from industry experts and thought leaders."
              bg="bg-burntOrange"
            />
            <WhyReadItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
              title="Latest Trends"
              text="Stay updated with the latest industry trends and developments."
              bg="bg-burntOrange"
            />
            <WhyReadItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              }
              title="Professional Growth"
              text="Learn new skills and strategies for your professional development."
              bg="bg-burntOrange"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest blog posts and updates delivered directly to your inbox.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button className="bg-desertSun hover:bg-burntOrange text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Reusable "Why Read" Item
function WhyReadItem({
  icon,
  title,
  text,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  bg: string;
}) {
  return (
    <div className="text-center p-6">
      <div
        className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <svg className="w-8 h-8 text-midnightBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{text}</p>
    </div>
  );
}