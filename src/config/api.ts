// Simple API Configuration - Auto-detects environment
export const apiConfig = {
  get BASE_URL(): string {
    // Check if we're in development and on localhost
    const isDev = process.env.NODE_ENV === 'development';
    const isLocal = typeof window === 'undefined' 
      ? true // Assume localhost for server-side during development
      : window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    return (isDev && isLocal) 
      ? "http://localhost:8080/api" 
      : "https://ganu-be.vercel.app/api";
  },
  
  get isProduction(): boolean {
    return this.BASE_URL === "https://ganu-be.vercel.app/api";
  },
  
  get isDevelopment(): boolean {
    return this.BASE_URL === "http://localhost:8080/api";
  }
};