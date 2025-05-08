<template>
  <AdminLayout>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div class="flex items-center w-full sm:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Products by Name"
          class="w-full px-4 py-2 rounded border"
          :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }"
          @keyup.enter="triggerSearch"
        />
        <button
          @click="triggerSearch"
          class="ml-2 px-4 py-2 rounded"
          :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }"
        >
          Search
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <label :class="{ 'text-gray-700': theme === 'light', 'text-gray-300': theme === 'dark' }">Filter by Price:</label>
        <select v-model="priceFilter" @change="filterProducts"
          class="px-2 py-1 rounded border"
          :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark', 'bg-white': theme === 'light', 'bg-gray-800 text-white': theme === 'dark' }"
        >
          <option value="">None</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap justify-end gap-4 mb-4">
      <button @click="showProductModal = true"
        class="px-4 py-2 rounded w-full sm:w-auto"
        :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }">
        + Add Product
      </button>
      <button @click="showCategoryModal = true"
        class="px-4 py-2 rounded w-full sm:w-auto"
        :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }">
        + Add Category
      </button>
    </div>

    <AddProduct v-if="showProductModal" :isOpen="showProductModal" title="Add Product" @close="showProductModal = false" />
    <AddCategory v-if="showCategoryModal" :isOpen="showCategoryModal" title="Add Category" @close="showCategoryModal = false" />

    <div class="border-b pb-4 mb-4"
      :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
      <h3 class="text-xl font-semibold">Products</h3>
    </div>

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
    <div v-else>
      <ul class="flex flex-wrap border-b"
        :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
        <li v-for="tab in tabs" :key="tab.id"
          @click="selectTab(tab.id)"
          class="mr-2 sm:mr-4 cursor-pointer py-2 px-2 sm:px-4 font-semibold transition-colors duration-300 text-sm sm:text-base"
          :class="selectedTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'">
          {{ tab.label }} ({{ tab.count }})
        </li>
      </ul>
    </div>

    <div class="mt-4" v-for="tab in tabs" :key="tab.label">
      <OtherProducts
        v-if="selectedTab === tab.id"
        :activeTab="currentTab"
        ref="hDrinkNumb"
        :searchQuery="localSearchQuery"
        :priceFilter="priceFilter"
        @search="handleSearch"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick, inject } from 'vue';
import axios from 'axios';
import api from '../../../api';
import AdminLayout from './AdminLayout.vue';
import OtherProducts from '../admin/categories/OtherProducts.vue';
import AddProduct from '../admin/categories/AddProducts.vue';
import AddCategory from '../admin/categories/AddCategory.vue';
import { useAuthStore } from '../../../store/auth';
import { useRouter } from 'vue-router';
//import Pagination from 'vue3-pagination'

const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);
const showProductModal = ref(false);
const showCategoryModal = ref(false);
const hDrinkNumb = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const error = ref(null);

const tabs = ref([]);
const categoryMap = ref({});
const selectedTab = ref(null);
//const perPage = ref(10);
//const totalProducts = ref(0);

// Search and Filter functionality
const localSearchQuery = ref(''); // Use a local ref for the input
const priceFilter = ref('');
const emittedSearchQuery = ref(''); // Ref to hold the value to pass to OtherProducts

const triggerSearch = () => {
  emittedSearchQuery.value = localSearchQuery.value;
};

const handleSearch = (query) => {
  // This will be called by the OtherProducts component if needed
  console.log('Search triggered from OtherProducts:', query);
  localSearchQuery.value = query; // Update the input field if needed
};

const filterProducts = () => {
  // No direct filtering here anymore, the 'triggerSearch' handles it
  emittedSearchQuery.value = localSearchQuery.value;
};

// Inject theme
const theme = inject("theme");
//const toggleTheme = inject("toggleTheme");

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get('/category', {
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
    tabs.value = response.data.map((category) => ({
      id: category.id,
      label: category.name,
      count: category.productCount || 0,
    }));
    categoryMap.value = response.data.reduce((map, category, index) => {
      map[category.id] = index + 1;
      return map;
    }, {});
    if (tabs.value.length > 0) {
      selectedTab.value = tabs.value[0].id;
    }
  } catch (error) {
    error.value = "Failed to fetch products. Please try again later.";
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

const selectTab = (tabId) => {
  selectedTab.value = tabId;
};

onMounted(() => {
  fetchCategories();
  updateProductCounts();
});

watch(selectedTab, (newValue) => {
  currentTab.value = categoryMap[newValue] || null;
});

const updateProductCounts = async () => {
  await nextTick();
  tabs.value = tabs.value.map(tab => ({
    ...tab,
    label: `${tab.label} (${hDrinkNumb.value?.courseCount || 0})`
  }));
};
</script>