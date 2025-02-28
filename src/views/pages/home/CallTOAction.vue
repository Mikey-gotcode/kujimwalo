<template>
    <div class="relative w-full h-screen flex items-center justify-center text-white">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(src/assets/img/layouts/background.jpeg)` }"
      ></div>
  
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black opacity-50 z-10"></div>
  
      <!-- Content -->
      <div class="relative z-20 text-center">
        <h1 class="text-4xl sm:text-6xl font-bold">
            KUJIMWALO!
        </h1>
        <div class="overflow-hidden whitespace-nowrap w-full">
          <h1 ref="typedRef" class="text-3xl sm:text-4xl md:text-5xl font-light text-white w-full"></h1>
        </div>
        <router-link to="/signin">
          <button class="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg transition">
            Buy Now
          </button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import Typed from "typed.js";


  const typedRef = ref()
  
  

      
 
onMounted(() => {
  if (typedRef.value) {
    const typed_strings = "SMALL WORLD!, GOOD VIBES!, ORDER NOW!";

    new Typed(typedRef.value, {
      strings: typed_strings.split(", "),
      typeSpeed: 100,
      backSpeed: 20,
      smartBackspace: false,
      loop: true
    });
  }
});
     
    

  </script>
  