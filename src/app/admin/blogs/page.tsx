"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminBlogs, deleteBlog, updateBlog, Blog, getBlogId } from "@/api/api";

export default function BlogsManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsData = await getAdminBlogs(); // Use admin endpoint to get all blogs including drafts
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    setDeleteLoading(id);
    try {
      await deleteBlog(id);
      // Refresh the list after deletion
      await fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const togglePublishStatus = async (blog: Blog) => {
    const blogId = getBlogId(blog);
    setUpdateLoading(blogId);
    
    try {
      const updatedBlog = await updateBlog(blogId, { 
        ...blog, 
        published: !blog.published 
      });
      
      // Update local state immediately for better UX
      setBlogs(blogs.map(b => 
        getBlogId(b) === blogId ? updatedBlog : b
      ));
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Error updating blog status');
      // Refresh the list to get correct data
      await fetchBlogs();
    } finally {
      setUpdateLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-midnightBlue">Blogs Management</h1>
          <p className="text-gray-600 mt-2">Create and manage blog articles</p>
          <div className="mt-1 text-sm text-gray-500">
            Total: {blogs.length} blog{blogs.length !== 1 ? 's' : ''} 
            ({blogs.filter(b => b.published).length} published, {blogs.filter(b => !b.published).length} drafts)
          </div>
        </div>
        <Link
          href="/admin/blogs/new"
          className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Blog
        </Link>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first blog article.</p>
            <Link
              href="/admin/blogs/new"
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors font-semibold inline-flex items-center"
            >
              Create Blog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog, index) => {
                  const blogId = getBlogId(blog);
                  return (
                    <tr key={blogId || `blog-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {blog.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={blog.imageUrl}
                                alt={blog.title}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                              {!blog.published && (
                                <span className="ml-2 text-xs text-gray-500">(Draft)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {blog.excerpt || (blog.content && blog.content.substring(0, 100)) || 'No content'}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.isPdfPost 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {blog.isPdfPost ? 'PDF' : 'Article'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublishStatus(blog)}
                          disabled={updateLoading === blogId}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors disabled:opacity-50 ${
                            blog.published 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          {updateLoading === blogId ? 'Updating...' : (blog.published ? 'Published' : 'Draft')}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/admin/blogs/edit/${blogId}`}
                            className="text-desertSun hover:text-burntOrange transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blogId)}
                            disabled={deleteLoading === blogId}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === blogId ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}