import { useEffect, useState } from "react";
import Link from "next/link";
import { Blog, getFileUrl } from "@/api/api";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const blogId = blog.id || blog._id;
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const openDetailModal = () => {
    setIsDetailModalOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
  };

  useEffect(() => {
    if (!isDetailModalOpen && !isImageModalOpen) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isDetailModalOpen) closeDetailModal();
        if (isImageModalOpen) closeImageModal();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isDetailModalOpen, isImageModalOpen]);

  useEffect(() => () => {
    if (typeof document !== "undefined") document.body.style.overflow = "unset";
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Image */}
      {blog.imageUrl && (blog.fileType === 'image' || (!blog.fileType && !blog.pdfUrl)) && (
        <button
          type="button"
          onClick={openImageModal}
          className="h-48 overflow-hidden w-full focus:outline-none group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getFileUrl(blog.imageUrl)}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </button>
      )}
      
      {/* Display PDF */}
      {blog.pdfUrl && ((blog.fileType === 'pdf' || blog.isPdfPost) || (!blog.fileType && !blog.imageUrl)) && (
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
        
        {(blog.fileType === 'pdf' || blog.isPdfPost) && blog.pdfUrl ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={getFileUrl(blog.pdfUrl)}
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
              href={getFileUrl(blog.pdfUrl)}
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
          <button
            type="button"
            onClick={openDetailModal}
            className="inline-flex items-center text-desertSun hover:text-burntOrange font-semibold transition-colors group"
          >
            Read More
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeDetailModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="font-medium text-midnightBlue">{blog.author}</span>
                  {blog.createdAt && <span>{new Date(blog.createdAt).toLocaleDateString()}</span>}
                  {blog.isPdfPost && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">PDF</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-midnightBlue">{blog.title}</h2>
              </div>
              <button type="button" onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close blog modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {blog.imageUrl && blog.fileType !== 'pdf' && (
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getFileUrl(blog.imageUrl)} alt={blog.title} className="w-full h-auto max-h-[420px] object-cover" />
                </div>
              )}

              {(blog.fileType === 'pdf' || blog.isPdfPost) && blog.pdfUrl && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-red-700 font-semibold text-lg">PDF Document</p>
                      {blog.pdfFileName && <p className="text-red-600 text-sm">{blog.pdfFileName}</p>}
                      {blog.fileSize && <p className="text-red-500 text-xs">{blog.fileSize}</p>}
                    </div>
                    <div className="flex gap-3">
                      <a href={getFileUrl(blog.pdfUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold">
                        View PDF
                      </a>
                      <a href={getFileUrl(blog.pdfUrl)} download={blog.pdfFileName || "document.pdf"} className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-midnightBlue">Full Content</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {blog.content || blog.excerpt || "Content will be available soon."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && blog.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={closeImageModal}>
          <div className="relative max-w-5xl max-h-full w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getFileUrl(blog.imageUrl)} alt={blog.title} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <button type="button" onClick={closeImageModal} className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-black/50 rounded-full p-2" aria-label="Close blog image modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}