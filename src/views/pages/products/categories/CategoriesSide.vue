<template>
    <aside class="w-64 bg-gray-800 text-white min-h-screen">
      <nav>
        <ul>
          <li v-for="item in menuItems.items" :key="item.label" class="p-2 hover:bg-gray-700">
            <router-link :to="item.link" class="flex items-center">
              <img :src="item.icon" class="w-6 h-6 mr-2" alt="icon" />
              {{ item.label }}
              <span v-if="item.badge" :class="['ml-auto text-xs px-2 py-1 rounded', item.badge.class]">
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
        icon: "/assets/icons/beer-bar-bar-brewery-drink-beer-svgrepo-com.svg",
        link: "/dashboard"
      },
      {
        label: "Inbox",
        icon: "/assets/icons/inbox-arrow-down-svgrepo-com.svg",
        link: "/inbox",
        badge: {
          text: "3",
          class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        }
      },
      {
        label: "Users",
        icon: "/assets/icons/users-2-svgrepo-com.svg",
        link: "/users"
      },
      {
        label: "Products",
        icon: "/assets/icons/bottle-of-martini-martini-alcohol-drink-svgrepo-com.svg",
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
  