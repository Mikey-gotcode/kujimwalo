<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const menuItems = ref({
  items: [
    {
      label: "Dashboard",
      icon: "../../assets/icons/profile-user-svgrepo-com.svg",
      link: "/admin"
    },
    {
      label: "Manage stock",
      icon: "../../assets/icons/wine-svgrepo-com(1).svg",
      link: "/admin/stock",
      badge: {
        text: "3",
        class: "bg-blue-500 text-white"
      }
    },
    {
      label: "Manage orders ",
      icon: "../../assets/icons/inbox-svgrepo-com.svg",
      link: "/admin/orders"
    },
    {
      label: "Settings",
      icon: "../../assets/icons/settings-tools-and-utensils-svgrepo-com.svg",
      link: "/admin/settings"
    },
    {
      label: "QR CODE",
      icon: "../../assets/icons/qr-code-svgrepo-com.svg",
      link: "/admin/qrcode"
    }
  ]
})
</script>

<template>
  <aside class="w-64 bg-gray-900 text-white min-h-auto shadow-lg px-4 lg:block" :class="{ 'hidden': !isMenuOpen, 'block': isMenuOpen ,}">
    <nav>
      <ul>
        <li v-for="item in menuItems.items" :key="item.label" class="py-3">
          <router-link
            :to="item.link"
            class="flex items-center gap-3 p-3 text-lg font-medium transition duration-200 ease-in-out hover:bg-gray-700 rounded-md"
          >
            <img :src="item.icon" class="w-6 h-6" alt="icon" />
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              :class="[
                'ml-auto text-xs font-semibold px-2 py-1 rounded-full',
                item.badge.class
              ]"
            >
              {{ item.badge.text }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Mobile Menu Toggle Button -->
  <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 text-white bg-gray-800 rounded-md">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
  </button>
</template>

<style scoped>
aside {
  width: 16rem;
}
</style>
