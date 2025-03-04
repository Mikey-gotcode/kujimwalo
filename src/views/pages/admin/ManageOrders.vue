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

                <div class="flex-1 p-4 ">
                    <div class="bg-white shadow-md rounded-lg p-6">
                        <div class="border-b pb-4 mb-4">
                            <h3 class="text-xl font-semibold">Orders</h3>
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
                <OrdersList v-if="selectedTab === tab.id" :activeTab="currentTab" />
            </div>


                     
                    </div>
                </div>



            </div>
        </div>
    </div>

    <!-- <FooterOne /> -->
</template>


<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import ProductNav from '../products/ProductNav.vue'
import CategoriesSide from '../../layouts/CategoriesSide.vue'
import OrdersList from './OrdersList.vue';

// Computed property to map selectedTab to categoryMap
const currentTab = computed(() => categoryMap.value[selectedTab.value] || null);

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