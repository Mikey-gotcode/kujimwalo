<template>
  <aside class="w-64 bg-gray-900 text-white min-h-auto shadow-lg px-4">
    <nav>
      <ul>
        <li v-for="item in menuItems.items" :key="item.label" class="py-3 ">
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
</template>

<script setup>
import { ref } from 'vue'

const menuItems = ref({
  items: [
    {
      label: "Dashboard",
      icon: "../../assets/icons/cancer-svgrepo-com.svg",
      link: "/admin"
    },
    {
      label: "Manage stock",
      icon: "../../assets/icons/inbox-arrow-down-svgrepo-com.svg",
      link: "/admin/adminstock",
      badge: {
        text: "3",
        class: "bg-blue-500 text-white"
      }
    },
    {
      label: "Manage orders ",
      icon: "../../assets/icons/inbox-arrow-down-svgrepo-com.svg",
      link: "/admin/manageorders"
    },
    {
      label: "Settings",
      icon: "../../assets/icons/bottle-of-martini-martini-alcohol-drink-svgrepo-com.svg",
      link: "/products"
    }
  ]
})
</script>

<style scoped>
aside {
  width: 16rem;
}
</style>
