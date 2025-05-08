<script setup>
import { ref, onMounted, onUnmounted, defineProps, inject, computed, watch } from 'vue';
//import axios from 'axios';
import api from '../../../api';
//import KeyPad from '../../../components/KeyPad.vue';
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
let intervalId = null;
const showPaymentOptions = ref(null);
//const showCashModal = ref({});
const showMpesaModal = ref({});
const currentPage = ref(1);
const itemsPerPage = 5;
const selectedOrder  = ref(null);
const selectedMethod = ref(null);


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
    const response = await api.get(`/orders/${authStore.user.id}`, {
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
  //intervalId = setInterval(fetchOrders, 12000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const filteredOrders = computed(() => {
  return orders.value.filter(o => selectedStatus.value === 'All orders' || o.status === selectedStatus.value);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage));
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
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

const openMpesaKeyPad = (id, method) => {
  showMpesaModal.value = { [id]: !showMpesaModal.value[id] };
  selectedOrder.value = id;
  selectedMethod.value = method;
};

const cancelOrder = async (id) => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    await api.post(`/orders/${id}/cancel`, null, {
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
      withCredentials: true,
    });
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert('Failed to cancel order');
  }
};

// Reset page when filteredOrders or selectedStatus change
watch([filteredOrders, selectedStatus], () => {
  currentPage.value = 1;
});
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
            <div className="flex items-center justify-center min-h-[35px] bg-gray-50">
                            <p className="text-center text-lg text-gray-700">
                              if you insist on making cash payments, please contact the supplier in order to dispatch your order
                            </p>
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

            <div v-if="loading" class="flex justify-center items-center">
                <span class="text-4xl font-medium text-gray-500">Loading...</span>
            </div>
            <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

            <div v-else>
                <div v-if="paginatedOrders.length" class="space-y-6">
                    <div v-for="order in paginatedOrders" :key="order.id"
                        class="border rounded-lg p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div class="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
                            <p class="text-xs md:text-sm font-semibold">Order ID: #{{ order.id }}</p>
                            <p>Total Price: Ksh.{{ order.total_price }}</p>
                            <p>Status: <span class="font-medium">{{ order.status }}</span></p>
                            <p>Created At: {{ formatDate(order.created_at) }}</p>
                        </div>
                        <div class="mt-2 w-full">
                            <p class="text-lg font-bold">Items:</p>
                            <ul class="list-disc pl-5 font-bold text-lg">
                                <li v-for="item in order.items" :key="item.product_id">
                                    {{ item.product_name }} [{{ item.quantity }}]
                                </li>
                            </ul>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2 justify-center md:justify-end w-full">
                            <template v-if="order.status === 'pending'">
                                <button @click="cancelOrder(order.id)"
                                    class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                                    Cancel
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
                            <button @click="openMpesaKeyPad(order.id,'mpesa')" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                              MPESA Payment
                            </button>
                          </div>
                         

                          <PreviewMpesa v-if="showMpesaModal[order.id]" :isOpen="showMpesaModal[order.id]" :orderID="order.id"
                            :billAmount="Number(order.total_price)" :orderNo="order.customer.phone" :paymentMethod="selectedMethod"
                            title="PreviewMpesa" @close="showMpesaModal[order.id]=false" @paymentSuccess="fetchOrders" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
