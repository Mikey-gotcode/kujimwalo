<template>
  <ProductNav />
  <div class="page-content py-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar (Hidden in Mobile, Shows in Larger Screens) -->
        <div class="lg:w-1/4 w-full">
          <CategoriesSide />
        </div>

        <!-- Main Content -->
        <div class="flex-1 p-4">
          <div class="bg-white shadow-md rounded-lg p-6">
            <!-- Buttons -->
            <div class="flex flex-wrap justify-end gap-4 mb-4">
              <button @click="showProductModal = true" class="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
                + Add Product
              </button>
              <button @click="showCategoryModal = true" class="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
                + Add Category
              </button>
            </div>

            <AddProduct v-if="showProductModal" :isOpen="showProductModal" title="Add Product" @close="showProductModal = false"/>
            <AddCategory v-if="showCategoryModal" :isOpen="showCategoryModal" title="Add Category" @close="showCategoryModal = false"/>

            <div class="border-b pb-4 mb-4">
              <h3 class="text-xl font-semibold">Products</h3>
            </div>

            <!-- Tab Navigation -->
            <div>
              <ul class="flex flex-wrap border-b">
                <li 
                  v-for="tab in tabs" 
                  :key="tab.id"
                  @click="selectTab(tab.id)"
                  class="mr-2 sm:mr-4 cursor-pointer py-2 px-2 sm:px-4 font-semibold transition-colors duration-300 text-sm sm:text-base"
                  :class="selectedTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
                >
                  {{ tab.label }} ({{ tab.count }})
                </li>
              </ul>
            </div>

            <!-- Tab Content -->
            <div class="mt-4" v-for="tab in tabs" :key="tab.label">
              <OtherProducts v-if="selectedTab === tab.id" :activeTab="currentTab" ref="hDrinkNumb"/>
            </div>
          </div>

          <!-- Pagination
          <div class="mt-6 flex flex-col sm:flex-row justify-between items-center">
            <p class="text-gray-700 text-sm sm:text-base">Page 1 of 2</p>
            <ul class="flex space-x-2 mt-2 sm:mt-0">
              <li class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm sm:text-base">1</li>
              <li class="bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md cursor-pointer text-sm sm:text-base">2</li>
              <li class="bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md cursor-pointer">
                <i class="bx bx-chevron-right"></i>
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import axios from 'axios';
import api from '../../../api';
import ProductNav from '../products/ProductNav.vue';
import CategoriesSide from '../../layouts/CategoriesSide.vue';
import OtherProducts from '../admin/categories/OtherProducts.vue';
import AddProduct from '../admin/categories/AddProducts.vue'; 
import AddCategory from '../admin/categories/AddCategory.vue'; 
//import Pagination from 'vue3-pagination'


const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);
const showProductModal = ref(false);
const showCategoryModal = ref(false);
const hDrinkNumb = ref(null);

const tabs = ref([]);
const categoryMap = ref({});
const selectedTab = ref(null);
//const perPage = ref(10);
//const totalProducts = ref(0);

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${api.baseURL}/category`);
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
