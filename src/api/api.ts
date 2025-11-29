import axios from "axios";

// API base URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ganu-be.vercel.app";

// Base API configuration without interceptors (for server components)
const API = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  headers: { "Content-Type": "application/json" },
});

// Client-side API with interceptors (for client components)
const createClientAPI = () => {
  const clientAPI = axios.create({
    baseURL: `${API_BASE_URL}/api`, 
    headers: { "Content-Type": "application/json" },
  });

  // Only add interceptors on client side
  if (typeof window !== 'undefined') {
    clientAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // If data is FormData, remove Content-Type header to let axios set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    });

    // Add response interceptor to handle errors
    clientAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        
        // Handle 401 Unauthorized - clear tokens and redirect to login
        if (status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          // Only redirect if not already on login page
          if (window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        }
        
        console.error('API Error:', {
          status: status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  return clientAPI;
};

// TypeScript interfaces
export interface CompanyInfo {
  id: number;
  name: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  category: "HR" | "Finance";
  features: string[];
}

export interface Event {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'news' | 'event';
  imageUrl?: string; // For image files
  pdfUrl?: string; // For PDF files
  pdfFileName?: string; // Original PDF file name
  fileSize?: string; // File size for display
  fileType?: 'image' | 'pdf'; // Track file type
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface Contact {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Add helper function for contact IDs
const getContactId = (contact: Contact): string => {
  return contact.id || contact._id || '';
};

export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  content?: string; // Make optional for PDF posts
  excerpt?: string;
  author: string;
  imageUrl?: string; // For image files
  pdfUrl?: string; // For PDF files
  pdfFileName?: string; // Original PDF file name
  fileSize?: string; // File size for display
  fileType?: 'image' | 'pdf'; // Track file type
  isPdfPost?: boolean; // Flag to identify PDF posts
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Career {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary?: string;
  applicationDeadline: string;
  imageUrl?: string; // For image files
  pdfUrl?: string; // For PDF files
  pdfFileName?: string; // Original PDF file name
  fileSize?: string; // File size for display
  fileType?: 'image' | 'pdf'; // Track file type
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Add a helper function for career IDs
const getCareerId = (career: Career): string => {
  return career.id || career._id || '';
};

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Helper function to get the actual event ID (handles both id and _id)
const getEventId = (event: Event): string => {
  return event.id || event._id || '';
};

// Helper function to get the actual blog ID (handles both id and _id)
const getBlogId = (blog: Blog): string => {
  return blog.id || blog._id || '';
};

// Public API calls (for server components)
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const response = await API.get("/company");
  return response.data;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await API.get("/services");
  return response.data;
};

export const getEvents = async (type?: 'news' | 'event'): Promise<Event[]> => {
  const url = type ? `/events?type=${type}` : '/events';
  const response = await API.get(url);
  return response.data;
};

// Get all news items
export const getNews = async (): Promise<Event[]> => {
  const response = await API.get("/events/news");
  return response.data;
};

// Get all events (type: 'event')
export const getEventsOnly = async (): Promise<Event[]> => {
  const response = await API.get("/events/events");
  return response.data;
};

// Get single event by ID (public)
export const getEventById = async (id: string): Promise<Event> => {
  const response = await API.get(`/events/${id}`);
  return response.data;
};

// Public blogs (only published)
export const getBlogs = async (): Promise<Blog[]> => {
  const response = await API.get("/blogs");
  return response.data;
};

// Admin blogs (all blogs including drafts)
export const getAdminBlogs = async (): Promise<Blog[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/blogs/admin/all");
  return response.data;
};

export const getCareers = async (): Promise<Career[]> => {
  const response = await API.get("/careers");
  return response.data;
};

export const getAdminCareers = async (): Promise<Career[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/careers/admin/all");
  return response.data;
};

export const getAdminCareerById = async (id: string): Promise<Career> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get(`/careers/admin/${id}`);
  return response.data;
};

// Protected API calls (for client components - admin only)
export const adminLogin = async (loginData: LoginData): Promise<AuthResponse> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/auth/login", loginData);
  return response.data;
};

export const createEvent = async (eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    // Axios automatically handles FormData and sets Content-Type with boundary
    // For JSON, the default Content-Type from createClientAPI is used
    const config = eventData instanceof FormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' // Axios will override this with boundary
          } 
        }
      : {};
    
    const response = await clientAPI.post("/events", eventData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 20MB.');
    } else {
      throw new Error('Failed to create event. Please try again.');
    }
  }
};

export const updateEvent = async (id: string, eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    // Axios automatically handles FormData and sets Content-Type with boundary
    // For JSON, the default Content-Type from createClientAPI is used
    const config = eventData instanceof FormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' // Axios will override this with boundary
          } 
        }
      : {};
    
    const response = await clientAPI.put(`/events/${id}`, eventData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 404) {
      throw new Error('Event not found.');
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 20MB.');
    } else {
      throw new Error('Failed to update event. Please try again.');
    }
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  
  try {
    await clientAPI.delete(`/events/${id}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Event not found.');
    } else {
      throw new Error('Failed to delete event. Please try again.');
    }
  }
};

// Update createBlog and updateBlog to handle FormData
export const createBlog = async (blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    // For FormData, let axios set Content-Type automatically (with boundary)
    // For JSON, explicitly set Content-Type
    const config = blogData instanceof FormData 
      ? { headers: {} } // Let axios set multipart/form-data with boundary
      : { headers: { 'Content-Type': 'application/json' } };
    
    const response = await clientAPI.post("/blogs", blogData, config);
    console.log('Blog created successfully:', response.data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating blog:', error);
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    } else {
      throw new Error('Failed to create blog. Please try again.');
    }
  }
};

export const updateBlog = async (id: string, blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    // For FormData, let axios set Content-Type automatically (with boundary)
    // For JSON, explicitly set Content-Type
    const config = blogData instanceof FormData 
      ? { headers: {} } // Let axios set multipart/form-data with boundary
      : { headers: { 'Content-Type': 'application/json' } };
    
    const response = await clientAPI.put(`/blogs/${id}`, blogData, config);
    console.log('Blog updated successfully:', response.data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating blog:', error);
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    } else {
      throw new Error('Failed to update blog. Please try again.');
    }
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/blogs/${id}`);
};

export const createCareer = async (careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    // Axios automatically handles FormData and sets Content-Type with boundary
    // For JSON, the default Content-Type from createClientAPI is used
    const config = careerData instanceof FormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' // Axios will override this with boundary
          } 
        }
      : {};
    
    const response = await clientAPI.post("/careers", careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 20MB.');
    } else {
      throw new Error('Failed to create career. Please try again.');
    }
  }
};

export const updateCareer = async (id: string, careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    // Axios automatically handles FormData and sets Content-Type with boundary
    // For JSON, the default Content-Type from createClientAPI is used
    const config = careerData instanceof FormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' // Axios will override this with boundary
          } 
        }
      : {};
    
    const response = await clientAPI.put(`/careers/${id}`, careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 20MB.');
    } else {
      throw new Error('Failed to update career. Please try again.');
    }
  }
};

export const deleteCareer = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/careers/${id}`);
};

export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  try {
    const response = await API.post("/contact", formData);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 400) {
      throw new Error('Please check your form data and try again.');
    } else {
      throw new Error('Failed to send message. Please try again later.');
    }
  }
};

// Admin contact functions with better error handling
export const getAdminContacts = async (): Promise<Contact[]> => {
  try {
    const clientAPI = createClientAPI();
    const response = await clientAPI.get("/contact/admin/all");
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    } else if (error.response?.status === 404) {
      throw new Error('Contacts endpoint not found.');
    } else {
      throw new Error('Failed to fetch contacts. Please try again.');
    }
  }
};

export const markContactAsRead = async (id: string): Promise<Contact> => {
  try {
    const clientAPI = createClientAPI();
    const response = await clientAPI.put(`/contact/${id}/read`);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Contact not found.');
    } else {
      throw new Error('Failed to update contact status.');
    }
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  try {
    const clientAPI = createClientAPI();
    await clientAPI.delete(`/contact/${id}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Contact not found.');
    } else {
      throw new Error('Failed to delete contact.');
    }
  }
};

// Helper function to get full file URL
export const getFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  return `${API_BASE_URL}${filePath}`;
};

export { getEventId, getBlogId, getCareerId, getContactId };
export default API;