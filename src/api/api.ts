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
      
      // Remove Content-Type for FormData to let browser set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
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

// TypeScript interfaces (keep your existing interfaces the same)
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
  createdAt?: string;
  updatedAt?: string;
  published?: boolean; // ADD THIS FIELD
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
  published: boolean; // MAKE SURE THIS EXISTS
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
  published: boolean; // ADD THIS FIELD
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

// Public API calls (for server components)
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const response = await API.get("/company");
  return response.data;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await API.get("/services");
  return response.data;
};

// FIXED: Ensure events are filtered by published status
export const getEvents = async (): Promise<Event[]> => {
  const response = await API.get("/events");
  // Filter only published events for public view
  return response.data.filter((event: Event) => event.published !== false);
};

// FIXED: Public blogs (only published)
export const getBlogs = async (): Promise<Blog[]> => {
  const response = await API.get("/blogs");
  // Filter only published blogs for public view
  return response.data.filter((blog: Blog) => blog.published === true);
};

// Admin blogs (all blogs including drafts)
export const getAdminBlogs = async (): Promise<Blog[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/blogs/admin/all");
  return response.data;
};

// FIXED: Public careers (only published)
export const getCareers = async (): Promise<Career[]> => {
  const response = await API.get("/careers");
  // Filter only published careers for public view
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

// FIXED: Event creation with proper FormData handling
export const createEvent = async (eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    const config = eventData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    
    const response = await clientAPI.post("/events", eventData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      console.error('Event creation error:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }
};

export const updateEvent = async (id: string, eventData: FormData | Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  
  try {
    const config = eventData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    
    const response = await clientAPI.put(`/events/${id}`, eventData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      console.error('Event update error:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/events/${id}`);
};

// FIXED: Blog creation with published status
export const createBlog = async (blogData: FormData | Partial<Blog>): Promise<Blog> => {
  const clientAPI = createClientAPI();
  
  try {
    // Ensure blog is published by default if not specified
    if (blogData instanceof FormData) {
      if (!blogData.has('published')) {
        blogData.append('published', 'true');
      }
    } else {
      if (blogData.published === undefined) {
        blogData.published = true;
      }
    }
    
    const response = await clientAPI.post("/blogs", blogData);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    } else {
      console.error('Blog creation error:', error);
      throw new Error(`Failed to create blog: ${error.message}`);
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
      console.error('Blog update error:', error);
      throw new Error(`Failed to update blog: ${error.message}`);
    }
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/blogs/${id}`);
};

// FIXED: Career creation with published status
export const createCareer = async (careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    // Ensure career is published by default if not specified
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
      }
    } : {};
    
    const response = await clientAPI.post("/careers", careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      console.error('Career creation error:', error);
      throw new Error(`Failed to create career: ${error.message}`);
    }
  }
};

export const updateCareer = async (id: string, careerData: FormData | Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  
  try {
    const config = careerData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    
    const response = await clientAPI.put(`/careers/${id}`, careerData, config);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please choose a smaller file.');
    } else {
      console.error('Career update error:', error);
      throw new Error(`Failed to update career: ${error.message}`);
    }
  }
};

export const deleteCareer = async (id: string): Promise<void> => {
  const clientAPI = createClientAPI();
  await clientAPI.delete(`/careers/${id}`);
};

// Rest of your functions remain the same...
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

export const ensureAbsoluteImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://ganu-be.vercel.app' 
    : 'http://localhost:8080';
  
  return `${baseURL}${url}`;
};

export const ensureAbsoluteUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${url}`;
  } else {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    return `${baseURL}${url}`;
  }
};

export { getEventId, getBlogId, getCareerId, getContactId };
export default API;