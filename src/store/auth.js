// stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import api from '../api'; // Make sure this imports your API base URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null, // Store role
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getRole: (state) => state.role,
  },

  actions: {
    setUser(userData, token) {
      this.user = userData;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },

    clearUser() {
      this.user = null;
      this.token = null;
      this.role = role;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.setItem('role', role);
    },

    async login(formData, router) {
      try {
        // Send login request to backend API
        const response = await axios.post(`${api.baseURL}/login`, formData);
        
        // Extract user details and token
        const { user, token, role } = response.data;

        // Store user data and token
        this.setUser(user, token, role);
        console.log("user token",token)

        // Redirect based on role
        this.redirectUser(role, router);
      } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error so it can be handled in the component
      }
    },

    async register(formData, router) {
      try {
        // Send register request to backend API
        const response = await axios.post(`${api.baseURL}/register`, formData);

        // Extract user details
        const { user } = response.data;

        // Default token (if API provides one on register)
        const token = user.token || null;
        const role = user.role || 'customer'; // Default to customer if role is missing

        // Store user data and token
        this.setUser(user, token, role);

        // Redirect based on role
        this.redirectUser(role, router);
      } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error so it can be handled in the component
      }
    },

    redirectUser(role, router) {
      switch (role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'staff':
          router.push('/staff');
          break;
        case 'customer':
        default:
          router.push('/customer');
          break;
      }
    },

    async logout(router) {
      this.clearUser();
      router.push('/login');
    },
  },
});
