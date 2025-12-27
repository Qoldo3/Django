import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, fetchProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing token and load user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const profile = await fetchProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to load profile:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('blogUser');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      
      // Store tokens
      localStorage.setItem('authToken', data.access);
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      // Load user profile
      const profile = await fetchProfile();
      setUser(profile);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, password1) => {
    try {
      await apiRegister(email, password, password1);
      
      // Auto-login after registration
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('blogUser');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}