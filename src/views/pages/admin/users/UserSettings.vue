<template>
    <ProductNav />
    <!-- <Student_Breadcrumb :title="title" :text="text" :text1="text1" /> -->
    <div class="page-content py-8 ":class="{ 'bg-gray-100 text-black': theme === 'light', 'bg-gray-900 text-white': theme === 'dark' }">
        <div class="container mx-auto px-4">
            <div class="flex flex-row lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="flex">
                    <CategoriesSide />
                </div>

                <div class="flex-1 p-4 ">
                    <div class="shadow-md rounded-lg p-6"
                    :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }">
                        <div class="border-b pb-4 mb-4"
                        :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
                            <h3 class="text-xl font-semibold">Settings</h3>
                        </div>
                        <SettingsSection/>
                       

                       


                    </div>
                </div>



            </div>
        </div>
    </div>

    <!-- <FooterOne /> -->
</template>

<script setup>

import { inject } from 'vue';
import CategoriesSide from '../../../pages/products/categories/CategoriesSide.vue'
import ProductNav from '../../../pages/products/ProductNav.vue'
import SettingsSection from './SettingsSection.vue';

const theme = inject("theme")


</script>