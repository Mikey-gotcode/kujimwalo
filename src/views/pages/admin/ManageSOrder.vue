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
import { ref, computed, inject, onMounted, nextTick, watch } from 'vue'
import ProductNav from '../products/ProductNav.vue'
import CategoriesSide from '../../pages/products/categories/CategoriesSide(2).vue'
import OrdersList from './OrdersList.vue'

// Inject theme
const theme = inject('theme');

// Computed class for theme styling
const themeClasses = computed(() => theme.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800');
const borderClass = computed(() => theme.value === 'dark' ? 'border-gray-600' : 'border-gray-300');

const selectedTab = ref('orders')

const tabs = ref([
    { id: 'orders', label: 'Manage Orders' },
    { id: 'unpaid', label: 'Pending Bills' },
    { id: 'completed', label: 'Completed Transactions' },
    { id: 'cancelled', label: 'Cancelled Orders' }
])

const categoryMap = ref({
    orders: 'pending',
    unpaid: 'unpaid',
    completed: 'completed',
    cancelled: 'cancelled'
})

// Function to update selectedTab
const selectTab = (tabId) => {
  selectedTab.value = tabId;
};

const getCurrentTab = () => categoryMap[selectedTab.value]

// Watch selectedTab and update currentTab accordingly
const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);

watch(selectedTab, (newValue) => {
    console.log("Updated currentTab:", currentTab.value);
});

onMounted(() => {
    getCurrentTab();
});
</script>
