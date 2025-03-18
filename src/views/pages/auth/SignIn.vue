<template>
    <section class="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div class="grid gap-2 items-center justify-center px-6 py-8 mx-auto sm:w-full md:w-auto">
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="../../../assets/icons/drinks-svgrepo-com.svg" alt="logo">
          KUJIMWALO    
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
              <div>
                <label for="phone_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input v-model="form.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@gmail.com" required>
              </div>
             <!-- Password Field -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <div class="relative">
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-3 flex items-center">
                  <svg v-if="showPassword" class="w-5 h-5 text-gray-500 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.75 15.75A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6a5.978 5.978 0 011.25-3.75M9 10l3 3m0-3l-3 3M21 12c-3.75 6-9 6-12 0 3.75-6 9-6 12 0z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3a3 3 0 01-.88 2.12M9.88 9.88L3 3m9 9a3 3 0 013 3m0 0l6.12 6.12m-3.12-3.12a5.978 5.978 0 01-3.88 1.5c-3.314 0-6-2.686-6-6a5.978 5.978 0 011.5-3.88" />
                  </svg>
                </button>
              </div>
              <p v-if="errorMessage.password" class="text-red-500 text-sm">{{ errorMessage.password[0] }}</p>
            </div>
              <div v-if="errorMessage" class="text-red-500 text-sm">
                    {{ errorMessage }}
                  </div>

              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input v-model="form.remember" type="checkbox" id="remember" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <!-- Sign-in Button with Loading Spinner -->
              <button type="submit" :disabled="isLoading" 
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg border border-gray-300 text-sm px-5 py-2.5 flex items-center justify-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
              </svg>
              <span v-if="!isLoading">Sign in</span>
              <span v-else>Signing in...</span>
            </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <router-link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
import { reactive ,ref } from 'vue';
import { useAuthStore } from '../../../store/auth';
import axios from 'axios';
import api from "../../../api"; // Import the API configuration
import { useRouter } from 'vue-router'; // Import router

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const router = useRouter(); // Declare router here

const errorMessage = ref("");
const showPassword = ref(false);
const authStore = useAuthStore()
const isLoading = ref(false);

const submitForm = async () => {
  errorMessage.value = ""; // Reset error message before submission
  isLoading.value=true //start loading effect
  try {
    const response = await axios.post(`${api.baseURL}/login`, form, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    console.log("Login successful:", response.data);

    // Save token and redirect
    await authStore.login(form, router);
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || "Login failed. Please try again.";
    } else {
      errorMessage.value = "Network error. Please check your connection.";
    }
  } finally {
    isLoading.value = false; // Stop loading
  }
};
;

</script>