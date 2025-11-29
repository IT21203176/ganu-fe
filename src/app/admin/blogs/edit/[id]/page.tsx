"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminBlogs, updateBlog, Blog, getBlogId, getFileUrl } from "@/api/api";

export default function EditBlog() {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Log for debugging
        console.log('Fetched blog data:', blogData);
        console.log('Blog file fields:', {
          imageUrl: blogData.imageUrl,
          pdfUrl: blogData.pdfUrl,
          fileType: blogData.fileType,
          pdfFileName: blogData.pdfFileName,
          fileSize: blogData.fileSize,
          isPdfPost: blogData.isPdfPost
        });
        
        setBlog(blogData);
        setFormData({
          title: blogData.title,
          excerpt: blogData.excerpt || '',
          content: blogData.content || '',
          author: blogData.author,
          published: blogData.published,
          // Preserve all file-related fields
          imageUrl: blogData.imageUrl,
          pdfUrl: blogData.pdfUrl,
          pdfFileName: blogData.pdfFileName,
          fileSize: blogData.fileSize,
          fileType: blogData.fileType,
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
    setFileError(null);

    try {
      const blogId = getBlogIdFromParams();
      if (!blogId) {
        throw new Error('No blog ID provided');
      }

      // Validate required fields
      if (!formData.title || !formData.author) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Create FormData if file is selected, otherwise use JSON
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('title', formData.title || '');
        formDataToSend.append('author', formData.author || '');
        if (formData.excerpt) formDataToSend.append('excerpt', formData.excerpt);
        if (formData.content) formDataToSend.append('content', formData.content);
        formDataToSend.append('published', formData.published ? 'true' : 'false');
        formDataToSend.append('isPdfPost', formData.isPdfPost ? 'true' : 'false');

        await updateBlog(blogId, formDataToSend);
      } else {
        // When updating without a new file, preserve existing file fields
        const blogData: Partial<Blog> = {
          title: formData.title,
          author: formData.author,
          excerpt: formData.excerpt,
          content: formData.content,
          published: formData.published,
          isPdfPost: formData.isPdfPost,
          // Preserve file fields from blog state (source of truth)
          imageUrl: blog?.imageUrl,
          pdfUrl: blog?.pdfUrl,
          pdfFileName: blog?.pdfFileName,
          fileSize: blog?.fileSize,
          fileType: blog?.fileType,
        };
        
        console.log('Updating blog without new file, preserving:', {
          imageUrl: blog?.imageUrl,
          pdfUrl: blog?.pdfUrl,
          fileType: blog?.fileType
        });
        
        await updateBlog(blogId, blogData);
      }
      
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update blog. Please try again.';
      setError(errorMessage);
      setFileError(errorMessage);
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
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // Validate file type
    const isValidImage = file.type.startsWith('image/');
    const isValidPdf = file.type === 'application/pdf';
    
    if (!isValidImage && !isValidPdf) {
      setFileError('Only image and PDF files are allowed!');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setFileError('File too large. Maximum size is 20MB.');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (isValidImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (isValidPdf) {
      setFilePreview('pdf');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
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

            {/* File Upload - Image or PDF */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.isPdfPost ? 'PDF File' : 'Upload File (Image or PDF)'}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept={formData.isPdfPost ? ".pdf" : "image/*,.pdf"}
                onChange={handleFileChange}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: {formData.isPdfPost ? 'PDF only' : 'Images (JPG, PNG, etc.) and PDF'}. Maximum file size: 20MB. Leave empty to keep existing file.
              </p>
              
              {fileError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {fileError}
                </div>
              )}

              {/* Existing File Display */}
              {!selectedFile && blog && (blog.imageUrl || blog.pdfUrl) && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current File:</p>
                  {/* Display Image - check blog state with fallbacks */}
                  {((blog.fileType === 'image' && blog.imageUrl) || (!blog.fileType && blog.imageUrl && !blog.pdfUrl)) && (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getFileUrl(blog.imageUrl)}
                        alt="Current blog image"
                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-sm text-red-600">Image failed to load</p>';
                          }
                        }}
                      />
                      <p className="text-sm text-gray-600 mt-2">Current Image</p>
                      {blog.fileType && (
                        <p className="text-xs text-gray-500 mt-1">File Type: {blog.fileType}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Display PDF - check blog state with fallbacks */}
                  {((blog.fileType === 'pdf' || blog.isPdfPost) && blog.pdfUrl) || (!blog.fileType && blog.pdfUrl && !blog.imageUrl) ? (
                    <div className="flex items-center space-x-2 p-3 bg-white rounded border border-gray-300">
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{blog.pdfFileName || 'PDF Document'}</p>
                        {blog.fileSize && (
                          <p className="text-xs text-gray-500">{blog.fileSize}</p>
                        )}
                        {blog.fileType && (
                          <p className="text-xs text-gray-500">File Type: {blog.fileType}</p>
                        )}
                      </div>
                      <a
                        href={getFileUrl(blog.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-desertSun hover:text-burntOrange text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ) : null}
                </div>
              )}

              {/* New File Preview */}
              {filePreview && selectedFile && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-2">New File Preview:</p>
                      {filePreview !== 'pdf' ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-300">
                            <svg className="w-10 h-10 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
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