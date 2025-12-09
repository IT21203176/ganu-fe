"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getEvents, Event, getEventId, getFileUrl } from "@/api/api";

export default function PublicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'news' | 'event'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setError(null);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const eventCounts = {
    all: events.length,
    news: events.filter(e => e.type === 'news').length,
    event: events.filter(e => e.type === 'event').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if description is too long (more than ~150 characters for 3 lines)
  const isDescriptionLong = (description: string) => {
    return description.length > 150;
  };

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const openImageModal = (imageUrl: string, alt: string) => {
    setSelectedImage({ url: imageUrl, alt });
    setIsImageModalOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    setTimeout(() => setSelectedImage(null), 200);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeEventModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isImageModalOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-midnightBlue">Loading events...</div>
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
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={fetchEvents}
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
            News & Events
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with our latest news and discover upcoming events, workshops, and gatherings. Join us for exciting opportunities to learn, network, and grow.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredEvents.length === 0 && events.length > 0 ? (
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No {filter === 'news' ? 'News' : filter === 'event' ? 'Events' : 'Items'} Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {filter === 'news' 
                  ? 'We don\'t have any news items at the moment. Check back soon for updates.'
                  : filter === 'event'
                  ? 'We don\'t have any upcoming events at the moment. Check back soon for new opportunities.'
                  : 'We are currently planning our next events. Check back soon for updates and exciting opportunities to connect with us.'}
              </p>
            </div>
          ) : events.length === 0 ? (
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                News & Events
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We are currently planning our next events. Check back soon for updates and exciting opportunities to connect with us.
              </p>
              <Link
                href="/"
                className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  News & Events
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                  Stay updated with our latest news and join us for our upcoming events.
                </p>
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4">
                  {(['all', 'news', 'event'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        filter === type
                          ? 'bg-midnightBlue text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'news' ? 'News' : 'Events'}
                      <span className="ml-2 text-sm opacity-80">({eventCounts[type]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => {
                  const eventId = getEventId(event);
                  return (
                    <div
                      key={eventId || `event-${index}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Event Image or PDF */}
                      {event.fileType === 'image' && event.imageUrl && (
                        <button
                          type="button"
                          onClick={() => openImageModal(getFileUrl(event.imageUrl ?? ''), event.title)}
                          className="h-48 overflow-hidden relative w-full focus:outline-none group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getFileUrl(event.imageUrl)}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {/* Type Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              event.type === 'news' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-green-600 text-white'
                            }`}>
                              {event.type === 'news' ? 'News' : 'Event'}
                            </span>
                          </div>
                        </button>
                      )}
                      {event.fileType === 'pdf' && event.pdfUrl && (
                        <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-red-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-gray-700">{event.pdfFileName || 'PDF Document'}</p>
                            {event.fileSize && (
                              <p className="text-xs text-gray-500 mt-1">{event.fileSize}</p>
                            )}
                          </div>
                          {/* Type Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              event.type === 'news' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-green-600 text-white'
                            }`}>
                              {event.type === 'news' ? 'News' : 'Event'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Event Content */}
                      <div className="p-6">
                        {/* Type Badge (if no image) */}
                        {!event.imageUrl && (
                          <div className="mb-3">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              event.type === 'news' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {event.type === 'news' ? 'News' : 'Event'}
                            </span>
                          </div>
                        )}
                        
                        {/* Date Badge */}
                        <div className="flex items-center mb-4">
                          <svg className="w-5 h-5 text-desertSun mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-desertSun bg-orange-50 px-3 py-1 rounded-full">
                            {formatDate(event.date)}
                          </span>
                        </div>

                        {/* Event Title */}
                        <h3 className="text-xl font-bold text-midnightBlue mb-3 line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Event Description */}
                        <div className="mb-4">
                          <p className="text-gray-600 line-clamp-3">
                            {event.description}
                          </p>
                          <button
                            onClick={() => openEventModal(event)}
                            className="text-desertSun hover:text-burntOrange font-medium text-sm mt-2 transition-colors"
                          >
                            Read More
                          </button>
                        </div>

                        {/* PDF Download Link */}
                        {event.fileType === 'pdf' && event.pdfUrl && (
                          <div className="mb-4">
                            <a
                              href={getFileUrl(event.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View PDF
                            </a>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center text-gray-500 mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{event.location}</span>
                        </div>

                        {/* Created Date */}
                        {event.createdAt && (
                          <div className="flex items-center text-gray-400 text-xs">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Posted {new Date(event.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Attend Events Section */}
      <section className="py-20 bg-navyBlue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Attend Our Events?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyAttendItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              }
              title="Networking"
              text="Connect with industry professionals and expand your professional network."
              bg="bg-burntOrange"
            />
            <WhyAttendItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              }
              title="Learning"
              text="Gain valuable insights and knowledge from industry experts and thought leaders."
              bg="bg-burntOrange"
            />
            <WhyAttendItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
              title="Opportunities"
              text="Discover new career opportunities and stay updated with industry trends."
              bg="bg-burntOrange"
            />
          </div>
        </div>
      </section>

      <Footer />

      {/* Event Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={closeImageModal}
        >
          <div className="relative max-w-5xl max-h-full w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-black/50 rounded-full p-2"
              aria-label="Close image modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeEventModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedEvent.type === 'news' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {selectedEvent.type === 'news' ? 'News' : 'Event'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedEvent.date)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-midnightBlue">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                onClick={closeEventModal}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              {/* Event Image or PDF */}
              {selectedEvent.fileType === 'image' && selectedEvent.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getFileUrl(selectedEvent.imageUrl)}
                    alt={selectedEvent.title}
                    className="w-full h-auto max-h-96 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              {selectedEvent.fileType === 'pdf' && selectedEvent.pdfUrl && (
                <div className="mb-6 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-red-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-1">{selectedEvent.pdfFileName || 'PDF Document'}</p>
                    {selectedEvent.fileSize && (
                      <p className="text-sm text-gray-500 mb-4">{selectedEvent.fileSize}</p>
                    )}
                    <a
                      href={getFileUrl(selectedEvent.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-midnightBlue mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-desertSun mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="text-gray-900">{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-desertSun mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>

              {/* Posted Date */}
              {selectedEvent.createdAt && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted {new Date(selectedEvent.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeEventModal}
                className="px-6 py-2 bg-desertSun hover:bg-burntOrange text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable "Why Attend" Item
function WhyAttendItem({
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