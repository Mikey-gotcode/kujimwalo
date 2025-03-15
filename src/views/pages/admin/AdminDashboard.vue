<script setup>
import { ref, inject,  } from 'vue';
import ProductNav from '../products/ProductNav.vue';
import CategoriesSide from '../../layouts/CategoriesSide.vue';
import ProfileCard from './ProfileCard.vue';

// Inject theme
const theme = inject('theme');

// Reactive profile data
const profile = ref({
 firstName: 'Rolands',
 lastName: 'Richard',
 username: 'rolandsr',
 email: 'rolands@example.com',
 phoneNumber: '+1234567890',
 bio: 'A passionate student learning Vue.js and Tailwind CSS.'
});

</script>

<template>
    <ProductNav />
    <!-- <Student_Breadcrumb :title="title" :text="text" :text1="text1" /> -->
    <div class="page-content py-8" :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="flex">
                    <CategoriesSide />
                </div>

                <div class="flex-1 p-4 ">
                    <div class="bg-white shadow-md rounded-lg p-6"
                    :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }">
                        <div class="border-b pb-4 mb-4">
                            <h3 class="text-xl font-semibold"></h3>
                        </div>
                        <ProfileCard/>
                        <CustomerProfile/>

                       


                    </div>
                </div>



            </div>
        </div>
    </div>

    <!-- <FooterOne /> -->
</template>
