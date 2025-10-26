"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminCareers, updateCareer, Career, getCareerId, ensureAbsoluteImageUrl } from "@/api/api";

export default function EditCareer() {
  const [loading, setLoading] = useState(false);
  const [career, setCareer] = useState<Career | null>(null);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<Career>>({});
  const [error, setError] = useState<string | null>(null);
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
  }, [params?.id]);

  const fetchCareer = async (careerId: string) => {
    try {
      setError(null);
      const careers = await getAdminCareers(); // Use admin endpoint to get all careers including drafts
      
      // Find career by comparing both id and _id with the route parameter
      const careerData = careers.find(career => {
        const currentCareerId = getCareerId(career);
        return currentCareerId === careerId;
      });

      if (careerData) {
        setCareer(careerData);
        setFormData(careerData);
        setRequirements(careerData.requirements.length > 0 ? careerData.requirements : ['']);
        
        // Set image preview if image exists - ensure it's an absolute URL
        if (careerData.imageUrl) {
          const absoluteImageUrl = ensureAbsoluteImageUrl(careerData.imageUrl);
          setImagePreview(absoluteImageUrl || careerData.imageUrl);
        }
      } else {
        setError('Career not found');
      }
    } catch (error) {
      console.error('Error fetching career:', error);
      setError('Failed to load career');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const careerId = getCareerIdFromParams();
      if (!careerId) {
        throw new Error('No career ID provided');
      }
      
      const careerFormData = new FormData();
      
      // Append text fields
      careerFormData.append('title', formData.title || '');
      careerFormData.append('description', formData.description || '');
      careerFormData.append('location', formData.location || '');
      careerFormData.append('type', formData.type || 'full-time');
      careerFormData.append('salary', formData.salary || '');
      careerFormData.append('applicationDeadline', formData.applicationDeadline || '');
      careerFormData.append('published', formData.published?.toString() || 'true');
      careerFormData.append('requirements', JSON.stringify(requirements.filter(req => req.trim() !== '')));
      
      // Append image if selected
      if (image) {
        careerFormData.append('image', image);
      }
      
      // Handle image removal
      if (removeExistingImage) {
        careerFormData.append('removeImage', 'true');
      }
      
      await updateCareer(careerId, careerFormData);
      router.push('/admin/careers');
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error updating career:', error);
      alert(error instanceof Error ? error.message : 'Error updating career');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG, etc.)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      setRemoveExistingImage(false); // Reset remove flag when new image is selected
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setRemoveExistingImage(true); // Mark existing image for removal
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
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Career Image (Optional)
              </label>
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Career preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-desertSun hover:text-burntOrange focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-desertSun"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              {career.imageUrl && !imagePreview && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image will be kept unless you upload a new one or remove it.
                </p>
              )}
            </div>

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