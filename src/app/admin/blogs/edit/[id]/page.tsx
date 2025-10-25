"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminBlogs, updateBlog, Blog, getBlogId } from "@/api/api";

export default function EditBlog() {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // Helper function to get the ID as a string
  const getBlogIdFromParams = (): string => {
    if (!params?.id) return '';
    return Array.isArray(params.id) ? params.id[0] : params.id;
  };

  useEffect(() => {
    const blogId = getBlogIdFromParams();
    if (blogId) {
      fetchBlog(blogId);
    }
  }, [params?.id]);

  const fetchBlog = async (blogId: string) => {
    try {
      setError(null);
      const blogs = await getAdminBlogs();
      
      // Find blog by comparing both id and _id with the route parameter
      const blogData = blogs.find(blog => {
        const currentBlogId = getBlogId(blog);
        return currentBlogId === blogId;
      });

      if (blogData) {
        setBlog(blogData);
        setFormData({
          title: blogData.title,
          excerpt: blogData.excerpt || '',
          content: blogData.content || '',
          author: blogData.author,
          published: blogData.published,
          imageUrl: blogData.imageUrl || '',
          isPdfPost: blogData.isPdfPost || false
        });
      } else {
        setError('Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const blogId = getBlogIdFromParams();
      if (!blogId) {
        throw new Error('No blog ID provided');
      }

      // Create FormData to handle file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof Blog];
        if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Append file if selected
      if (file) {
        submitData.append('file', file);
      }

      await updateBlog(blogId, submitData);
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error instanceof Error ? error.message : 'Error updating blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    // Clear file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/blogs')}
            className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnightBlue">Edit Blog</h1>
        <p className="text-gray-600 mt-2">Update blog article details</p>
      </div>

      {/* Current PDF Info */}
      {blog.isPdfPost && blog.pdfUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Current PDF Document</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700">
                <strong>File:</strong> {blog.pdfFileName || 'PDF Document'}
              </p>
              {blog.fileSize && (
                <p className="text-blue-600 text-sm">
                  <strong>Size:</strong> {blog.fileSize}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <a
                href={`http://localhost:8080${blog.pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                View PDF
              </a>
              <a
                href={`http://localhost:8080${blog.pdfUrl}`}
                download={blog.pdfFileName || 'document.pdf'}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Brief description of the blog (optional)"
              />
            </div>

            {!formData.isPdfPost && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required={!formData.isPdfPost}
                  rows={8}
                  value={formData.content || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Write your blog content here..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  value={formData.author || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="published"
                  name="published"
                  value={formData.published ? 'true' : 'false'}
                  onChange={(e) => setFormData({...formData, published: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="isPdfPost" className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPdfPost"
                  name="isPdfPost"
                  checked={formData.isPdfPost || false}
                  onChange={(e) => setFormData({...formData, isPdfPost: e.target.checked})}
                  className="rounded border-gray-300 text-desertSun focus:ring-desertSun"
                />
                <span className="text-sm font-medium text-gray-700">This is a PDF post</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                When checked, you can upload a PDF file instead of writing content.
              </p>
            </div>

            {formData.isPdfPost && (
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File {blog.isPdfPost ? '(Replace current file)' : ''}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-desertSun file:text-white hover:file:bg-burntOrange"
                  />
                  {file && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {file 
                    ? `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                    : 'Choose a PDF file to upload (max 20MB)'
                  }
                </p>
              </div>
            )}

            {!formData.isPdfPost && (
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/blogs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}