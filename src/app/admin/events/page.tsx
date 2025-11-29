"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getEvents, deleteEvent, Event, getEventId, getFileUrl } from "@/api/api";

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'news' | 'event'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    setDeleteLoading(id);
    try {
      await deleteEvent(id);
      setEvents(events.filter(event => getEventId(event) !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Error deleting event. Please try again.');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-midnightBlue">Events & News Management</h1>
          <p className="text-gray-600 mt-2">Create and manage events and news for your organization</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Event/News
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'news', 'event'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              filter === type
                ? 'bg-midnightBlue text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
            }`}
          >
            {type === 'all' ? 'All' : type === 'news' ? 'News' : 'Events'}
            <span className="ml-2 text-sm opacity-80">
              ({type === 'all' ? events.length : events.filter(e => e.type === type).length})
            </span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first event.</p>
            <Link
              href="/admin/events/new"
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors font-semibold inline-flex items-center"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Event/News
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event, index) => {
                  const eventId = getEventId(event);
                  return (
                    <tr key={eventId || `event-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {event.fileType === 'image' && event.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={getFileUrl(event.imageUrl)}
                                alt={event.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          {event.fileType === 'pdf' && event.pdfUrl && (
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-red-100 rounded-lg">
                              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className={`${event.fileType ? "ml-4" : ""} min-w-0 flex-1`}>
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 break-words">
                              {event.description}
                            </div>
                            {event.fileType === 'pdf' && event.pdfFileName && (
                              <div className="text-xs text-gray-400 mt-1 truncate">
                                📄 {event.pdfFileName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.type === 'news' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {event.type === 'news' ? 'News' : 'Event'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.createdAt && new Date(event.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/events/edit/${eventId}`}
                            className="text-desertSun hover:text-burntOrange transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(eventId)}
                            disabled={deleteLoading === eventId}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === eventId ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}