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
              Sign up for an account
            </h1>
            <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
                <div>
                <label for="Name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Full Name</label>
                <input v-model="form.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required>
              </div>
              <div>
                <label for="phone_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                <input v-model="form.email" type="email" id="number" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@gmail.com" required>
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input v-model="form.password" type="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
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
                <router-link to="/signin" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Already Have an Account?</router-link>
              </div>
              <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { reactive } from "vue";
  import { useAuthStore } from "../../../store/auth";
  import axios from "axios";
  import { useRouter } from "vue-router";
  import api from "../../../api"; // Import the API configuration
  
  const form = reactive({
    name:"",
    email: "",
    password: "",
    remember: false,
  });
  

  const router =useRouter()

  const submitForm = async () => {
  // Remove country code and ensure the phone number is 10 digits
  // const phone = form.phone_number.replace(/^(\+254|0)/, '').slice(0, 10);

  // // Update the form with the cleaned phone number
  // form.phone_number = phone;

  console.log("user information:",form)

  try {
    const authStore =useAuthStore()
    const response = await axios.post(`${api.baseURL}/register`, form);
    console.log("Login successful:", response.data);
    await authStore.login(form, router);
    // Handle success (e.g., store token, redirect)
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error.message);
    // Handle errors (e.g., show error message)
  }
};

  </script>
  