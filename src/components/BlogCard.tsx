import Link from "next/link";
import { Blog } from "@/api/api";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const blogId = blog.id || blog._id;
  
  // Construct full URL for PDF files
  const getPdfUrl = (pdfUrl: string | undefined) => {
    if (!pdfUrl) return '';
    // If it's already a full URL, return as is
    if (pdfUrl.startsWith('http')) return pdfUrl;
    // Otherwise, prepend the backend URL
    return `http://localhost:8080${pdfUrl}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {blog.imageUrl && !blog.isPdfPost && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {blog.isPdfPost && (
        <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4 border-b border-red-200">
          <svg className="w-16 h-16 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-red-700 font-semibold text-center">PDF Document</span>
          {blog.fileSize && (
            <p className="text-red-600 text-sm mt-1">{blog.fileSize}</p>
          )}
          {blog.pdfFileName && (
            <p className="text-red-500 text-xs mt-1 text-center truncate max-w-full px-2">
              {blog.pdfFileName}
            </p>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500 font-medium">{blog.author}</span>
          <span className="text-sm text-gray-500">
            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {blog.title}
        </h3>
        
        {blog.excerpt && !blog.isPdfPost && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {blog.excerpt}
          </p>
        )}

        {blog.isPdfPost && blog.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {blog.excerpt}
          </p>
        )}
        
        {blog.isPdfPost ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={getPdfUrl(blog.pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View PDF
            </a>
            <a
              href={getPdfUrl(blog.pdfUrl)}
              download={blog.pdfFileName || 'document.pdf'}
              className="flex-1 bg-desertSun text-white hover:bg-burntOrange px-4 py-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        ) : (
          <Link
            href={`/blogs/${blogId}`}
            className="inline-flex items-center text-desertSun hover:text-burntOrange font-semibold transition-colors group"
          >
            Read More
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}