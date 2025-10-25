"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminCareers, deleteCareer, updateCareer, Career, getCareerId } from "@/api/api";

export default function CareersManagement() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const careersData = await getAdminCareers(); // Use admin endpoint to get all careers including drafts
      setCareers(careersData);
    } catch (error) {
      console.error('Error fetching careers:', error);
      alert('Error fetching careers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    
    setDeleteLoading(id);
    try {
      await deleteCareer(id);
      // Refresh the list after deletion
      await fetchCareers();
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('Error deleting career');
    } finally {
      setDeleteLoading(null);
    }
  };

  const togglePublishStatus = async (career: Career) => {
    const careerId = getCareerId(career);
    setUpdateLoading(careerId);
    
    try {
      const updatedCareer = await updateCareer(careerId, { 
        ...career, 
        published: !career.published 
      });
      
      // Update local state immediately for better UX
      setCareers(careers.map(c => 
        getCareerId(c) === careerId ? updatedCareer : c
      ));
    } catch (error) {
      console.error('Error updating career status:', error);
      alert('Error updating career status');
      // Refresh the list to get correct data
      await fetchCareers();
    } finally {
      setUpdateLoading(null);
    }
  };

  // Check if career is expired
  const isExpired = (applicationDeadline: string) => {
    return new Date(applicationDeadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading careers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-midnightBlue">Careers Management</h1>
          <p className="text-gray-600 mt-2">Create and manage job openings</p>
          <div className="mt-1 text-sm text-gray-500">
            Total: {careers.length} job{careers.length !== 1 ? 's' : ''} 
            ({careers.filter(c => c.published).length} published, {careers.filter(c => !c.published).length} drafts)
          </div>
        </div>
        <Link
          href="/admin/careers/new"
          className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Career
        </Link>
      </div>

      {/* Careers List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {careers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first job opening.</p>
            <Link
              href="/admin/careers/new"
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors font-semibold inline-flex items-center"
            >
              Create Career
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {careers.map((career, index) => {
                  const careerId = getCareerId(career);
                  const expired = isExpired(career.applicationDeadline);
                  
                  return (
                    <tr key={careerId || `career-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {career.title}
                          {!career.published && (
                            <span className="ml-2 text-xs text-gray-500">(Draft)</span>
                          )}
                          {expired && (
                            <span className="ml-2 text-xs text-red-500">(Expired)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {career.description.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{career.location}</div>
                        <div className="text-sm text-gray-500 capitalize">{career.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {career.salary || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(career.applicationDeadline).toLocaleDateString()}
                        {expired && (
                          <div className="text-xs text-red-500">Expired</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublishStatus(career)}
                          disabled={updateLoading === careerId || expired}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors disabled:opacity-50 ${
                            expired 
                              ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                              : career.published 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                          title={expired ? "Cannot publish expired career" : ""}
                        >
                          {updateLoading === careerId ? 'Updating...' : 
                           expired ? 'Expired' :
                           career.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/admin/careers/edit/${careerId}`}
                            className="text-desertSun hover:text-burntOrange transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(careerId)}
                            disabled={deleteLoading === careerId}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === careerId ? 'Deleting...' : 'Delete'}
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