<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="flex flex-col items-center lg:items-start lg:flex-row border-r lg:border-r border-gray-300 px-4">
        <div class="relative w-full lg:w-1/3 flex justify-center lg:justify-start">
          <img
            src="../../../assets/img/layouts/aboutus.jpg"
            alt="About Us"
            class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-full shadow-lg"
          />
        </div>
        <div class="w-full lg:w-2/3 mt-6 lg:mt-0 lg:ml-6 text-center lg:text-left">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p class="text-lg text-gray-600 leading-relaxed">
            At Vins Collection, we believe that great products shouldn’t come with a high price tag. That’s why we offer a wide selection of quality items at affordable prices, making it easy for you to get more value for your money. Whether you’re shopping for everyday essentials or unique finds, we’re here to help you save without compromising on quality.
          </p>
        </div>
      </div>

      <div class="px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Our Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-1 gap-6">
          <div
            v-for="(service, index) in services"
            :key="service.uniqueKey"
            ref="serviceCards"
            class="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <h3 class="text-xl font-bold text-gray-700 mb-2">{{ service.title }}</h3>
            <AutoCounter
              v-if="dataLoaded"
              :start-amount="0"
              :end-amount="counterTargets[index]"
              :duration="1500"
              :key="counterKeys[index]"
              class="text-4xl font-extrabold text-gray-800"
            />
            <div v-else class="text-4xl font-extrabold text-gray-800">0</div>
            <p class="text-base text-gray-500 mt-2">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from 'axios';
import api from '../../../api';
import AutoCounter from 'vue3-autocounter';

const receivedOrdersCount = ref(0);
const completedOrdersCount = ref(0);
const happyClientsCount = ref(0);
const dataLoaded = ref(false);
const serviceCards = ref([]);
const counterTargets = ref([0, 0, 0]);
const counterKeys = ref(['initial1', 'initial2', 'initial3']); // Force re-render on AOS in

const services = ref([
  { title: "Received Orders", count: receivedOrdersCount, description: "Total number of received orders.", uniqueKey: 'received' },
  { title: "Completed Orders", count: completedOrdersCount, description: "Total number of orders completed.", uniqueKey: 'completed' },
  { title: "Happy Clients", count: happyClientsCount, description: "Number of satisfied clients.", uniqueKey: 'happy' },
]);

const fetchCounterData = async () => {
  try {
    const { data } = await axios.get(`${api.baseURL}/order-counts`);
    console.log("API Response Data:", data);

    receivedOrdersCount.value = data.received_orders;
    completedOrdersCount.value = data.completed_orders;
    happyClientsCount.value = data.happy_clients;
    counterTargets.value = [data.received_orders, data.completed_orders, data.happy_clients];
    dataLoaded.value = true;
  } catch (error) {
    console.error("Error fetching counter data:", error);
  }
};

onMounted(() => {
  AOS.init();
  fetchCounterData();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = serviceCards.value.indexOf(entry.target);
        if (index !== -1) {
          // Trigger counter re-render by changing key
          counterKeys.value = counterKeys.value.map((key, i) => (i === index ? Math.random() : key));
          observer.unobserve(entry.target); // Stop observing once triggered
        }
      }
    });
  }, { threshold: 0.6 }); // Adjust threshold as needed

  serviceCards.value.forEach(card => {
    observer.observe(card);
  });
});
</script>

<style scoped>
/* Hover effect for service cards */
.transition-transform:hover {
  transition: transform 0.3s ease-in-out;
}
img:hover {
  transform: scale(1.05);
}
</style>