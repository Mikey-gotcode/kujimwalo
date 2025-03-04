<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import axios from 'axios';
import api from '../../../api'
import KeyPad from '../../../components/KeyPad.vue';
import PreviewMpesa from '../../../components/PreviewMpesa.vue';
import { useAuthStore } from '../../../store/auth';

const props = defineProps({
  isOpen:Boolean,
  activeTab: String,
  required: true,
});

const authStore = useAuthStore()

const orders = ref([]);
const selectedStatus = ref('All orders');
const loading = ref(true);
const error = ref(null);
let intervalId = null;
const showPaymentOptions = ref(null); // Track which order is processing payment
const selectedOrder = ref(null);
const selectedMethod = ref('');
const selectedBill = ref(0);

// Fetch orders from API
const fetchOrders = async () => {
  try {
    const response = await axios.get(`${api.baseURL}/orders`);
    const allOrders = response.data;
    console.log("order data:",allOrders)
    orders.value  = props.activeTab ? allOrders.filter((p)=>p.status === props.activeTab) : allOrders
  } catch (err) {
    error.value = 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};

const showCashModal = ref({});
const showMpesaModal = ref({});

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
  fetchOrders(); // Fetch initially
  intervalId = setInterval(fetchOrders, 5000); // Fetch every 3 seconds
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
    await axios.post(`${api.baseURL}/orders/${id}/cancel`);
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert('Failed to cancel order');
  }
};

const stashOrder = async (id) => {
  try {
    await axios.post(`${api.baseURL}/orders/${id}/stash`);
    alert('Order moved to unpaid tabs');
  } catch (err) {
    alert('Failed to stash order');
  }
};

const togglePaymentOptions = (id) => {
  showPaymentOptions.value = showPaymentOptions.value === id ? null : id;
};
</script>

<template>
  <section class="bg-white dark:bg-gray-900 py-8 md:py-16">
    <div  class="max-w-screen-xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">My Orders</h2>
        <select v-model="selectedStatus" class="border border-gray-300 dark:border-gray-700 p-2 rounded-md">
          <option>All orders</option>
          <option value="pre-order">Pre-order</option>
          <option value="transit">In transit</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div v-if="loading" class="text-gray-500">Loading orders...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <div v-else>
        <div v-if="filteredOrders().length" class="space-y-4">
          <div 
            v-for="order in filteredOrders()" 
            :key="order.id" 
            class="flex gap-3 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md bg-gray-50 dark:bg-gray-800"
          >
            <p class="text-lg font-semibold">Order ID: #{{ order.id }}</p>
            <!-- <p class="text-gray-600 dark:text-gray-300">Date: {{ order.date }}</p> -->
            <p class="text-gray-600 dark:text-gray-300">Total Price: ${{ order.total_price }}</p>
            <p class="text-yellow-600 dark:text-gray-300">Status: <span class="font-medium">{{ order.status }}</span></p>
            <p class="text-gray-600 dark:text-gray-300">Created At: {{ order.created_at }}</p>

            <div class="mt-4 flex gap-2">
              <button 
                @click="cancelOrder(order.id)" 
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button 
                @click="stashOrder(order.id)" 
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
              >
                Stash
              </button>
              <button 
                @click="togglePaymentOptions(order.id)" 
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Process Payment
              </button>
            </div>

            <!-- Payment Options Modal -->
            <div v-if="showPaymentOptions === order.id" class="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700">
              <p class="text-gray-700 dark:text-gray-300 font-medium">Choose Payment Method:</p>
              <div class="mt-2 flex gap-2">
                <button 
                  @click="togglePaymentOptions(null)" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  @click="openKeypad(order.id,'cash')"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Cash Payment
                </button>
                <button 
                  @click="openMpesaKeyPad(order.id,'mpesa')"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  MPESA Payment
                </button>
              </div>
              <!-- cash modal -->
              <KeyPad 
              v-if="showCashModal[order.id]" 
              :isOpen="showCashModal[order.id]" 
              :billAmount="selectedBill"
              :orderID="selectedOrder"
              :paymentMethod="selectedMethod"
              title="Keypad" 
              @close="showCashModal[order.id] = false"
              @paymentSuccess="fetchOrders"
            />

            <PreviewMpesa
              v-else-if="showMpesaModal[order.id]"
              :isOpen="showMpesaModal[order.id]"
              :billAmount="order.total_price"
              :orderNo="authStore.user.phone"
              :paymentMethod="selectedMethod"
              title="PreviewMpesa"
              @close="showMpesaModal[order.id]=false"
              @paymentSuccess="fetchOrders"
            
            />


              <!-- mpesa modal -->


            </div>
          </div>
        </div>

        <p v-else class="text-gray-500 text-center">No orders found.</p>
      </div>
    </div>
  </section>
</template>
