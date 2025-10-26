// Environment detection utilities
export class Environment {
  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
  
  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
  
  static isLocalhost(): boolean {
    if (typeof window === 'undefined') {
      // Server-side: check if we're likely in local development
      return process.env.NODE_ENV === 'development';
    } else {
      // Client-side: check the actual hostname
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname === '';
    }
  }
  
  static getBaseURL(): string {
    if (this.isDevelopment() && this.isLocalhost()) {
      return "http://localhost:8080/api";
    } else {
      return "https://ganu-be.vercel.app/api";
    }
  }
}