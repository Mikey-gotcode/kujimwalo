<template>
    <section class="bg-white dark:bg-gray-900 py-8 md:py-16">
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">My Orders</h2>
                <select v-model="selectedStatus" class="border border-gray-300 dark:border-gray-700 p-2 rounded-md">
                    <option>All orders</option>
                    <option value="pending">Pending</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div v-if="loading" class="text-gray-500 text-center">Loading orders...</div>
            <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

            <div v-else>
                <div v-if="filteredOrders().length" class="space-y-6">
                    <div v-for="order in filteredOrders()" :key="order.id"
                        class="border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div class="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
                            <p class="text-lg font-semibold">Order ID: #{{ order.id }}</p>
                            <p class="text-gray-600 dark:text-gray-300">Total Price: ${{ order.total_price }}</p>
                            <p class="text-yellow-600 dark:text-gray-300">Status: <span
                                    class="font-medium">{{ order.status }}</span></p>
                            <p class="text-gray-600 dark:text-gray-300">Created At: {{ formatDate(order.created_at) }}
                            </p>
                        </div>

                        <div class="mt-2 w-full">
                            <p class="text-lg font-bold text-white">Items:</p>
                            <ul class="list-disc pl-5 text-white font-bold text-lg">
                                <li v-for="item in order.items" :key="item.product.id">{{ item.product.name }}
                                    [{{ item.quantity }}]</li>
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



<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import axios from 'axios';
import api from '../../../api'
import { useAuthStore } from '../../../store/auth';
import {useRouter} from 'vue-router'

const props = defineProps({
  isOpen:Boolean,
  activeTab: String,
  required: true,
});

const authStore = useAuthStore()
const router = useRouter()

const orders = ref([]);
const selectedStatus = ref('All orders');
const loading = ref(true);
const error = ref(null);
let intervalId = null;
//const selectedBill = ref(0);

// Function to format the date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  return `${day}/${month}/${year}`;
};

// Fetch orders from API
const fetchOrders = async () => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get(`${api.baseURL}/orders/${authStore.user.id}`,{
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
    const allOrders = response.data;
    console.log("order data:",allOrders)
    orders.value  = props.activeTab ? allOrders.filter((p)=>p.status === props.activeTab) : allOrders
  } catch (err) {
    error.value = 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};




onMounted(() => {
  fetchOrders(); // Fetch initially
  intervalId = setInterval(fetchOrders, 12000); // Fetch every  2minutes
});

onUnmounted(() => {
  clearInterval(intervalId); // Clear interval when component unmounts
});


// Filter orders dynamically
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
    await axios.post(`${api.baseURL}/orders/${id}/cancel`,{
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert('Failed to cancel order');
  }
};


</script>