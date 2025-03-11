<template>
    <ProductNav />
    <div class="page-content py-8" :class="{ 'bg-gray-100 text-black': theme === 'light', 'bg-gray-900 text-white': theme === 'dark' }">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="lg:w-1/4 w-full">
                    <CategoriesSide />
                </div>

                <div class="flex-1 p-4">
                    <div :class="['shadow-md rounded-lg p-6', themeClasses]">
                        <div class="border-b pb-4 mb-4" :class="borderClass">
                            <h3 class="text-xl font-semibold">Orders</h3>
                        </div>

                        <!-- Tab Navigation -->
                        <div>
                            <ul class="flex border-b" :class="borderClass">
                                <li 
                                    v-for="tab in tabs" 
                                    :key="tab.id"
                                    @click="selectTab(tab.id)"
                                    class="mr-4 hover:cursor-pointer py-2 px-4 font-semibold transition-colors duration-300"
                                    :class="selectedTab === tab.id 
                                        ? 'border-b-2 text-blue-600 border-blue-600' 
                                        : theme.value === 'dark' 
                                            ? 'text-gray-400 hover:text-blue-400' 
                                            : 'text-gray-600 hover:text-blue-600'"
                                >
                                    {{ tab.label }} ({{ tab.count }})
                                </li>
                            </ul>
                        </div>

                        <!-- Tab Content -->
                        <div class="mt-4" v-for="tab in tabs" :key="tab.label">
                            <OrdersList v-if="selectedTab === tab.id" :activeTab="currentTab" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, computed, onMounted, nextTick, watch, inject } from 'vue'
import ProductNav from '../products/ProductNav.vue'
import CategoriesSide from '../products/categories/CategoriesSide.vue'
import OrdersList from '../products/OrderLIst.vue'

// Computed property to map selectedTab to categoryMap
const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);


// Inject theme
const theme = inject('theme');

// Computed class for theme styling
const themeClasses = computed(() => theme.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800');
const borderClass = computed(() => theme.value === 'dark' ? 'border-gray-600' : 'border-gray-300');

const selectedTab = ref('orders')


// References for child components
const hDrinkNumb = ref(null);

const tabs = ref([
    {id:'orders',label:'Manage Orders'},
    {id:'unpaid',label:'Pending Bills'},
    {id:'completed', label:'Completed Transactions'},
    {id:'cancelled',label:'Cancelled orders'}
])

//const showChildCompunent = ref(false)


const categoryMap = ref({
    orders:'pending',
    unpaid:'unpaid',
    completed:'completed',
    cancelled:'cancelled'

})


// Function to update selectedTab
const selectTab = (tabId) => {
  selectedTab.value = tabId;
  console.log("Selected tab:", selectedTab.value, "Current tab:", currentTab.value);
};

// Function to update product counts dynamically
const updateRecordsCounts = async () => {
  await nextTick();
  tabs.value = tabs.value.map(tab => ({
    ...tab,
    label: `${tab.label} (${hDrinkNumb.value?.courseCount || 0})`
  }));
};


const getCurrentTab = () => categoryMap[selectedTab.value]


// Watch selectedTab and update currentTab accordingly
watch(selectedTab, (newValue) => {
currentTab.value = categoryMap[newValue] || null;
console.log("Updated currentTab:", currentTab.value);
});

onMounted(()=>{
    updateRecordsCounts()
    getCurrentTab()
})

 </script>