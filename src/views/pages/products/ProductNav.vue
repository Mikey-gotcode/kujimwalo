<script setup>
import { ref, onMounted } from 'vue'
import navigationData from '../../../assets/json/navigation.json'

const navigation = ref(null)
const isMenuOpen = ref(false)

onMounted(() => {
  navigation.value = navigationData
})
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 antialiased">
    <div class="max-w-screen-xl px-4 mx-auto py-4">
      <div class="flex items-center justify-between">
        <!-- Brand -->
        <div class="flex items-center w-full lg:w-auto justify-between">
          <router-link v-if="navigation?.brand?.link" :to="navigation.brand.link" class="flex items-center text-lg">
            <img class="block w-auto h-8 dark:hidden" :src="navigation?.brand.logo.light" alt="Logo">
            <img class="hidden w-auto h-8 dark:block" :src="navigation?.brand.logo.dark" alt="Logo">
            <span class="ml-2 text-gray-900 dark:text-white font-semibold">{{ navigation?.brand.name }}</span>
          </router-link>
          
          <!-- Mobile Menu Button -->
          <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 text-gray-700 dark:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <!-- Desktop Navigation -->
        <ul class="hidden lg:flex items-center gap-6 py-3">
          <li v-for="item in navigation?.menuItems" :key="item.name">
            <router-link :to="item.link" class="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMenuOpen" class="lg:hidden absolute w-full bg-white dark:bg-gray-800 shadow-md py-2">
      <ul class="flex flex-col items-center space-y-2">
        <li v-for="item in navigation?.menuItems" :key="item.name">
          <router-link @click="isMenuOpen = false" :to="item.link" class="block px-4 py-2 text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
