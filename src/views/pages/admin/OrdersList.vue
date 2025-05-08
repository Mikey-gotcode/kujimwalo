<template>
  <section
    :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }"
    class="py-8 md:py-16"
  >
    <div class="max-w-screen-xl mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-2xl font-semibold">
          My Orders
        </h2>

        <div class="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <select v-model="selectedDateFilter" class="border p-2 rounded-md w-full md:w-auto">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="six_months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>

          <input
            v-model="searchCustomerId"
            type="text"
            placeholder="Search by Customer ID"
            class="border p-2 rounded-md w-full md:w-auto"
          />

          <button @click="searchOrder" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform">
            Search
          </button>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50 hover:scale-105 transition-transform"
          >
            Prev
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50 hover:scale-105 transition-transform"
          >
            Next
          </button>
        </div>
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
         <!-- New Orders Button -->
         <div v-if="newOrdersAvailable" class="flex justify-center mb-4">
          <button @click="updateOrders" class="bg-green-500 text-white px-6 py-2 rounded-md hover:scale-105 transition-transform">
            New Orders Available (Click to Refresh)
          </button>
        </div>
        <div v-if="filteredOrders.length" class=" gap-6 sm:grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
          <div
            v-for="order in paginatedOrders"
            :key="order.id"
            :class="theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-700'"
            class="w-full border rounded-lg p-6 shadow-md flex flex-col lg:flex-row gap-4 hover:scale-105 transition-transform"
          >
           <div class="flex flex-row gap-2 px-4 align-middle">
            <p :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-lg font-semibold py-5 pr-1">
              #{{ order.id }}
            </p>
            <p :class="theme === 'light' ? 'text-black' : 'text-gray-300'">Total: Ksh.{{ order.total_price }}</p>
            <p class="text-yellow-600 font-medium pr-1">Name: {{ order.customer.name }}</p>
            <p class="text-sm text-gray-500 pt-6 pr-1">{{ formatDate(order.created_at) }}</p>

            <div class="mt-2">
              <p class="text-lg font-bold">Items:</p>
              <ul class="list-disc pl-5 text-sm">
                <li v-for="item in order.items" :key="item.product_id">
                  {{ item.product_name }} x[{{ item.quantity }}]
                </li>
              </ul>
            </div>
           </div>
            <div class="mt-4 flex flex-wrap gap-2 justify-center md:justify-end w-full">
              <template v-if="order.status === 'pending' || order.status === 'unpaid'">
                <button @click="cancelOrder(order.id)" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button v-if="order.status === 'pending'" @click="stashOrder(order.id)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                  Stash
                </button>
                <button @click="togglePaymentOptions(order.id)"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  Process Payment
                </button>
              </template>
            </div>
          
            <div v-if="showPaymentOptions === order.id"
              class="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 w-full">
              <p class="text-gray-700 dark:text-gray-300 font-medium text-center">Choose Payment Method:</p>
              <div class="mt-2 flex flex-wrap gap-2 justify-center">
                <button @click="togglePaymentOptions(null)" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button @click="openKeypad(order.id,'cash')" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Cash Payment
                </button>
                <button @click="openMpesaKeyPad(order.id,'mpesa')" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  MPESA Payment
                </button>
              </div>
              <KeyPad v-if="showCashModal[order.id]" :isOpen="showCashModal[order.id]"
                :billAmount="Number(order.total_price)" :orderID="selectedOrder" :paymentMethod="selectedMethod"
                title="Keypad" @close="showCashModal[order.id] = false" @paymentSuccess="fetchOrders" />
              
              <PreviewMpesa v-else-if="showMpesaModal[order.id]" :isOpen="showMpesaModal[order.id]" :orderID="order.id"
                :billAmount="Number(order.total_price)" :orderNo="order.customer.phone" :paymentMethod="selectedMethod"
                title="PreviewMpesa" @close="showMpesaModal[order.id]=false" @paymentSuccess="fetchOrders" />
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center">No orders found.</p>

    
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, inject, computed, watch } from 'vue';
import axios from 'axios';
import api from '../../../api';
import KeyPad from '../../../components/KeyPad.vue';
import PreviewMpesa from '../../../components/PreviewMpesa.vue';
import { useAuthStore } from '../../../store/auth';
import { useRouter } from 'vue-router';

const theme = inject('theme', ref('light'));
const props = defineProps({
  isOpen: Boolean,
  activeTab: String,
  required: true,
});

const authStore = useAuthStore();
const router = useRouter();

const orders = ref([]);
const latestOrders = ref([]);
const newOrdersAvailable = ref(false);
const lastFetchedOrderId = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedDateFilter = ref('all');
const searchCustomerId = ref('');
let intervalId = null;
const showPaymentOptions = ref(null);
const selectedOrder = ref(null);
const selectedMethod = ref('');
const showCashModal = ref({});
const showMpesaModal = ref({});
const currentPage = ref(1);
const itemsPerPage = 5;

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

/**
 * Fetches the full orders list once on mount.
 */
 const fetchOrders = async () => {
  try {
    loading.value = true;
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }

    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    latestOrders.value = response.data;
    orders.value = props.activeTab
      ? latestOrders.value.filter((p) => p.status === props.activeTab)
      : [...latestOrders.value];

    if (latestOrders.value.length > 0) {
      lastFetchedOrderId.value = latestOrders.value[0].id;
    }
  } catch (err) {
    handleFetchError(err);
  } finally {
    loading.value = false;
  }
};

/**
 * Checks for new orders but does NOT modify the order list.
 */
const refreshOrders = async () => {
  try {
    const authToken = authStore.token;
    if (!authToken) return;

    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    const fetchedOrders = response.data;
    if (fetchedOrders.length > 0) {
      const latestFetchedId = fetchedOrders[0].id;
      const latestFetchedStatus = fetchedOrders[0].status;

      if (latestFetchedId > (lastFetchedOrderId.value || 0) && latestFetchedStatus === props.activeTab) {
        newOrdersAvailable.value = true;
      }
    }
  } catch (err) {
    handleFetchError(err);
  }
};

/**
 * Updates the orders list when the user confirms.
 */
const updateOrders = async () => {
  if (!newOrdersAvailable.value) return;

  await fetchOrders(); // Refresh data
  newOrdersAvailable.value = false; // Hide "Refresh Orders" button
};

/**
 * Handles API errors.
 */
const handleFetchError = (err) => {
  console.error("Fetch orders error:", err.response?.data || err.message);
  error.value = err.response?.status === 401
    ? "Session expired. Please log in again."
    : "Failed to fetch orders";

  if (err.response?.status === 401) router.push('/signin');
};

/**
 * Fetch orders once on mount & set an interval to check for new orders.
 */
onMounted(() => {
  fetchOrders();
  intervalId = setInterval(refreshOrders, 7000); // Check for new orders every 30 seconds
});

/**
 * Clear interval when component is unmounted.
 */
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null; // Reset it
  }
});

const cancelOrder = async (id) => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    await api.post(`/orders/${id}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      withCredentials: true,
    });
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to cancel order');
  }
};

const stashOrder = async (id) => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    await axios.post(`/orders/${id}/stash`, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      withCredentials: true,
    });
    alert('Order moved to unpaid tabs');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to stash order');
  }
};

const openKeypad = (id, method) => {
  showCashModal.value = { [id]: !showCashModal.value[id] };
  selectedOrder.value = id;
  selectedMethod.value = method;
};

const openMpesaKeyPad = (id, method) => {
  showMpesaModal.value = { [id]: !showMpesaModal.value[id] };
  selectedOrder.value = id;
  selectedMethod.value = method;
};

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    return (selectedDateFilter.value === 'all' || order.created_at.includes(selectedDateFilter.value));
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage) || 1;
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const togglePaymentOptions = (id) => {
  showPaymentOptions.value = showPaymentOptions.value === id ? null : id;
};

watch(filteredOrders, () => {
  currentPage.value = 1;
});
</script>

