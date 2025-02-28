<template>
    <nav class="bg-white dark:bg-gray-800 antialiased">
      <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo Section -->
          <div class="flex items-center space-x-8">
            <div class="shrink-0">
              <a href="#" title="">
                <img
                  class="block w-auto h-8 dark:hidden"
                  :src="logo.srcLight"
                  alt="Logo"
                />
                <img
                  class="hidden w-auto h-8 dark:block"
                  :src="logo.srcDark"
                  alt="Logo"
                />
              </a>
            </div>
  
            <!-- Desktop Navigation Links -->
            <ul class="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
              <li v-for="(item, index) in navLinks" :key="index">
                <a href="#" class="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                  {{ item }}
                </a>
              </li>
            </ul>
  
            <!-- Mobile Navigation Dropdown Trigger -->
            <button
              v-if="!isLgScreen"
              @click="toggleDropdown"
              class="lg:hidden text-gray-900 dark:text-white"
            >
              <svg
                class="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
  
          <!-- Cart Button and Dropdown -->
          <div class="flex items-center lg:space-x-2">
            <button
              id="myCartDropdownButton1"
              data-dropdown-toggle="myCartDropdown1"
              type="button"
              class="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
            >
              <span class="sr-only">Cart</span>
              <svg
                class="w-5 h-5 lg:me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                />
              </svg>
              <span class="hidden sm:flex">My Cart</span>
              <svg
                class="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Mobile Dropdown Menu -->
        <div v-if="dropdownOpen && !isLgScreen" class="lg:hidden mt-4">
          <ul class="flex flex-col gap-4 px-4">
            <li v-for="(item, index) in navLinks" :key="index">
              <a
                href="#"
                class="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      navLinks: {
        type: Array,
        default: () => ['Home', 'Best Sellers', 'Gift Ideas', 'Today\'s Deals', 'Sell'],
      },
      logo: {
        type: Object,
        default: () => ({
          srcLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg',
          srcDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg',
        }),
      },
    },
    data() {
      return {
        dropdownOpen: false,
      };
    },
    computed: {
      isLgScreen() {
        return window.innerWidth >= 1024; // Tailwind's lg breakpoint is 1024px
      },
    },
    methods: {
      toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Additional styling if necessary */
  </style>
  