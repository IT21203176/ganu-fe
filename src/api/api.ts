import axios from "axios";

// Base API configuration without interceptors (for server components)
const API = axios.create({
  baseURL: "https://ganu-be.vercel.app/api", 
  //baseURL: "http://localhost:8080/api",
  headers: { 
    "Content-Type": "application/json",
    "Cache-Control": "no-cache"
  },
  timeout: 30000, // 30 second timeout
});

// Client-side API with interceptors (for client components)
const createClientAPI = () => {
  const clientAPI = axios.create({
    baseURL: "https://ganu-be.vercel.app/api", 
    //baseURL: "http://localhost:8080/api",
    headers: { 
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    timeout: 30000,
  });

  // Only add interceptors on client side
  if (typeof window !== 'undefined') {
    clientAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add cache busting parameter for GET requests
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now() // Cache buster
        };
      }
      
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params);
      return config;
    });

    // Add response interceptor to handle errors
    clientAPI.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method
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
  const response = await API.get("/company", {
    params: { _t: Date.now() }
  });
  return response.data;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await API.get("/services", {
    params: { _t: Date.now() }
  });
  return response.data;
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching events from API...');
    const response = await API.get("/events", {
      params: { _t: Date.now() },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    console.log(`Events API response: ${response.data.length} events`);
    return response.data;
  } catch (error) {
    console.error('Error in getEvents:', error);
    throw error;
  }
};

// Public blogs (only published) - UPDATED
export const getBlogs = async (): Promise<Blog[]> => {
  const response = await API.get("/blogs", {
    params: { _t: Date.now() }
  });
  return response.data;
};

// Admin blogs (all blogs including drafts) - UPDATED
export const getAdminBlogs = async (): Promise<Blog[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/blogs/admin/all", {
    params: { _t: Date.now() }
  });
  return response.data;
};

export const getCareers = async (): Promise<Career[]> => {
  const response = await API.get("/careers", {
    params: { _t: Date.now() }
  });
  return response.data;
};

export const getAdminCareers = async (): Promise<Career[]> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.get("/careers/admin/all", {
    params: { _t: Date.now() }
  });
  return response.data;
};

// Add health check function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkAPIHealth = async (): Promise<any> => {
  try {
    const response = await API.get("/health");
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Add debug function to test events endpoint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugEvents = async (): Promise<any> => {
  try {
    const response = await API.get("/debug/events");
    return response.data;
  } catch (error) {
    console.error('Debug endpoint failed:', error);
    throw error;
  }
};

// Protected API calls (for client components - admin only)
export const adminLogin = async (loginData: LoginData): Promise<AuthResponse> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/auth/login", loginData);
  return response.data;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/events", eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.put(`/events/${id}`, eventData);
  return response.data;
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

export const createCareer = async (careerData: Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.post("/careers", careerData);
  return response.data;
};

export const updateCareer = async (id: string, careerData: Partial<Career>): Promise<Career> => {
  const clientAPI = createClientAPI();
  const response = await clientAPI.put(`/careers/${id}`, careerData);
  return response.data;
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

export { getEventId, getBlogId, getCareerId, getContactId };
export default API;