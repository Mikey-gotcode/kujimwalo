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

                <!-- Student Profile (Right Panel) -->
                <div class="flex flex-col lg:flex-row justify-center items-center gap-8 px-6 py-10">

                    <!-- Profile Section -->
                    <div class="w-full lg:w-3/4 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
                        <div class="py-6">
                            <div class="flex justify-center">
                                <router-link to="/student/student-profile">
                                    <img src="" alt="Profile"
                                        class="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gray-300 shadow-xl" />
                                </router-link>
                            </div>
                            <h4 class="mt-4 font-semibold text-2xl text-gray-800">
                                <router-link to="/student/student-profile">{{ profile.firstName }}
                                    {{ profile.lastName }}</router-link>
                            </h4>
                            <p class="text-gray-500 text-lg">Student</p>
                        </div>
                    </div>

                    <!-- Profile Information -->
                    <div class="w-full lg:w-3/4 bg-white shadow-lg rounded-lg p-8">
                        <div class="border-b pb-4 mb-4">
                            <h3 class="text-2xl font-semibold text-gray-800">My Profile</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h6 class="text-gray-600 font-medium">First Name</h6>
                                <p class="text-gray-800">{{ profile.firstName }}</p>
                            </div>
                            <div>
                                <h6 class="text-gray-600 font-medium">Last Name</h6>
                                <p class="text-gray-800">{{ profile.lastName }}</p>
                            </div>
                            <div>
                                <h6 class="text-gray-600 font-medium">User Name</h6>
                                <p class="text-gray-800">{{ profile.username }}</p>
                            </div>
                            <div>
                                <h6 class="text-gray-600 font-medium">Email</h6>
                                <p class="text-gray-800">{{ profile.email }}</p>
                            </div>
                            <div>
                                <h6 class="text-gray-600 font-medium">Phone Number</h6>
                                <p class="text-gray-800">{{ profile.phoneNumber }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <h6 class="text-gray-600 font-medium">Bio</h6>
                                <p class="text-gray-800">{{ profile.bio }}</p>
                            </div>
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