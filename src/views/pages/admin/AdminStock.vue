<template>
  <ProductNav />
  <!-- <Student_Breadcrumb :title="title" :text="text" :text1="text1" /> -->
  <div class="page-content py-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-row lg:flex-row gap-6">
        <!-- Sidebar -->
        <div class="flex">
          <CategoriesSide />
        </div>

        <!-- Student Courses -->
        <div class="flex-1 p-4">
          <div class="bg-white shadow-md rounded-lg p-6">


            <!-- Buttons for Adding Product & Category -->
            <div class="flex justify-end gap-4 mb-4">
              <button @click="showProductModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">
                + Add Product
              </button>
              <button @click="showCategoryModal = true" class="bg-blue-500 text-white px-4 py-2 rounded ">
                + Add Category
              </button>
            </div>
            <!-- Add modal -->
             <AddProduct v-if="showProductModal" :isOpen="showProductModal" title="Add Product" @close="showProductModal = false"/>


             <!-- Add modal -->
             <AddCategory  v-if="showCategoryModal" :isOpen="showCategoryModal" title="Add Category" @close="showCategoryModal = false"/>




            <div class="border-b pb-4 mb-4">
              <h3 class="text-xl font-semibold">Products</h3>
            </div>

               <!-- Tab Navigation -->
               <div>
              <ul class="flex border-b">
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


            <!-- Tab Content
            <div class="mt-4">
              <OtherProducts v-if="selectedTab === 'vodka'" :activeTab="currentTab" ref="eCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'gin'" :activeTab="currentTab" ref="aCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'spirits'" :activeTab="currentTab" ref="cCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'whiskey'" :activeTab="currentTab" ref="cCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'cigarettes'" :activeTab="currentTab" ref="cCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'soft'" :activeTab="currentTab" ref="cCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'liquer'" :activeTab="currentTab" ref="cCoursesNumb" />
              <OtherProducts v-if="selectedTab === 'beer'" :activeTab="currentTab" ref="cCoursesNumb" />
            </div> -->
          </div>

          <!-- Pagination -->
          <div class="mt-6 flex justify-between items-center">
            <p class="text-gray-700">Page 1 of 2</p>
            <ul class="flex space-x-2">
              <li class="bg-blue-600 text-white px-3 py-1 rounded-md">1</li>
              <li class="bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md cursor-pointer">2</li>
              <li class="bg-gray-200 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md cursor-pointer">
                <i class="bx bx-chevron-right"></i>
              </li>
            </ul>
          </div>
        </div>
        <!-- /Student Courses -->
      </div>
    </div>
  </div>

  <!-- <FooterOne /> -->
</template>



<script setup>
import { ref, onMounted,watch ,computed,nextTick } from 'vue';
import axios from 'axios';
import api from '../../../api';
import ProductNav from '../products/ProductNav.vue'
//   import Student_Breadcrumb from '@/components/breadcrumb/student-breadcrumb.vue';
import CategoriesSide from '../../layouts/CategoriesSide.vue'
import OtherProducts from '../admin/categories/OtherProducts.vue';
import AddProduct from '../admin/categories/AddProducts.vue' 
import AddCategory from '../admin/categories/AddCategory.vue' 

// const ruffN =ref(7) 

// const categoryMap = {
// vodka: 1,
// gin: 2,
// spirits: 3,
// whiskey: 4,
// beer: 9,
// cigarettes: 6,
// soft: 7,
// liquer: 8
// };




// Computed property to map selectedTab to categoryMap
const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);

const showProductModal = ref(false);
const showCategoryModal = ref(false);


// References for child components
const hDrinkNumb = ref(null);


// Tab Data (reactive)
const tabs = ref([]);
const categoryMap = ref({});
const selectedTab = ref(null);


// Fetch categories and dynamically create categoryMap
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${api.baseURL}/category`);
    
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
    console.error('Error fetching categories:', error);
  }
};


console.log(selectedTab)

const getCurrentTab = () => categoryMap[selectedTab.value]


// Update course count after component is mounted
onMounted(() => {
  fetchCategories()
  updateProductCounts();
  getCurrentTab()
  //console.log("this is the seleedTAbct",selectedTab)
});
// Watch selectedTab and update currentTab accordingly
watch(selectedTab, (newValue) => {
currentTab.value = categoryMap[newValue] || null;
//console.log("Updated currentTab:", currentTab.value);
});

// Function to update selectedTab
const selectTab = (tabId) => {
  selectedTab.value = tabId;
  console.log("Selected tab:", selectedTab.value, "Current tab:", currentTab.value);
};


// Function to update product counts dynamically
const updateProductCounts = async () => {
  await nextTick();
  tabs.value = tabs.value.map(tab => ({
    ...tab,
    label: `${tab.label} (${hDrinkNumb.value?.courseCount || 0})`
  }));
};
</script>

