<template>
    <AdminLayout>
        <div class="border-b pb-4 mb-4">
            <h3 class="text-xl font-semibold">PRINT OR SCAN QR CODE</h3>
        </div>
        <div :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }"
            class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <!-- Input for URL -->
            <input v-model="url" type="text" placeholder="Enter URL"
                class="p-2 mb-4 border border-gray-300 rounded-lg shadow-sm w-72"
                :class="theme === 'dark' ? 'text-gray-400' : ' border-gray-300 text-gray-300'" />

            <!-- Color Pickers -->
            <div class="flex gap-4 mb-4">
                <div>
                    <label class="text-sm"
                        :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">Foreground</label>
                    <input type="color" v-model="fgColor" class="w-12 h-8 ml-2 border" />
                </div>
                <div>
                    <label class="text-sm"
                        :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">Background</label>
                    <input type="color" v-model="bgColor" class="w-12 h-8 ml-2 border" />
                </div>
            </div>

            <!-- QR Code Component -->
            <Qrcode :link="url" :size="500" :foregroundColor="fgColor" :backgroundColor="bgColor" :logo="companyLogo"
                :logoSize="90" />
        </div>
    </AdminLayout>
</template>


<script setup>
import { ref, inject } from 'vue';
import Qrcode from './QRTemplate.vue';
import api from '../../../api';
import AdminLayout from './AdminLayout.vue';

// Inject theme
const theme = inject('theme');

// Reactive variables
const url = ref(`${api.qrURL}/customer/categories-dashboard`);
const fgColor = ref("#000000");
const bgColor = ref("#ffffff");
const companyLogo = ref("kujimwalo.svg"); // Path to your logo

</script>
