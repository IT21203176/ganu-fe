"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCareers, Career, getCareerId, getFileUrl } from "@/api/api";

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'full-time' | 'part-time' | 'contract'>('all');
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        }
        if (isDetailsModalOpen) {
          closeDetailsModal();
        }
      }
    };

    if (isModalOpen || isDetailsModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isDetailsModalOpen]);

  const openModal = (imageUrl: string, alt: string) => {
    setSelectedImage({ url: imageUrl, alt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Small delay to allow fade-out animation
    setTimeout(() => {
      setSelectedImage(null);
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const openDetailsModal = (career: Career) => {
    setSelectedCareer(career);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => {
      setSelectedCareer(null);
    }, 300);
  };

  const handleDetailsBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeDetailsModal();
    }
  };

  const fetchCareers = async () => {
    try {
      setError(null);
      const careersData = await getCareers(); // Use public endpoint to get only published careers
      setCareers(careersData);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setError('Failed to load career opportunities. Please try again later.');
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

  const isExpired = (applicationDeadline: string) => {
    return new Date(applicationDeadline) < new Date();
  };

  const isNew = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Consider as "new" if posted within last 7 days
  };

  // Filter careers based on type and remove expired ones
  const filteredCareers = careers
    .filter(career => !isExpired(career.applicationDeadline)) // Remove expired careers
    .filter(career => filter === 'all' || career.type === filter)
    .sort((a, b) => new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime()); // Sort by deadline

  const jobTypeCounts = {
    'all': careers.filter(c => !isExpired(c.applicationDeadline)).length,
    'full-time': careers.filter(c => c.type === 'full-time' && !isExpired(c.applicationDeadline)).length,
    'part-time': careers.filter(c => c.type === 'part-time' && !isExpired(c.applicationDeadline)).length,
    'contract': careers.filter(c => c.type === 'contract' && !isExpired(c.applicationDeadline)).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-midnightBlue">Loading career opportunities...</div>
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
              onClick={fetchCareers}
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
            Join Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build your career with GANU Professional Services and be part of a
            team that values excellence and innovation.
          </p>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredCareers.length === 0 ? (
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Current Openings
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We do not have any open positions at the moment, but we are always looking for talented individuals. 
                Check back later for new opportunities or send us your resume for future consideration.
              </p>
              <button className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                Submit Resume
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  Current Openings
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore exciting career opportunities and join our dynamic team of professionals.
                </p>
                <div className="mt-4 bg-desertSun text-white px-6 py-2 rounded-lg inline-block">
                  <span className="font-semibold">{filteredCareers.length}</span> open position{filteredCareers.length !== 1 ? 's' : ''} available
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {(['all', 'full-time', 'part-time', 'contract'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      filter === type
                        ? 'bg-midnightBlue text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All Jobs' : type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    <span className="ml-2 text-sm opacity-80">({jobTypeCounts[type]})</span>
                  </button>
                ))}
              </div>

              {/* Careers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredCareers.map((career, index) => {
                  const careerId = getCareerId(career);
                  const newPost = career.createdAt && isNew(career.createdAt);
                  
                  return (
                    <div
                      key={careerId || `career-${index}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Header with Type Badge */}
                      <div className="bg-midnightBlue text-white p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-block px-3 py-1 bg-desertSun rounded-full text-sm font-semibold capitalize">
                            {career.type.replace('-', ' ')}
                          </span>
                          {newPost && (
                            <span className="inline-block px-2 py-1 bg-green-500 rounded-full text-xs font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold line-clamp-2">{career.title}</h3>
                      </div>

                      {/* Display Image or PDF */}
                      {career.fileType === 'image' && career.imageUrl && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          <span className="text-red-700 font-semibold text-center mb-1">PDF Document</span>
                          {career.fileSize && (
                            <p className="text-red-600 text-sm mb-2">{career.fileSize}</p>
                          )}
                          {career.pdfFileName && (
                            <p className="text-red-500 text-xs mb-2 text-center truncate max-w-full px-2">
                              {career.pdfFileName}
                            </p>
                          )}
                          <a
                            href={getFileUrl(career.pdfUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View/Download PDF
                          </a>
                        </div>
                      )}

                      {/* Career Content */}
                      <div className="p-6">
                        {/* Location */}
                        <div className="flex items-center mb-4">
                          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{career.location}</span>
                        </div>

                        {/* Salary */}
                        {career.salary && (
                          <div className="flex items-center mb-4">
                            <svg 
                              className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              style={{ minWidth: '20px', minHeight: '20px' }}
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            <span className="text-gray-700 font-semibold">{career.salary}</span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {career.description}
                        </p>

                        {/* Key Requirements Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {career.requirements.slice(0, 3).map((requirement, reqIndex) => (
                              <li key={reqIndex} className="flex items-start">
                                <svg className="w-4 h-4 text-desertSun mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="line-clamp-2">{requirement}</span>
                              </li>
                            ))}
                            {career.requirements.length > 3 && (
                              <li className="text-desertSun font-medium text-sm">
                                + {career.requirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Apply by:</span>
                          </div>
                          <span className="text-sm font-semibold text-midnightBlue">
                            {formatDate(career.applicationDeadline)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => openDetailsModal(career)}
                            className="flex-1 bg-desertSun hover:bg-burntOrange text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
                          >
                            View Details
                          </button>
                          {career.fileType === 'image' && career.imageUrl && (
                            <button 
                              onClick={() => openModal(getFileUrl(career.imageUrl!), career.title)}
                              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                              View Image
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

      {/* Why Join Us Section */}
      <section className="py-20 bg-navyBlue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Join GANU?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
              title="Professional Growth"
              text="Continuous learning opportunities and career advancement paths."
              bg="bg-burntOrange"
            />
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              }
              title="Great Team"
              text="Work with experienced professionals in a collaborative environment."
              bg="bg-burntOrange"
            />
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
              title="Competitive Benefits"
              text="Attractive compensation packages and comprehensive benefits."
              bg="bg-burntOrange"
            />
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
              Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple and straightforward process to join our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ProcessStep
              number="1"
              title="Apply Online"
              description="Submit your application through our careers portal"
            />
            <ProcessStep
              number="2"
              title="Screening"
              description="Our team reviews your application and qualifications"
            />
            <ProcessStep
              number="3"
              title="Interviews"
              description="Participate in interviews with our team members"
            />
            <ProcessStep
              number="4"
              title="Offer"
              description="Receive and review your employment offer"
            />
          </div>
        </div>
      </section>

      {/* Career Details Modal */}
      {isDetailsModalOpen && selectedCareer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto"
          onClick={handleDetailsBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="details-modal-title"
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-midnightBlue text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 bg-desertSun rounded-full text-sm font-semibold capitalize">
                      {selectedCareer.type.replace('-', ' ')}
                    </span>
                    {selectedCareer.createdAt && isNew(selectedCareer.createdAt) && (
                      <span className="inline-block px-2 py-1 bg-green-500 rounded-full text-xs font-semibold">
                        New
                      </span>
                    )}
                  </div>
                  <h2 id="details-modal-title" className="text-2xl md:text-3xl font-bold mb-2">
                    {selectedCareer.title}
                  </h2>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ml-4"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image or PDF Display */}
              {selectedCareer.fileType === 'image' && selectedCareer.imageUrl && (
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getFileUrl(selectedCareer.imageUrl)}
                    alt={selectedCareer.title}
                    className="w-full h-auto max-h-96 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {selectedCareer.fileType === 'pdf' && selectedCareer.pdfUrl && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-red-700 font-semibold text-lg mb-2">PDF Document</p>
                    {selectedCareer.pdfFileName && (
                      <p className="text-red-600 text-sm mb-2">{selectedCareer.pdfFileName}</p>
                    )}
                    {selectedCareer.fileSize && (
                      <p className="text-red-500 text-xs mb-4">{selectedCareer.fileSize}</p>
                    )}
                    <a
                      href={getFileUrl(selectedCareer.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      View/Download PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Job Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-desertSun mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-gray-900 font-semibold">{selectedCareer.location}</p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-desertSun mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Job Type</p>
                    <p className="text-gray-900 font-semibold capitalize">{selectedCareer.type.replace('-', ' ')}</p>
                  </div>
                </div>

                {/* Salary */}
                {selectedCareer.salary && (
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-desertSun mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Salary</p>
                      <p className="text-gray-900 font-semibold">{selectedCareer.salary}</p>
                    </div>
                  </div>
                )}

                {/* Application Deadline */}
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-desertSun mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Application Deadline</p>
                    <p className="text-gray-900 font-semibold">{formatDate(selectedCareer.applicationDeadline)}</p>
                    {isExpired(selectedCareer.applicationDeadline) && (
                      <p className="text-red-600 text-xs mt-1">(Expired)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-midnightBlue mb-3">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedCareer.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {selectedCareer.requirements && selectedCareer.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-midnightBlue mb-3">Requirements</h3>
                  <ul className="space-y-3">
                    {selectedCareer.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-desertSun mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 flex-1">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {selectedCareer.fileType === 'image' && selectedCareer.imageUrl && (
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      setTimeout(() => {
                        openModal(getFileUrl(selectedCareer.imageUrl!), selectedCareer.title);
                      }, 300);
                    }}
                    className="flex-1 bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    View Full Image
                  </button>
                )}
                <button
                  onClick={closeDetailsModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal - Full Screen View */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Container */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Image Title */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium text-center">{selectedImage.alt}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 text-white text-xs opacity-70 hidden md:block">
            Press ESC to close
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Reusable "Why Join Us" Item
function WhyJoinItem({
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

// Reusable Process Step Component
function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-desertSun rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-lg">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-midnightBlue mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}