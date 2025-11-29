"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminUser, setAdminUser] = useState<any>(null);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
        return;
      }
      
      setAdminUser(userData);
      setIsAuthenticated(true);
      
      // Only fetch contacts if we're authenticated and not on login page
      if (pathname !== '/admin/login') {
        await fetchUnreadContacts();
      }
    } catch {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadContacts = async () => {
    try {
      // Import here to avoid circular dependencies
      const { getAdminContacts } = await import('@/api/api');
      const contacts = await getAdminContacts();
      const unread = contacts.filter(contact => !contact.read).length;
      setUnreadContacts(unread);
    } catch (error) {
      console.error('Failed to fetch unread contacts:', error);
      // Don't block the layout if contacts fail to load
      setUnreadContacts(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-midnightBlue">Loading Admin Panel...</div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-midnightBlue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              {adminUser && (
                <span className="text-sm text-gray-300">
                  Welcome, {adminUser.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-sm hover:text-desertSun transition-colors flex items-center"
                target="_blank"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-desertSun hover:bg-burntOrange text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              <Link
                href="/admin/dashboard"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                  pathname === '/admin/dashboard' 
                    ? 'bg-desertSun/10 text-desertSun border-r-2 border-desertSun' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              
              <Link
                href="/admin/events"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                  pathname.includes('/admin/events') 
                    ? 'bg-desertSun/10 text-desertSun border-r-2 border-desertSun' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
              </Link>
              
              <Link
                href="/admin/blogs"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                  pathname.includes('/admin/blogs') 
                    ? 'bg-desertSun/10 text-desertSun border-r-2 border-desertSun' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Blogs
              </Link>
              
              <Link
                href="/admin/careers"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                  pathname.includes('/admin/careers') 
                    ? 'bg-desertSun/10 text-desertSun border-r-2 border-desertSun' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Careers
              </Link>

              <Link
                href="/admin/contacts"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                  pathname.includes('/admin/contacts') 
                    ? 'bg-desertSun/10 text-desertSun border-r-2 border-desertSun' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Contacts
                {unreadContacts > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                    {unreadContacts}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}