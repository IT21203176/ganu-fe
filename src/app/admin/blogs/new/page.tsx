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
  const [file, setFile] = useState<File | null>(null);
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
      if (file) {
        submitData.append('file', file);
      }

      await createBlog(submitData);
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
                  PDF File *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf"
                    required={formData.isPdfPost}
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
                  value={formData.imageUrl}
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
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}