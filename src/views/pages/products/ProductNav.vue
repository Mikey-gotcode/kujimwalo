<script setup>
import { ref, onMounted } from 'vue'
import navigationData from '../../../assets/json/navigation.json'

const navigation = ref(null)

onMounted(() => {
  navigation.value = navigationData
})
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 antialiased">
    <div class="max-w-screen-xl px-4 mx-auto py-4">
      <div class="flex items-center justify-between">
        <!-- Brand -->
        <div class="flex items-center space-x-8">
          <div class="shrink-0 inline">
            <router-link :to="navigation?.brand.link" class="text-none text-lg">
              {{ navigation?.brand.name }}
              <img class="block w-auto h-8 dark:hidden" :src="navigation?.brand.logo.light" alt="Logo">
              <img class="hidden w-auto h-8 dark:block" :src="navigation?.brand.logo.dark" alt="Logo">
            </router-link>
          </div>

          <!-- Navigation Menu -->
          <ul class="hidden lg:flex items-center gap-6 md:gap-8 py-3">
            <li v-for="item in navigation?.menuItems" :key="item.name">
              <router-link :to="item.link" class="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Cart -->
        <div class="flex items-center lg:space-x-2">
          <button id="cartDropdown" data-dropdown-toggle="cartMenu" type="button" class="inline-flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
            <span class="sr-only">Cart</span>
            <img class="w-5 h-5" :src="navigation?.cart.icon" alt="Cart">
            <span class="hidden sm:flex">{{ navigation?.cart.label }}</span>
          </button>

          <div id="cartMenu" class="hidden z-10 max-w-sm space-y-4 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <div v-for="item in navigation?.cart.items" :key="item.name" class="grid grid-cols-2">
              <div>
                <p class="truncate text-sm font-semibold text-gray-900 dark:text-white hover:underline">{{ item.name }}</p>
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">{{ item.price }}</p>
              </div>
              <div class="flex items-center justify-end gap-6">
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
