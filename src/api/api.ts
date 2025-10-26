import axios from "axios";

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';

// Base URLs
const LOCAL_BASE_URL = "http://localhost:8080/api";
const PRODUCTION_BASE_URL = "https://ganu-be.vercel.app/api";

// Base API configuration without interceptors (for server components)
const API = axios.create({
  baseURL: isProduction ? PRODUCTION_BASE_URL : LOCAL_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 seconds
});

// Client-side API with interceptors (for client components)
const createClientAPI = () => {
  const clientAPI = axios.create({
    baseURL: isProduction ? PRODUCTION_BASE_URL : LOCAL_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
  });

  // Only add interceptors on client side
  if (isClient) {
    clientAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Remove Content-Type for FormData to let browser set it
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        isFormData: config.data instanceof FormData,
        hasToken: !!token
      });
      
      return config;
    });

    // Enhanced response interceptor
    clientAPI.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  return clientAPI;
};

// TypeScript interfaces (keep your existing interfaces)
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
  imageUrl?: string;
  imageFileName?: string;
  published?: boolean;
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

export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  author: string;
  imageUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  isPdfPost?: boolean;
  fileSize?: string;
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
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

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

// Helper functions
const getEventId = (event: Event): string => {
  return event.id || event._id || '';
};

const getBlogId = (blog: Blog): string => {
  return blog.id || blog._id || '';
};

const getCareerId = (career: Career): string => {
  return career.id || career._id || '';
};

const getContactId = (contact: Contact): string => {
  return contact.id || contact._id || '';
};

// Public API calls
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const response = await API.get("/company");
  return response.data;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await API.get("/services");
  return response.data;
};

export const getEvents = async (): Promise<Event[]> => {
  const response = await API.get("/events");
  return response.data.filter((event: Event) => event.published !== false);
};

// Public blogs (only published)
export const getBlogs = async (): Promise<Blog[]> => {
  const response = await API.get("/blogs");
  return response.data.filter((blog: Blog) => blog.published === true);
};

// Admin blogs (all blogs including drafts)
export const getAdminBlogs = async (): Promise<Blog[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/blogs/admin/all");
  return response.data;
};

export const getCareers = async (): Promise<Career[]> => {
  const response = await API.get("/careers");
  return response.data.filter((career: Career) => career.published === true);
};

export const getAdminCareers = async (): Promise<Career[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/careers/admin/all");
  return response.data;
};

// Protected API calls (for client components - admin only)
export const adminLogin = async (loginData: LoginData): Promise<AuthResponse> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/auth/login", loginData);
  return response.data;
};

// Enhanced event creation with better error handling
export const createEvent = async (eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    console.log('🔄 Creating event...', {
      isFormData: eventData instanceof FormData,
      data: eventData instanceof FormData ? 'FormData' : eventData
    });

    // Ensure published status
    if (eventData instanceof FormData) {
      if (!eventData.has('published')) {
        eventData.append('published', 'true');
      }
    } else {
      if (eventData.published === undefined) {
        eventData.published = true;
      }
    }

    const config = eventData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000 // 45 seconds for file uploads
    } : {};

    const response = await clientAPI.post("/events", eventData, config);
    console.log('✅ Event created successfully');
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Event creation failed:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file (max 5MB).');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again or contact support.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.response?.data?.errors) {
      throw new Error(`Validation failed: ${error.response.data.errors.join(', ')}`);
    } else {
      throw new Error(error.response?.data?.message || 'Failed to create event. Please try again.');
    }
  }
};

export const updateEvent = async (id: string, eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    const config = eventData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000
    } : {};

    const response = await clientAPI.put(`/events/${id}`, eventData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Event update error:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to update event. Please try again.');
    }
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/events/${id}`);
};

// Enhanced blog creation
export const createBlog = async (blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    // Ensure published status
    if (blogData instanceof FormData) {
      if (!blogData.has('published')) {
        blogData.append('published', 'true');
      }
    } else {
      if (blogData.published === undefined) {
        blogData.published = true;
      }
    }

    const response = await clientAPI.post("/blogs", blogData, {
      timeout: 45000
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Blog creation error:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to create blog. Please try again.');
    }
  }
};

export const updateBlog = async (id: string, blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    const response = await clientAPI.put(`/blogs/${id}`, blogData, {
      timeout: 45000
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Blog update error:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to update blog. Please try again.');
    }
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/blogs/${id}`);
};

// Enhanced career creation
export const createCareer = async (careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    // Ensure published status
    if (careerData instanceof FormData) {
      if (!careerData.has('published')) {
        careerData.append('published', 'true');
      }
    } else {
      if (careerData.published === undefined) {
        careerData.published = true;
      }
    }

    const config = careerData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000
    } : {};

    const response = await clientAPI.post("/careers", careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Career creation error:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to create career. Please try again.');
    }
  }
};

export const updateCareer = async (id: string, careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    const config = careerData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000
    } : {};

    const response = await clientAPI.put(`/careers/${id}`, careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Career update error:', error.response?.data);
    
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to update career. Please try again.');
    }
  }
};

export const deleteCareer = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/careers/${id}`);
};

// Contact functions remain the same
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

// Enhanced URL helpers
export const ensureAbsoluteImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  const baseURL = isProduction 
    ? 'https://ganu-be.vercel.app' 
    : 'http://localhost:8080';
  
  return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const ensureAbsoluteUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  if (isClient) {
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  } else {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 
      (isProduction ? 'https://ganu-be.vercel.app' : 'http://localhost:8080');
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
};

// Test function to check backend connectivity
export const testBackendConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await API.get('/health');
    return { 
      success: true, 
      message: `Backend is connected. Database: ${response.data.database}` 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { 
      success: false, 
      message: `Backend connection failed: ${error.message}` 
    };
  }
};

export { getEventId, getBlogId, getCareerId, getContactId };
export default API;