<template>
    <!-- <HeaderNav class="bg-white dark:bg-gray-800 antialiased sticky top-0 z-10"/> -->
    <div class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- About Us Section -->
        <div class="grid grid-row py-4 items-center border-r border-grey-300">
            <h2 class="text-3xl font-bold text-gray-800 text-center">About Us</h2>
          
          <div class="flex gap-6">
            <img 
            src="../../../assets/img/layouts/aboutus.jpeg" 
            alt="About Us" 
            class="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full shadow-lgfloat-left"
          />
            <p class="mt-4 text-gray-600 text-left">
              Come ujinice kujinyce. Saka kaa fom, bonga na mdenge na usituachie deni 
            </p>
          </div>
        </div>
  
        <!-- Services Section -->
        <div class ="px-4">
          <h2 class="text-3xl font-bold text-gray-800 text-center">Our Services</h2>
          <div class="grid gap-6">
            <div v-for="(service, index) in services" :key="index"
              class="bg-white p-6 rounded-lg shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              <h3 class="text-xl font-semibold text-gray-700">{{ service.title }}</h3>
              <p class="text-gray-500 mt-2">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from "vue";
  import AOS from "aos";
  import "aos/dist/aos.css";
  //import HeaderNav from './HeaderHome.vue'
  
  export default {
    setup() {
      onMounted(() => {
        AOS.init();
      });
  
      const services = [
        { title: "Web Development", description: "Building modern and responsive websites." },
        { title: "App Development", description: "Creating mobile apps for Android and iOS." },
        { title: "SEO Optimization", description: "Enhancing your website's visibility online." },
        { title: "Cloud Solutions", description: "Providing scalable cloud infrastructure." },
        { title: "Cybersecurity", description: "Ensuring digital security and data protection." },
        { title: "E-Commerce", description: "Building online stores for your business." }
      ];
  
      return { services };
    }
  };
  </script>
  
  <style>
  /* Add additional styling if needed */
  </style>
  