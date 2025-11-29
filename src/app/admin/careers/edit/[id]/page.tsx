"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminCareerById, updateCareer, Career, getFileUrl } from "@/api/api";

export default function EditCareer() {
  const [loading, setLoading] = useState(false);
  const [career, setCareer] = useState<Career | null>(null);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [formData, setFormData] = useState<Partial<Career>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // Helper function to get the ID as a string
  const getCareerIdFromParams = (): string => {
    if (!params?.id) return '';
    return Array.isArray(params.id) ? params.id[0] : params.id;
  };

  useEffect(() => {
    const careerId = getCareerIdFromParams();
    if (careerId) {
      fetchCareer(careerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchCareer = async (careerId: string) => {
    try {
      setError(null);
      const careerData = await getAdminCareerById(careerId);
      
      if (careerData) {
        setCareer(careerData);
        // Include all fields including file fields
        setFormData({
          ...careerData,
          imageUrl: careerData.imageUrl,
          pdfUrl: careerData.pdfUrl,
          pdfFileName: careerData.pdfFileName,
          fileSize: careerData.fileSize,
          fileType: careerData.fileType,
        });
        setRequirements(careerData.requirements.length > 0 ? careerData.requirements : ['']);
      } else {
        setError('Career not found');
      }
    } catch (error) {
      console.error('Error fetching career:', error);
      setError('Failed to load career');
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
    setFileError(null);

    try {
      const careerId = getCareerIdFromParams();
      if (!careerId) {
        throw new Error('No career ID provided');
      }
      
      // Create FormData if file is selected, otherwise use JSON
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('title', formData.title || '');
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('location', formData.location || '');
        formDataToSend.append('type', formData.type || 'full-time');
        if (formData.salary) {
          formDataToSend.append('salary', formData.salary);
        }
        formDataToSend.append('applicationDeadline', formData.applicationDeadline || '');
        formDataToSend.append('published', formData.published ? 'true' : 'false');
        
        // Append requirements as JSON array
        const filteredRequirements = requirements.filter(req => req.trim() !== '');
        filteredRequirements.forEach((req, index) => {
          formDataToSend.append(`requirements[${index}]`, req);
        });

        await updateCareer(careerId, formDataToSend);
      } else {
        // When updating without a new file, preserve existing file fields
        const careerData = {
          ...formData,
          requirements: requirements.filter(req => req.trim() !== ''),
          // Preserve file fields if they exist
          imageUrl: career?.imageUrl,
          pdfUrl: career?.pdfUrl,
          pdfFileName: career?.pdfFileName,
          fileSize: career?.fileSize,
          fileType: career?.fileType,
        };
        await updateCareer(careerId, careerData);
      }
      
      router.push('/admin/careers');
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error updating career:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error updating career';
      setFileError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
    }
  };

  // Check if career is expired
  const isExpired = (applicationDeadline: string) => {
    return new Date(applicationDeadline) < new Date();
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/careers')}
            className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading career...</div>
      </div>
    );
  }

  const expired = isExpired(career.applicationDeadline);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnightBlue">Edit Career</h1>
        <p className="text-gray-600 mt-2">Update job opening details</p>
        {expired && (
          <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">
              <strong>Note:</strong> This career posting has expired. Expired careers cannot be published.
            </p>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title || ''}
                onChange={handleChange}
                className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description || ''}
                onChange={handleChange}
                className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                placeholder="Describe the job role and responsibilities"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="e.g., Colombo, Sri Lanka"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type || 'full-time'}
                  onChange={handleChange}
                  className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  className="text-gray-500 placeholder-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                  placeholder="e.g., LKR 100,000 - 150,000"
                />
              </div>

              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  required
                  value={formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
              {!selectedFile && career && (career.imageUrl || career.pdfUrl) && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current File:</p>
                  {career.fileType === 'image' && career.imageUrl ? (
                    <div>
                      <img
                        src={getFileUrl(career.imageUrl)}
                        alt="Current career image"
                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : career.fileType === 'pdf' && career.pdfUrl ? (
                    <div className="flex items-center space-x-2 p-3 bg-white rounded border border-gray-300">
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {career.pdfFileName || 'Career PDF'}
                        </p>
                        {career.fileSize && (
                          <p className="text-xs text-gray-500">{career.fileSize}</p>
                        )}
                      </div>
                      <a
                        href={getFileUrl(career.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-desertSun hover:text-burntOrange text-sm font-medium"
                      >
                        View/Download
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
                          <div className="flex items-center space-x-2 p-3 bg-white rounded border border-gray-300">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                      title="Remove file"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements *
              </label>
              <div className="space-y-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="text-gray-500 placeholder-gray-500 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent"
                      placeholder={`Requirement ${index + 1}`}
                      required={index === 0}
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-desertSun hover:text-burntOrange font-medium text-sm"
                >
                  + Add Another Requirement
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="published"
                name="published"
                value={formData.published ? 'true' : 'false'}
                onChange={(e) => setFormData({...formData, published: e.target.value === 'true'})}
                disabled={expired}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-desertSun focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-500 placeholder-gray-500"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {expired 
                  ? "This career has expired and cannot be published. Create a new career posting with a future deadline."
                  : "Draft careers are only visible to admins. Published careers are visible to the public."
                }
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/careers')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-desertSun hover:bg-burntOrange text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Career'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}