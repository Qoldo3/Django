import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/blog/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('blogUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Posts API
export const fetchPosts = async (params = {}) => {
  try {
    const { page = 1, search = '', category = '' } = params;
    const response = await api.get('/posts/', {
      params: { page, search, category }
    });
    
    // Handle DRF pagination
    if (response.data.results) {
      return {
        posts: response.data.results,
        count: response.data.count,
        next: response.data.links?.next,
        previous: response.data.links?.previous,
        totalPages: response.data.total_pages
      };
    }
    
    return { posts: Array.isArray(response.data) ? response.data : [], count: 0 };
  } catch (error) {
    console.error('fetchPosts error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch posts');
  }
};

export const fetchPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Post not found');
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts/', postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create post');
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await api.patch(`/posts/${id}/`, postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update post');
  }
};

export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}/`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete post');
  }
};

// Categories API
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('fetchCategories error:', error);
    return [];
  }
};

// Auth API
export const login = async (email, password) => {
  try {
    const response = await api.post('/accounts/api/v1/jwt/create/', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Invalid credentials');
  }
};

export const register = async (email, password, password1) => {
  try {
    const response = await api.post('/accounts/api/v1/register/', { 
      email, 
      password, 
      password1 
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    if (errors) {
      const messages = Object.entries(errors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
      throw new Error(messages);
    }
    throw new Error('Registration failed');
  }
};

export const fetchProfile = async () => {
  try {
    const response = await api.get('/accounts/api/v1/profile/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
};

export default api;