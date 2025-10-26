"use client";

import { useState } from "react";
import { Career } from "@/api/api";

export default function CareerCard({ career }: { career: Career }) {
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const deadline = new Date(career.applicationDeadline);
  const isExpired = deadline < new Date();

  const safeRequirements = career.requirements || [];
  
  // Determine which requirements to display
  const displayedRequirements = showAllRequirements 
    ? safeRequirements 
    : safeRequirements.slice(0, 3);
  
  const hasMoreRequirements = safeRequirements.length > 3;
  const remainingCount = safeRequirements.length - 3;

  const toggleRequirements = () => {
    setShowAllRequirements(!showAllRequirements);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // Handle click outside the image to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImageModal();
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
        {/* Career Image */}
        {career.imageUrl && !imageError && (
          <div className="h-48 overflow-hidden relative">
            <img 
              src={career.imageUrl} 
              alt={career.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
            
            {/* Preview Icon Overlay */}
            <button
              onClick={openImageModal}
              className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Preview image"
              title="Click to preview image"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 10l-2-2m0 0l-2 2m2-2v6"
                />
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-midnightBlue mb-2">
                {career.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {career.location}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    career.type === "full-time"
                      ? "bg-green-100 text-green-800"
                      : career.type === "part-time"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {career.type?.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </div>
            {career.salary && (
              <span className="bg-desertSun text-white px-3 py-1 rounded-full text-sm font-semibold">
                {career.salary}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed text-justify">
            {career.description}
          </p>

          <div className="mb-4">
            <h4 className="font-semibold text-midnightBlue mb-2">
              Key Requirements:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {displayedRequirements.map((req, i) => (
                <li key={`${career.id || "career"}-req-${i}`} className="flex items-start">
                  <svg
                    className="w-4 h-4 text-desertSun mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{req}</span>
                </li>
              ))}
              
              {/* Show More/Less Toggle Button */}
              {hasMoreRequirements && (
                <li className="pt-2">
                  <button
                    onClick={toggleRequirements}
                    className="text-desertSun hover:text-burntOrange font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-desertSun focus:ring-opacity-50 rounded px-2 py-1"
                  >
                    {showAllRequirements ? (
                      <>
                        <svg 
                          className="w-4 h-4 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg 
                          className="w-4 h-4 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        +{remainingCount} more requirement{remainingCount !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Apply before:{" "}
              <span
                className={isExpired ? "text-red-600 font-semibold" : "font-semibold"}
              >
                {deadline.toLocaleDateString()}
              </span>
              {isExpired && <span className="text-red-600 ml-2">(Expired)</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && career.imageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close Button - Positioned lower and more to the right */}
            <button
              onClick={closeImageModal}
              className="absolute -top-8 right-4 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 bg-black bg-opacity-50 hover:bg-opacity-70"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={career.imageUrl} 
                alt={career.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image Caption */}
              <div className="bg-white p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-midnightBlue">{career.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{career.location} • {career.type.replace("-", " ")}</p>
              </div>
            </div>

            {/* Download Button */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <a
                href={career.imageUrl}
                download={`${career.title.replace(/\s+/g, '-').toLowerCase()}-image.jpg`}
                className="bg-desertSun hover:bg-burntOrange text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-desertSun focus:ring-opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}