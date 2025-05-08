<template>
  <div class="p-5 mb-6 border rounded-2xl lg:p-6 transition"
    :class="theme === 'dark' ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-800'">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center">
        <div aria-label="Loading..." role="status" class="flex items-center space-x-2">
          <svg class="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
              <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
              <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          </svg>
          <span class="text-4xl font-medium text-gray-500">Loading...</span>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- Profile Data -->
    <div v-else class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
        <div class="w-20 h-20 overflow-hidden border rounded-full"
          :class="theme === 'dark' ? 'border-gray-800' : 'border-gray-200'">
          <img :src="user.profilePic" alt="User Avatar" class="w-full h-full object-cover" />
        </div>

        <div class="order-3 xl:order-2">
          <h4 class="mb-2 text-lg font-semibold text-center xl:text-left">
            {{ user.name }}
          </h4>
          <div class="flex flex-col items-center gap-1 xl:flex-row xl:gap-3 xl:text-left">
            <p class="text-sm">{{ user.role }}</p>
            <div class="hidden h-3.5 w-px xl:block" :class="theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'"></div>
            <p class="text-sm">{{ user.location }}</p>
          </div>
        </div>

        <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
          <a v-for="(link, index) in user.socialLinks" :key="index" :href="link.url" target="_blank" rel="noopener"
            class="social-button">
            <svg class="fill-current w-5 h-5" viewBox="0 0 20 20">
              <path :d="link.icon" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, inject } from "vue";
//import axios from "axios";
import { useAuthStore } from "../../../../store/auth";
import {useRouter} from 'vue-router'
import api from "../../../../api";

const theme = inject("theme");

const authStore = useAuthStore()
const router = useRouter()


const user = ref({});
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
      const authToken = authStore.token;

      if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
      }
    const response = await api.get('/user/', {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
    withCredentials: true,
  });
    user.value = response.data;
  } catch (err) {
    error.value = "Failed to load user data";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.social-button {
  @apply p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600;
}
</style>
