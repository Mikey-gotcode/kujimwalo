<template>
  <ProductNav />
  <div class="page-content py-8" :class="{ 'bg-gray-100 text-black': theme === 'light', 'bg-gray-900 text-white': theme === 'dark' }">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar -->
        <div class="lg:w-1/4 w-full">
          <CategoriesSide />
        </div>

        <!-- Main Content -->
        <div class="flex-1 p-4">
          <div class="shadow-md rounded-lg p-6"
            :class="{ 'bg-white text-black': theme === 'light', 'bg-gray-800 text-white': theme === 'dark' }">
        

            <!-- Buttons -->
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

            <!-- Tab Navigation -->
            <div>
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

            <!-- Tab Content -->
            <div class="mt-4" v-for="tab in tabs" :key="tab.label">
              <OtherProducts v-if="selectedTab === tab.id" :activeTab="currentTab" ref="hDrinkNumb" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed, nextTick, inject } from 'vue';
import axios from 'axios';
import api from '../../../api';
import ProductNav from '../products/ProductNav.vue';
import CategoriesSide from '../../layouts/CategoriesSide.vue';
import OtherProducts from '../admin/categories/OtherProducts.vue';
import AddProduct from '../admin/categories/AddProducts.vue'; 
import AddCategory from '../admin/categories/AddCategory.vue'; 
import { useAuthStore } from '../../../store/auth';
import {useRouter} from 'vue-router'
//import Pagination from 'vue3-pagination'


const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);
const showProductModal = ref(false);
const showCategoryModal = ref(false);
const hDrinkNumb = ref(null);

const authStore = useAuthStore()
const router = useRouter()

const tabs = ref([]);
const categoryMap = ref({});
const selectedTab = ref(null);
//const perPage = ref(10);
//const totalProducts = ref(0);

// Inject theme
const theme = inject("theme");
//const toggleTheme = inject("toggleTheme");

const fetchCategories = async () => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get(`${api.baseURL}/category`, {
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
    console.error('Error fetching categories:', error);
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
