<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import api from '../../../api'

const orders = ref([]);
const selectedStatus = ref('All orders');
const selectedDuration = ref('this week');
const loading = ref(true);
const error = ref(null);

// Fetch orders from API
const fetchOrders = async () => {
  try {
    const response = await axios.get(`${api.baseURL}/unpaid`);
    orders.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

// Filter orders dynamically
const filteredOrders = () => {
  return orders.value.filter(order => {
    const matchesStatus = selectedStatus.value === 'All orders' || order.status === selectedStatus.value;
    return matchesStatus; // Extend for date filtering if needed
  });
};

const cancelOrder = async (id) => {
  try {
    await axios.post(`${api.baseURL}/unpaid/${id}/cancel`);
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (err) {
    alert('Failed to cancel order');
  }
};
</script>

<template>
  <section class="bg-white py-8 dark:bg-gray-900 md:py-16">
    <div class="mx-auto max-w-screen-xl px-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Orders</h2>
      <div class="mt-6">
        <label>Select Order Status:</label>
        <select v-model="selectedStatus" class="select-box">
          <option>All orders</option>
          <option value="pre-order">Pre-order</option>
          <option value="transit">In transit</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div v-if="loading">Loading orders...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <div v-if="filteredOrders().length">
          <div v-for="order in filteredOrders()" :key="order.id" class="order-item">
            <p>Order ID: #{{ order.id }}</p>
            <p>Date: {{ order.date }}</p>
            <p>Price: ${{ order.price }}</p>
            <p>Status: {{ order.status }}</p>
            <button @click="cancelOrder(order.id)" class="cancel-btn">Cancel</button>
          </div>
        </div>
        <p v-else class="text-gray-500">No orders found.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.select-box {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 5px;
}
.order-item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
.cancel-btn {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
