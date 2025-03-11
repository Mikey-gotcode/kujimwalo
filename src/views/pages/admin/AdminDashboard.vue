<script setup>
import { ref, inject, computed } from 'vue';
import ProductNav from '../products/ProductNav.vue';
import CategoriesSide from '../../layouts/CategoriesSide.vue';

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

// Computed class for theme switching
const themeClasses = computed(() => theme.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800');
const borderClass = computed(() => theme.value === 'dark' ? 'border-gray-600' : 'border-gray-300');
</script>

<template>
    <ProductNav />
    <div class="page-content py-8" :class="{ 'bg-white text-black': theme === 'light', 'bg-gray-800 text-white': theme === 'dark' }">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="lg:w-1/4 w-full">
                    <CategoriesSide />
                </div>

                <!-- Student Profile (Right Panel) -->
                <div class="flex flex-col lg:flex-row justify-center items-center gap-8 px-6 py-10">

                    <!-- Profile Section -->
                    <div :class="['w-full lg:w-3/4 shadow-lg rounded-lg p-8 flex flex-col items-center', themeClasses]">
                        <div class="py-6">
                            <div class="flex justify-center">
                                <router-link to="/student/student-profile">
                                    <img src="" alt="Profile"
                                        :class="['w-40 h-40 md:w-48 md:h-48 rounded-full border-4 shadow-xl', borderClass]" />
                                </router-link>
                            </div>
                            <h4 class="mt-4 font-semibold text-2xl">
                                <router-link to="/student/student-profile">{{ profile.firstName }} {{ profile.lastName }}</router-link>
                            </h4>
                            <p class="text-lg" :class="theme.value === 'dark' ? 'text-gray-400' : 'text-gray-500'">Student</p>
                        </div>
                    </div>

                    <!-- Profile Information -->
                    <div :class="['w-full lg:w-3/4 shadow-lg rounded-lg p-8', themeClasses]">
                        <div class="border-b pb-4 mb-4" :class="borderClass">
                            <h3 class="text-2xl font-semibold">My Profile</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="(value, key) in profile" :key="key">
                                <h6 class="font-medium" :class="theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600'">{{ key }}</h6>
                                <p>{{ value }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
