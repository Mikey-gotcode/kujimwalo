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
                                <li v-for="tab in tabs" :key="tab.id" @click="selectedTab = tab.id"
                                    class="mr-4 hover:cursor-pointer py-2 px-4 font-semibold transition-colors duration-300"
                                    :class="selectedTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'">
                                    {{ tab.label }}
                                </li>
                            </ul>
                        </div>

                        <div class="mt-4">
                            <OrdersList v-if="selectedTab === 'orders'" />
                            <UnpaidTabs v-if="selectedTab === 'unpaid'" />
                        </div>
                    </div>
                </div>



            </div>
        </div>
    </div>

    <!-- <FooterOne /> -->
</template>


<script setup>
import { ref } from 'vue'
import ProductNav from '../products/ProductNav.vue'
import CategoriesSide from '../../layouts/CategoriesSide.vue'
import OrdersList from './OrdersList.vue';
import UnpaidTabs from './UnpaidTabs.vue';

const selectedTab = ref('orders')


const tabs = ref([
    {id:'orders',label:'Manage Orders'},
    {id:'unpaid',label:'Pending Bills'}
])


// // Reactive profile data
// const profile = ref({
//  firstName: 'Rolands',
//  lastName: 'Richard',
//  username: 'rolandsr',
//  email: 'rolands@example.com',
//  phoneNumber: '+1234567890',
//  bio: 'A passionate student learning Vue.js and Tailwind CSS.'
// });



 </script>