<template>
  <section :class="{ 'bg-white text-gray-900': theme === 'light', 'bg-gray-700 text-gray-200': theme === 'dark' }"
            class="py-8 md:py-16">
    <div class="max-w-screen-xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 :class="theme === 'light' ? 'text-black' : 'text-white'"
            class="text-2xl font-semibold ">My Orders</h2>


        <div class="flex gap-4">
          <select v-model="selectedDateFilter" class="border p-2 rounded-md">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="six_months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
          
          <input v-model="searchCustomerId" type="text" placeholder="Search by Customer ID" class="border p-2 rounded-md" />
          <button @click="searchOrder" class="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
        </div>
      </div>


      <div v-if="loading" class="text-gray-500 text-center">Loading orders...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

      <div v-else>
        <div v-if="filteredOrders().length && filteredDates().length" class="space-y-6">
          <div v-for="order in filteredOrders()" :key="order.id"
             :class="theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-700'"
            class="border rounded-lg p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div class="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
              <p :class="theme === 'light' ? 'text-black' : 'text-white'"  class="text-lg font-semibold">Order:#{{ order.id }}</p>
              <p :class="theme === 'light' ? 'text-black' : 'text-gray-300'">Total Price: ${{ order.total_price }}</p>
              <p :class="theme === 'light' ? 'text-yellow-600' : 'text-gray-300'">Name: <span class="font-medium">{{ order.customer.name }}</span></p>
              <p :class="theme === 'light' ? 'text-black' : 'text-gray-300'">Created At: {{ formatDate(order.created_at) }}</p>
            </div>
            
            <div class="mt-2 w-full">
              <p :class="theme === 'light' ? 'text-black' : 'text-white'"
                  class="text-lg font-bold">Items:</p>
              <ul class="list-disc pl-5 font-bold text-lg"
                  :class="theme === 'light' ? 'text-black' : 'text-white'">
                <li v-for="item in order.items" :key="item.product_id">{{ item.product_name }} [{{ item.quantity }}]</li>
              </ul>
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
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import axios from 'axios';
import api from '../../../api'
import KeyPad from '../../../components/KeyPad.vue';
import PreviewMpesa from '../../../components/PreviewMpesa.vue';
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
const selectedDateFilter = ref('all');
const searchCustomerId = ref('');
let intervalId = null;
const showPaymentOptions = ref(null);
const selectedOrder = ref(null);
const selectedMethod = ref('');
const showCashModal = ref({});
const showMpesaModal = ref({});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
const filteredDates = (() => {
  const now = new Date();
  return orders.value.filter(order => {
    const orderDate = new Date(order.created_at);
    if (selectedDateFilter.value === 'today') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (selectedDateFilter.value === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return orderDate >= oneWeekAgo;
    }
    if (selectedDateFilter.value === 'month') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    if (selectedDateFilter.value === 'six_months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return orderDate >= sixMonthsAgo;
    }
    if (selectedDateFilter.value === 'year') {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
});

const fetchOrders = async () => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }

    const response = await axios.get(`${api.baseURL}/orders`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    const allOrders = response.data;
    //console.log(allOrders)
    orders.value = props.activeTab ? allOrders.filter((p) => p.status === props.activeTab) : allOrders;
  } catch (err) {
    console.error("Fetch orders error:", err.response?.data || err.message);
    error.value = err.response?.status === 401 ? "Session expired. Please log in again." : "Failed to fetch orders";
    if (err.response?.status === 401) router.push('/signin');
  } finally {
    loading.value = false;
  }
};

const cancelOrder = async (id) => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    await axios.post(`${api.baseURL}/orders/${id}/cancel`, {}, {
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
    await axios.post(`${api.baseURL}/orders/${id}/stash`, {}, {
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

onMounted(() => {
  fetchOrders();
  intervalId = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const filteredOrders = () => {
  return orders.value.filter(o => selectedStatus.value === 'All orders' || o.status === selectedStatus.value);
};

const togglePaymentOptions = (id) => {
  showPaymentOptions.value = showPaymentOptions.value === id ? null : id;
};
</script>
