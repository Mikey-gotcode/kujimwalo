<template>
    <ProductNav />
    <!-- <Student_Breadcrumb :title="title" :text="text" :text1="text1" /> -->
    <div class="page-content py-8" :class="{ 'bg-white text-black': theme === 'light', 'bg-gray-800 text-white': theme === 'dark' }">
        <div class="container mx-auto px-4">
            <div class="flex flex-row lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="flex">
                    <CategoriesSide />
                </div>

                <div class="flex-1 p-4 ">
                    <div class="bg-white shadow-md rounded-lg p-6"
                    :class="{ 'bg-white text-black': theme === 'light', 'bg-gray-800 text-white': theme === 'dark' }">
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

<script setup>
import CustomerProfile from './ProfileCard.vue'
import ProfileCard from './CustomerCard.vue'
import CategoriesSide from '../../../pages/products/categories/CategoriesSide.vue'
import ProductNav from '../../../pages/products/ProductNav.vue'


</script>