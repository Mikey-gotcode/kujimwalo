<template>
  <div class="p-4 md:p-6">
    <!-- Product Grid -->
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
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="products.length === 0" class="text-center text-gray-600">No products found.</div>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg p-3 md:p-4"
      >
        <div class="relative">
          <img :src="product.image" :alt="product.name" class="w-full aspect-[4/3] object-cover rounded-lg" />
        </div>
        <div class="p-3 md:p-4">
          <h3 class="text-base md:text-lg font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="text-gray-600 text-xs md:text-sm">Category ID: {{ product.category_id }}</p>
          <p class="text-gray-600 text-xs md:text-sm">Last Restocked: {{ product.last_restocked }}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-lg md:text-xl font-bold text-blue-600">${{ product.price }}</span>
            <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
              {{ isInStock(product) ? "In Stock" : "Out of Stock" }}
            </span>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-3">
              <button
                @click="decreaseQuantity(product)"
                class="bg-blue-500 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-base font-bold hover:bg-gray-600 text-white transition disabled:opacity-50"
                :disabled="quantities[product.id] === 0"
              >
                -
              </button>
              <span class="text-lg font-semibold">{{ quantities[product.id] }}</span>
              <button
                @click="increaseQuantity(product)"
                class="bg-blue-500 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-base font-bold hover:bg-gray-600 text-white transition"
              >
                +
              </button>
            </div>
          </div>
          <button @click="addToCart(product)" class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-4 rounded-lg shadow-md transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- View Cart Button (Fixed at Bottom) -->
    <button 
      v-if="cart.length" 
      @click="toggleCart" 
      class="fixed bottom-5 right-5 md:right-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-5 rounded-lg shadow-lg transition text-sm sm:text-base"
    >
      View Cart ({{ cart.length }})
    </button>

    <!-- Teleported Cart -->
    <Teleport to="body">
      <div v-if="showCart" class="fixed top-5 right-5 w-11/12 sm:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-lg sm:text-xl font-bold">Cart</h2>
          <button @click="showCart = false" class="text-blue-500 hover:underline">Close</button>
        </div>
        <ul>
          <li v-for="item in cart" :key="item.id" class="flex justify-between items-center mt-3">
            <span class="text-sm sm:text-base">{{ item.name }} ({{ item.quantity }})</span>
            <button @click="removeFromCart(item.id)" class="text-blue-500 hover:underline text-sm sm:text-base">Remove</button>
          </li>
        </ul>
        <button @click="checkout" class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-md transition">
          Proceed to Checkout
        </button>
      </div>
    </Teleport>
  </div>
</template>



<script setup>
import { ref, onBeforeMount, watchEffect, defineProps, nextTick } from "vue";
import axios from "axios";
import api from "../../../../api";
import { useAuthStore } from "../../../../store/auth";
import {useCartStore} from "../../../../store/cart"
import {useRouter} from 'vue-router'

const props = defineProps({
  activeTab: Number,
  required: true
});

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const cart = ref([]);
const quantities = ref({});
const showCart = ref(false); // Controls cart visibility
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()


const isInStock = (product) => product.stock_quantity > 0;

const increaseQuantity = (product) => {
  if (!(product.id in quantities.value)) {
    quantities.value[product.id] = 0; // Ensure initialization
  }
  quantities.value[product.id]++;
};
const decreaseQuantity = (product) => {
  if (quantities.value[product.id] > 0) {
    quantities.value[product.id]--;
  }
};

const addToCart = (product) => {
  const existingItem = cart.value.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity = quantities.value[product.id];
  } else {
    cart.value.push({ ...product, quantity: quantities.value[product.id] });
    cartStore.setCartItems(cart.value,authStore.token)
    //console.log("cart values",cart.value)
  }
};

const removeFromCart = (productId) => {
  cart.value = cart.value.filter((item) => item.id !== productId);
};

const toggleCart = () => {
  nextTick(() => {
    showCart.value = !showCart.value;
  });
};

const checkout = async () => {
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }

    const orderPayload = {
      customer_id: authStore.user.id, 
      items: cart.value.map(item => ({
        product_id: item.id,  
        quantity: item.quantity
      }))
    };

    const orderResponse = await axios.post(
      `${api.baseURL}/orders`,
      orderPayload, 
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Correctly formatted
          Accept: 'application/json',
          'Content-Type': 'application/json', // Explicitly defining content type
        },
        withCredentials: true, // Required for Laravel Sanctum authentication
      }
    );

    alert("Order placed successfully!");
    cart.value = [];
    console.log("Order response:", orderResponse.data);
  } catch (error) {
    console.error("Error processing order:", error.response?.data || error.message);
  }
};


const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const authToken = authStore.token;

    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get(`${api.baseURL}/products`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
    
    // Filter products
    products.value = props.activeTab ? response.data.filter((p) => p.category_id === props.activeTab) : response.data;
    products.value.forEach(product => {
      if (!(product.id in quantities.value)) {
        quantities.value[product.id] = 0;
      }
    });
  } catch (error) {
    error.value = "Failed to fetch products. Please try again later.";
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  loadProducts();
});

watchEffect(() => {
  loadProducts();
});
</script>
