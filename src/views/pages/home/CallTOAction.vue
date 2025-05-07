<template>
  <div class="relative w-full h-screen flex items-center justify-center text-white">
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(/vins_collection.jpg)` }"
    ></div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50 z-10"></div>

    <!-- Content -->
    <div class="relative z-20 text-center px-6 sm:px-10">
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold">
        VINS COLLECTION
      </h1>
      <div class="overflow-hidden w-full mt-2">
        <h1 ref="typedRef" class="text-xl sm:text-2xl md:text-3xl font-light text-white"></h1>
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

const typedRef = ref();

onMounted(() => {
  if (typedRef.value) {
    const typed_strings = ["A MUST HAVE!", "A MUST WANT!", "ORDER NOW!"];

    new Typed(typedRef.value, {
      strings: typed_strings,
      typeSpeed: 100,
      backSpeed: 20,
      smartBackspace: false,
      loop: true
    });
  }
});
</script>

<style scoped>
/* Ensures background covers the entire screen */
.bg-cover {
  background-size: cover;
  background-position: center;
}

/* Responsive spacing adjustments */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.75rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .text-5xl {
    font-size: 3rem;
  }
}
</style>
