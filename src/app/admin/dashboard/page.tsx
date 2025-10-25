"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getEvents, getBlogs, getCareers, getAdminContacts } from "@/api/api";

interface DashboardStats {
  events: number;
  blogs: number;
  careers: number;
  contacts: number;
  unreadContacts: number;
  recentActivity: Array<{
    id: string;
    type: 'event' | 'blog' | 'career' | 'contact';
    title: string;
    action: 'created' | 'updated' | 'submitted';
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ 
    events: 0, 
    blogs: 0, 
    careers: 0,
    contacts: 0,
    unreadContacts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts from your backend API
      const [events, blogs, careers, contacts] = await Promise.all([
        getEvents(),
        getBlogs(),
        getCareers(),
        getAdminContacts()
      ]);

      const unreadContacts = contacts.filter(contact => !contact.read).length;

      setStats({
        events: events.length,
        blogs: blogs.length,
        careers: careers.length,
        contacts: contacts.length,
        unreadContacts: unreadContacts,
        recentActivity: [
          {
            id: '1',
            type: 'contact',
            title: 'New contact message received',
            action: 'submitted',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'event',
            title: 'Latest Company Event',
            action: 'created',
            timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: '3',
            type: 'blog',
            title: 'Industry Insights Published',
            action: 'updated',
            timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnightBlue">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard. Manage your content efficiently.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Events Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-desertSun">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Total Events</h3>
              <p className="text-3xl font-bold text-midnightBlue mt-2">{stats.events}</p>
            </div>
            <div className="w-12 h-12 bg-desertSun/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-desertSun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/events" className="text-desertSun hover:text-burntOrange text-sm mt-4 inline-block font-medium">
            Manage Events →
          </Link>
        </div>

        {/* Blogs Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-navyBlue">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Total Blogs</h3>
              <p className="text-3xl font-bold text-midnightBlue mt-2">{stats.blogs}</p>
            </div>
            <div className="w-12 h-12 bg-navyBlue/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-navyBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/blogs" className="text-desertSun hover:text-burntOrange text-sm mt-4 inline-block font-medium">
            Manage Blogs →
          </Link>
        </div>

        {/* Careers Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-burntOrange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Total Careers</h3>
              <p className="text-3xl font-bold text-midnightBlue mt-2">{stats.careers}</p>
            </div>
            <div className="w-12 h-12 bg-burntOrange/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-burntOrange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
          </div>
          <Link href="/admin/careers" className="text-desertSun hover:text-burntOrange text-sm mt-4 inline-block font-medium">
            Manage Careers →
          </Link>
        </div>

        {/* Contact Messages Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Contact Messages</h3>
              <p className="text-3xl font-bold text-midnightBlue mt-2">{stats.contacts}</p>
              {stats.unreadContacts > 0 && (
                <div className="flex items-center mt-1">
                  <span className="text-sm text-green-600 font-medium">
                    {stats.unreadContacts} unread
                  </span>
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/contacts" className="text-desertSun hover:text-burntOrange text-sm mt-4 inline-block font-medium">
            View Messages →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-midnightBlue mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/events/new"
            className="bg-desertSun hover:bg-burntOrange text-white text-center py-4 px-6 rounded-lg transition-colors flex flex-col items-center justify-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Create New Event</span>
          </Link>
          
          <Link
            href="/admin/blogs/new"
            className="bg-navyBlue hover:bg-midnightBlue text-white text-center py-4 px-6 rounded-lg transition-colors flex flex-col items-center justify-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Create New Blog</span>
          </Link>
          
          <Link
            href="/admin/careers/new"
            className="bg-burntOrange hover:bg-orange-700 text-white text-center py-4 px-6 rounded-lg transition-colors flex flex-col items-center justify-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Create New Career</span>
          </Link>

          <Link
            href="/admin/contacts"
            className="bg-green-600 hover:bg-green-700 text-white text-center py-4 px-6 rounded-lg transition-colors flex flex-col items-center justify-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-semibold">View Messages</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-midnightBlue mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'event' ? 'bg-desertSun/20 text-desertSun' :
                  activity.type === 'blog' ? 'bg-navyBlue/20 text-navyBlue' :
                  activity.type === 'career' ? 'bg-burntOrange/20 text-burntOrange' :
                  'bg-green-100 text-green-600'
                }`}>
                  {activity.type === 'event' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {activity.type === 'blog' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                  {activity.type === 'career' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  )}
                  {activity.type === 'contact' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {activity.type} {activity.action} • {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}