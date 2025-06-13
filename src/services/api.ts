
import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse, User, DashboardStats, Project } from '@/types';
import { useGlobalStore } from '@/store';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { user } = useGlobalStore.getState();
    if (user) {
      config.headers.Authorization = `Bearer ${user.id}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { setError } = useGlobalStore.getState();
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      setError('Session expired. Please log in again.');
      // Could trigger logout here
    } else if (error.response?.status >= 500) {
      setError('Server error. Please try again later.');
    } else if (error.message === 'Network Error') {
      setError('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<ApiResponse<User>> => {
      // Mock implementation - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          id: '1',
          name: 'John Doe',
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        message: 'Login successful',
        success: true,
      };
    },
    
    logout: async (): Promise<ApiResponse<null>> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: null,
        message: 'Logout successful',
        success: true,
      };
    },
    
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data;
    },
  },

  // Dashboard endpoints
  dashboard: {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        data: {
          totalUsers: 12450,
          totalRevenue: 98765,
          activeProjects: 24,
          conversionRate: 3.2,
        },
        message: 'Stats retrieved successfully',
        success: true,
      };
    },
  },

  // Projects endpoints
  projects: {
    getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Project>> => {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website',
          status: 'active',
          progress: 75,
          dueDate: '2024-01-15',
          team: [],
        },
        {
          id: '2',
          name: 'Mobile App Development',
          description: 'Native mobile application for iOS and Android',
          status: 'active',
          progress: 45,
          dueDate: '2024-02-28',
          team: [],
        },
      ];
      
      return {
        data: mockProjects,
        message: 'Projects retrieved successfully',
        success: true,
        pagination: {
          page,
          limit,
          total: 24,
          totalPages: 3,
        },
      };
    },
    
    getById: async (id: string): Promise<ApiResponse<Project>> => {
      const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      return response.data;
    },
    
    create: async (project: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
      const response = await api.post<ApiResponse<Project>>('/projects', project);
      return response.data;
    },
    
    update: async (id: string, project: Partial<Project>): Promise<ApiResponse<Project>> => {
      const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, project);
      return response.data;
    },
    
    delete: async (id: string): Promise<ApiResponse<null>> => {
      const response = await api.delete<ApiResponse<null>>(`/projects/${id}`);
      return response.data;
    },
  },

  // Users endpoints
  users: {
    getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
      const response = await api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
      return response.data;
    },
    
    getById: async (id: string): Promise<ApiResponse<User>> => {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    },
    
    update: async (id: string, user: Partial<User>): Promise<ApiResponse<User>> => {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, user);
      return response.data;
    },
  },
};

export default api;
