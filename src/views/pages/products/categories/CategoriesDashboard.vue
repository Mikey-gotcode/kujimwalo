<template>
  <ProductNav /> 
  <div class="page-content py-8" :class="{ 'bg-gray-100 text-black': theme === 'light', 'bg-gray-900 text-white': theme === 'dark' }">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex ml-6 pl-6">
          <CategoriesSide />
        </div>

        <div class="flex-1 p-4">
          <div class="shadow-md rounded-lg p-6 "
          :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }">

            <!-- View Cart Button (Fixed at Bottom) -->
            <button 
              v-if="cart.length" 
              @click="toggleCart" 
              class="fixed bottom-5 right-5 md:right-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 md:py-4 md:px-5 rounded-lg shadow-lg transition"
              :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }"
            >
              View Cart ({{ cart.length }})
            </button>

            <div class="border-b pb-4 mb-4"
            :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
              <h3 class="text-xl font-semibold">Products</h3>
            </div>
            
            <!-- Tab Navigation -->
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
              <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>

            <div v-else class="overflow-x-auto">
              <ul class="flex border-b whitespace-nowrap"
              :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
                <li 
                  v-for="tab in tabs" 
                  :key="tab.id"
                  @click="selectTab(tab.id)"
                  class="mr-4 hover:cursor-pointer py-2 px-4 font-semibold transition-colors duration-300"
                  :class="selectedTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
                >
                  {{ tab.label }} ({{ tab.count }})
                </li>
              </ul>
            </div>
            
            <!-- Tab Content -->
            <div class="mt-4" v-for="tab in tabs" :key="tab.label">
              <OtherProducts v-if="selectedTab === tab.id" :activeTab="currentTab"  ref="hDrinkNumb"/>
            </div>
          </div>
          
     
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, inject } from 'vue';
import axios from 'axios';
import api from '../../../../api';
import ProductNav from '../ProductNav.vue';
import CategoriesSide from '../categories/CategoriesSide.vue';
import OtherProducts from './OtherProducts.vue';
import { useAuthStore } from '../../../../store/auth';
import {useRouter} from 'vue-router'

const tabs = ref([]);
const categoryMap = ref({});
const cart = ref([]);
const selectedTab = ref(null);
const showCart = ref(false); // Controls cart visibility

// Computed property to map selectedTab to categoryMap
const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);
const authStore = useAuthStore()
const router = useRouter()


// Inject theme
const theme = inject("theme");

const loading = ref(true);
const error = ref(null);



// Fetch categories and dynamically create categoryMap
const fetchCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const authToken = authStore.token

    // if (!authToken) {
    //   alert("You need to log in first.");
    //   router.push('/signin');
    //   return;
    // }
    const response = await axios.get(`${api.baseURL}/category`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
    
    tabs.value = response.data.map((category, index) => ({
      id: category.id, // Unique ID from API
      label: category.name,
      count: category.productCount || 0,
    }));

    // Generate a dynamic categoryMap from API response
    categoryMap.value = response.data.reduce((map, category, index) => {
      map[category.id] = index + 1; // Assign index-based mapping dynamically
      return map;
    }, {});

    if (tabs.value.length > 0) {
      selectedTab.value = tabs.value[0].id; // Set first tab as default
    }

  } catch (error) {
    error.value = "Failed to fetch products. Please try again later.";
    console.error('Error fetching categories:', error);
  }finally {
    loading.value = false;
  }
};

// Function to update selectedTab
const selectTab = (tabId) => {
  selectedTab.value = tabId;
  console.log("Selected tab:", selectedTab.value, "Current tab:", currentTab.value);
};

// References for child components
const hDrinkNumb = ref(null);

// Function to update product counts dynamically
const updateProductCounts = async () => {
  await nextTick();
  tabs.value = tabs.value.map(tab => ({
    ...tab,
    label: `${tab.label} (${hDrinkNumb.value?.courseCount || 0})`
  }));
};


const toggleCart = () => {
  nextTick(() => {
    showCart.value = !showCart.value;
  });
};
const checkout = async () => {
  console.log("shopping cart:",cart.value)
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const orderResponse = await axios.post(`${api.baseURL}/orders`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    }, { items: cart.value });
    const orderId = orderResponse.data.id;
    
    for (const item of cart.value) {
      await axios.post(`${api.baseURL}/order_items/`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    },{ orderId, productId: item.id, quantity: item.quantity });
    }
    
    alert("Order placed successfully!");
    cart.value = [];
  } catch (error) {
    console.error("Error processing order:", error);
  }
};

onMounted(() => {
  fetchCategories();
  updateProductCounts();
});
</script>
