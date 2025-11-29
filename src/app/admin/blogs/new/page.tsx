"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog, Blog } from "@/api/api";

export default function CreateBlog() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    imageUrl: '',
    isPdfPost: false,
    published: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      const createdBlog = await createBlog(submitData);
      console.log('Blog created with file fields:', {
        imageUrl: createdBlog.imageUrl,
        pdfUrl: createdBlog.pdfUrl,
        fileType: createdBlog.fileType
      });
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error instanceof Error ? error.message : 'Error creating blog');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnightBlue">Create New Blog</h1>
        <p className="text-gray-600 mt-2">Write and publish a new blog article or PDF post</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
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
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
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
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
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
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
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
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Author name"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent text-gray-900 placeholder-gray-500"
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
                  onChange={(e) => {
                    setFormData({...formData, isPdfPost: e.target.checked});
                    // Clear file when toggling PDF post
                    if (!e.target.checked) {
                      removeFile();
                    }
                  }}
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
                {formData.isPdfPost ? 'PDF File *' : 'Upload Image or PDF (Optional)'}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept={formData.isPdfPost ? ".pdf" : "image/*,.pdf"}
                required={formData.isPdfPost}
                onChange={handleFileChange}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: {formData.isPdfPost ? 'PDF only' : 'Images (JPG, PNG, etc.) and PDF'}. Maximum file size: 20MB.
              </p>
              
              {fileError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {fileError}
                </div>
              )}

              {/* File Preview */}
              {filePreview && selectedFile && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-2">File Preview:</p>
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
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}