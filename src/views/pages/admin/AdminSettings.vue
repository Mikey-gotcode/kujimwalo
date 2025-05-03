<template>
    <AdminLayout>
        <div class="border-b pb-4 mb-4"
            :class="{ 'border-gray-300': theme === 'light', 'border-gray-600': theme === 'dark' }">
            <h3 class="text-xl font-semibold">Settings</h3>
        </div>
        <SettingsSection />

    </AdminLayout>
</template>


<script setup>

import { inject } from 'vue';

import SettingsSection from './SettingsSection.vue';
import AdminLayout from './AdminLayout.vue';

const theme = inject("theme")


</script>