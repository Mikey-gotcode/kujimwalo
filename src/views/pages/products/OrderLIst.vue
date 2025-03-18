<script setup>
import { ref, onMounted, onUnmounted, defineProps, inject } from 'vue';
import axios from 'axios';
import api from '../../../api';
import { useAuthStore } from '../../../store/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  isOpen: Boolean,
  activeTab: String,
  required: true,
});

const authStore = useAuthStore();
const router = useRouter();

const orders = ref([]);
const selectedStatus = ref('All orders');
const loading = ref(true);
const error = ref(null);
let intervalId = null;

// Inject theme from the provider
const theme = inject('theme', ref('light')); // Default to light if not provided

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Simple date format
};

const fetchOrders = async () => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get(`${api.baseURL}/orders/${authStore.user.id}`, {
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
      withCredentials: true,
    });
    const allOrders = response.data;
    orders.value = props.activeTab ? allOrders.filter(p => p.status === props.activeTab) : allOrders;
  } catch (err) {
    error.value = 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
  intervalId = setInterval(fetchOrders, 12000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const filteredOrders = () => {
  return orders.value.filter(o => selectedStatus.value === 'All orders' || o.status === selectedStatus.value);
};

const cancelOrder = async (id) => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    await axios.post(`${api.baseURL}/orders/${id}/cancel`, {
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
      withCredentials: true,
    });
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert('Failed to cancel order');
  }
};
</script>

<template>
    <section class="py-8 md:py-16"
            :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }">
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="flex justify-between items-center mb-6">
                <h2 :class="theme === 'light' ? 'text-black' : 'text-white'"
                    class="text-2xl font-semibold">
                    My Orders
                </h2>
                <select v-model="selectedStatus" class="border border-gray-300 dark:border-gray-700 p-2 rounded-md">
                    <option>All orders</option>
                    <option value="pending">Pending</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div v-if="loading" class="flex justify-center items-center">
                <div aria-label="Loading..." role="status" class="flex items-center space-x-2">
                  <svg class="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                      <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                      <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                  </svg>
                  <span class="text-4xl font-medium text-gray-500">Loading...</span>
                </div>
              </div>
              <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

            <div v-else>
                <div v-if="filteredOrders().length" class="space-y-6">
                    <div v-for="order in filteredOrders()" :key="order.id"
                    :class="theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-700'"
                    class="border rounded-lg p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div class="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
                            <p :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-lg font-semibold">
                                Order ID: #{{ order.id }}
                            </p>
                            <p :class="theme === 'light' ? 'text-black' : 'text-gray-300'">
                                Total Price: ${{ order.total_price }}
                            </p>
                            <p :class="theme === 'light' ? 'text-yellow-600' : 'text-gray-300'">
                                Status: <span class="font-medium">{{ order.status }}</span>
                            </p>
                            <p :class="theme === 'light' ? 'text-black' : 'text-gray-300'">
                                Created At: {{ formatDate(order.created_at) }}
                            </p>
                        </div>

                        <div class="mt-2 w-full">
                            <p :class="theme === 'light' ? 'text-black' : 'text-white'"
                                class="text-lg font-bold">Items:</p>
                            <ul class="list-disc pl-5 font-bold text-lg"
                                :class="theme === 'light' ? 'text-black' : 'text-white'">
                                <li v-for="item in order.items" :key="item.product_id">
                                    {{ item.product_name }} [{{ item.quantity }}]
                                </li>
                            </ul>
                        </div>

                        <div class="mt-4 flex flex-wrap gap-2 justify-center md:justify-end w-full">
                            <template v-if="order.status === 'pending'">
                                <button @click="cancelOrder(order.id)"
                                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                                    Cancel
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <p v-else class="text-gray-500 text-center">No orders found.</p>
            </div>
        </div>
    </section>
</template>
<!-- <p v-else class="text-gray-500 text-center">No orders found.</p> -->