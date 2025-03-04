<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- About Us Section -->
      <div class="flex flex-col items-center lg:items-start lg:flex-row border-r lg:border-r border-gray-300 px-4">
        <div class="relative w-full lg:w-1/3 flex justify-center lg:justify-start">
          <img 
            src="../../../assets/img/layouts/aboutus.jpeg" 
            alt="About Us" 
            class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-full shadow-lg"
          />
        </div>
        <div class="w-full lg:w-2/3 mt-6 lg:mt-0 lg:ml-6 text-center lg:text-left">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p class="text-lg text-gray-600 leading-relaxed">
            Come ujinice kujinyce. Saka kaa fom, bonga na mdenge na usituachie deni.
          </p>
        </div>
      </div>

      <!-- Services Section -->
      <div class="px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Our Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="(service, index) in services" :key="index"
            class="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <h3 class="text-xl font-bold text-gray-700">{{ service.title }}</h3>
            <p class="text-base text-gray-500 mt-2">{{ service.description }}</p>
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

<style scoped>
/* Hover effect for service cards */
.transition-transform:hover {
  transition: transform 0.3s ease-in-out;
}
img:hover {
  transform: scale(1.05);
}
img:hover {
  transform: scale(1.05);
}
</style>
