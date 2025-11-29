"use client";

import { useState } from "react";
import { Career, getFileUrl } from "@/api/api";

export default function CareerCard({ career }: { career: Career }) {
  const [showAllRequirements, setShowAllRequirements] = useState(false);
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Display Image or PDF */}
      {career.fileType === 'image' && career.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={getFileUrl(career.imageUrl)}
            alt={career.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {career.fileType === 'pdf' && career.pdfUrl && (
        <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4 border-b border-red-200">
          <svg className="w-16 h-16 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-red-700 font-semibold text-center">PDF Document</span>
          {career.fileSize && (
            <p className="text-red-600 text-sm mt-1">{career.fileSize}</p>
          )}
          {career.pdfFileName && (
            <p className="text-red-500 text-xs mt-1 text-center truncate max-w-full px-2">
              {career.pdfFileName}
            </p>
          )}
          <a
            href={getFileUrl(career.pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
          >
            View/Download PDF
          </a>
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
            <span className="bg-desertSun text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <svg 
                className="w-4 h-4 mr-1.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ minWidth: '16px', minHeight: '16px' }}
                preserveAspectRatio="xMidYMid meet"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
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
  );
}