
import AsyncStorage from '@react-native-async-storage/async-storage';
// API Configuration - Change domain here only
const API_CONFIG = {
  BASE_URL: 'http://98.70.37.201/KharidVechan/api',
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  SEND_OTP: '/user/auth/send-otp',
  VERIFY_OTP: '/user/auth/verify-otp',
  LOGIN: '/user/auth/login',
  REGISTER: '/user/auth/register',
  CREATE_POST: '/user/post/create',
  // Add more endpoints here as needed
};

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper to make authenticated API calls
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Check for 401 Unauthorized
  if (response.status === 401) {
    // Token expired or invalid - clear storage
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    throw new Error('UNAUTHORIZED');
  }

  return response;
};

// API Service
export const apiService = {
  // Send OTP
  sendOTP: async (mobile, purpose = 'REGISTER') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEND_OTP}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            purpose: purpose,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error;
    }
  },
  
  // Verify OTP
  verifyOTP: async (mobile, otp, purpose = 'REGISTER') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            otp: otp,
            purpose: purpose,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  },
  
// Get Districts
  getDistricts: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/districts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Districts Error:', error);
      throw error;
    }
  },

  // Get Talukas by District
  getTalukas: async (districtId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/talukas/${districtId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Talukas Error:', error);
      throw error;
    }
  },

  // Get Villages by Taluka
  getVillages: async (talukaId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/villages/${talukaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Villages Error:', error);
      throw error;
    }
  },

  // Register User
  registerUser: async (userData) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/user/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Register User Error:', error);
      throw error;
    }
  },
  
// Login User
  loginUser: async (mobile, password = 'Test@123') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/user/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            password: password,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

   // Create Post (AUTH REQUIRED)
  createPost: async (postData) => {
    try {
      const response = await authenticatedFetch(
        API_ENDPOINTS.CREATE_POST,
        {
          method: 'POST',
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Create Post Error:', error);
      throw error;
    }
  },

  // Get Posts by Category (No auth required for browsing)
  getPostsByCategory: async (categoryId, pageNumber = 1, pageSize = 20, sortBy = 'NEWEST') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts/category/${categoryId}?sortBy=${sortBy}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Posts Error:', error);
      throw error;
    }
  },

  // Get User Profile (AUTH REQUIRED)
  getUserProfile: async () => {
    try {
      const response = await authenticatedFetch(
        '/user/auth/profile',
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get Profile Error:', error);
      throw error;
    }
  },

  // Get User's Posts (AUTH REQUIRED)
  getMyPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await authenticatedFetch(
        `/user/post/my-posts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get My Posts Error:', error);
      throw error;
    }
  },

  // Search Posts (No auth required)
  searchPosts: async (query, pageNumber = 1, pageSize = 20, sortBy = 'NEWEST') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts/search?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search Posts Error:', error);
      throw error;
    }
  },

};

export default API_CONFIG;