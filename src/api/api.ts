import axios from "axios";

// Base API configuration without interceptors (for server components)
const API = axios.create({
  baseURL: "https://ganu-be.vercel.app/api", 
  // baseURL: "http://localhost:8080/api", 
  headers: { "Content-Type": "application/json" },
});

// Client-side API with interceptors (for client components)
const createClientAPI = () => {
  const clientAPI = axios.create({
    baseURL: "https://ganu-be.vercel.app/api", 
    //baseURL: "http://localhost:8080/api", 
    headers: { "Content-Type": "application/json" },
  });

  // Only add interceptors on client side
  if (typeof window !== 'undefined') {
    clientAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    clientAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', {
          status: error.response?.status,
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
  imageUrl?: string;
  imageFileName?: string; // New field
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
  imageUrl?: string;
  pdfUrl?: string; // New field
  pdfFileName?: string; // New field
  isPdfPost?: boolean; // New field
  fileSize?: string; // New field
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
  imageUrl?: string; // New field
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

export const getEvents = async (): Promise<Event[]> => {
  const response = await API.get("/events");
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

// Protected API calls (for client components - admin only)
export const adminLogin = async (loginData: LoginData): Promise<AuthResponse> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/auth/login", loginData);
  return response.data;
};

export const createEvent = async (eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    const response = await clientAPI.post("/events", eventData, {
      headers: eventData instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      throw new Error('Failed to create event. Please try again.');
    }
  }
};

export const updateEvent = async (id: string, eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    const response = await clientAPI.put(`/events/${id}`, eventData, {
      headers: eventData instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      throw new Error('Failed to update event. Please try again.');
    }
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/events/${id}`);
};

// Update createBlog and updateBlog to handle FormData
export const createBlog = async (blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    const response = await clientAPI.post("/blogs", blogData);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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
    const response = await clientAPI.put(`/blogs/${id}`, blogData);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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
    const response = await clientAPI.post("/careers", careerData, {
      headers: careerData instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      throw new Error('Failed to create career. Please try again.');
    }
  }
};

export const updateCareer = async (id: string, careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    const response = await clientAPI.put(`/careers/${id}`, careerData, {
      headers: careerData instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
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

// Helper function to ensure image URLs are absolute - ADD EXPORT HERE
export const ensureAbsoluteImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it's a relative URL, prepend the base URL
  // For production, you might want to use environment variables
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://ganu-be.vercel.app' 
    : 'http://localhost:8080';
  
  return `${baseURL}${url}`;
};

// Also export ensureAbsoluteUrl for PDF URLs if needed
export const ensureAbsoluteUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // For relative URLs, the backend should already provide absolute URLs
  // But as a fallback, we can construct the URL
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return `${window.location.origin}${url}`;
  } else {
    // Server-side: use environment variable or default
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ganu-be.vercel.app';
    return `${baseURL}${url}`;
  }
};

export { getEventId, getBlogId, getCareerId, getContactId };
export default API;