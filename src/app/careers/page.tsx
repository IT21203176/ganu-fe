"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCareers, Career, getCareerId } from "@/api/api";

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'full-time' | 'part-time' | 'contract'>('all');

  useEffect(() => {
    fetchCareers();
  }, []);

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-midnightBlue">Loading career opportunities...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-midnightBlue mb-4">Career Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Join our team and be part of something great. Explore our current job openings and find your next career move.
          </p>
          <div className="bg-desertSun text-white px-6 py-3 rounded-lg inline-block">
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {type === 'all' ? 'All Jobs' : type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              <span className="ml-2 text-sm opacity-80">({jobTypeCounts[type]})</span>
            </button>
          ))}
        </div>

        {/* Careers Grid */}
        {filteredCareers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No current openings' : `No ${filter.replace('-', ' ')} positions available`}
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {filter === 'all' 
                ? "We don't have any open positions at the moment. Please check back later!"
                : `We don't have any ${filter.replace('-', ' ')} positions available. Try checking all jobs.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCareers.map((career, index) => {
              const careerId = getCareerId(career);
              const newPost = career.createdAt && isNew(career.createdAt);
              
              return (
                <div
                  key={careerId || `career-${index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
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
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m0-1h-1m1 0h1" />
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
                      <button className="flex-1 bg-desertSun hover:bg-burntOrange text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center">
                        Apply Now
                      </button>
                      <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-midnightBlue mb-4">
              Why Work With Us?
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              We offer competitive salaries, comprehensive benefits, and opportunities for professional growth 
              in a dynamic and supportive work environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-desertSun text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                <p className="text-gray-600 text-sm">Continuous learning and career advancement</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-desertSun text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Great Team</h3>
                <p className="text-gray-600 text-sm">Collaborative and supportive work environment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-desertSun text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m0-1h-1m1 0h1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Competitive Benefits</h3>
                <p className="text-gray-600 text-sm">Comprehensive compensation package</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center bg-midnightBlue hover:bg-navyBlue text-white px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact HR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}