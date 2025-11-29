"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEventById, updateEvent, Event, getFileUrl } from "@/api/api";

export default function EditEvent() {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // Helper function to get the ID as a string
  const getEventIdFromParams = (): string => {
    if (!params?.id) return '';
    return Array.isArray(params.id) ? params.id[0] : params.id;
  };

  useEffect(() => {
    const eventId = getEventIdFromParams();
    if (eventId) {
      fetchEvent(eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setError(null);
      const eventData = await getEventById(eventId);

      if (eventData) {
        setEvent(eventData);
        // Include all fields including file fields
        setFormData({
          ...eventData,
          imageUrl: eventData.imageUrl,
          pdfUrl: eventData.pdfUrl,
          pdfFileName: eventData.pdfFileName,
          fileSize: eventData.fileSize,
          fileType: eventData.fileType,
        });
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // Validate file type
    const isValidImage = file.type.startsWith('image/');
    const isValidPdf = file.type === 'application/pdf';
    
    if (!isValidImage && !isValidPdf) {
      setFileError('Only image and PDF files are allowed!');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setFileError('File too large. Maximum size is 20MB.');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (isValidImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (isValidPdf) {
      setFilePreview('pdf');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFileError(null);

    try {
      const eventId = getEventIdFromParams();
      if (!eventId) {
        throw new Error('No event ID provided');
      }

      // Validate required fields
      if (!formData.type || !formData.title || !formData.description || !formData.date || !formData.location) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Validate type
      if (formData.type !== 'news' && formData.type !== 'event') {
        setError('Type must be either "news" or "event".');
        setLoading(false);
        return;
      }
      
      // Create FormData if file is selected, otherwise use JSON
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('type', formData.type || 'event');
        formDataToSend.append('title', formData.title || '');
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('date', formData.date || '');
        formDataToSend.append('location', formData.location || '');

        await updateEvent(eventId, formDataToSend);
      } else {
        // When updating without a new file, preserve existing file fields
        const eventData = {
          ...formData,
          // Preserve file fields if they exist
          imageUrl: event?.imageUrl,
          pdfUrl: event?.pdfUrl,
          pdfFileName: event?.pdfFileName,
          fileSize: event?.fileSize,
          fileType: event?.fileType,
        };
        await updateEvent(eventId, eventData);
      }
      
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event. Please try again.';
      setError(errorMessage);
      setFileError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fix datetime format for input
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  if (error && !event) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/events')}
            className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading event...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnightBlue">Edit Event</h1>
        <p className="text-gray-600 mt-2">Update event details</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type || 'event'}
                onChange={handleChange}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              >
                <option value="event">Event</option>
                <option value="news">News</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'news' ? 'News Title *' : 'Event Title *'}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title || ''}
                onChange={handleChange}
                className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description || ''}
                onChange={handleChange}
                className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  required
                  value={formatDateTimeForInput(formData.date || '')}
                  onChange={handleChange}
                  className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Upload File (Image or PDF)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: Images (JPG, PNG, etc.) and PDF. Maximum file size: 20MB. Leave empty to keep existing file.
              </p>
              
              {fileError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {fileError}
                </div>
              )}

              {/* Existing File Display */}
              {!selectedFile && event && (event.imageUrl || event.pdfUrl) && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current File:</p>
                  {event.fileType === 'image' && event.imageUrl ? (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getFileUrl(event.imageUrl)}
                        alt="Current event image"
                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : event.fileType === 'pdf' && event.pdfUrl ? (
                    <div className="flex items-center space-x-2 p-3 bg-white rounded border border-gray-300">
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.pdfFileName || 'PDF Document'}</p>
                        {event.fileSize && (
                          <p className="text-xs text-gray-500">{event.fileSize}</p>
                        )}
                      </div>
                      <a
                        href={getFileUrl(event.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-desertSun hover:text-burntOrange text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ) : null}
                </div>
              )}

              {/* New File Preview */}
              {filePreview && selectedFile && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-2">New File Preview:</p>
                      {filePreview !== 'pdf' ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-300">
                            <svg className="w-10 h-10 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/events')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}