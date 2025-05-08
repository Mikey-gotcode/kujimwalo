<script setup>
import { ref, onBeforeMount, watch, defineProps, nextTick, inject, computed } from 'vue';
//import axios from 'axios';
import api from '../../../../api';
import { useAuthStore } from '../../../../store/auth';
import { useCartStore } from '../../../../store/cart';
import { useRouter } from 'vue-router';

console.log('API Object in Component:', api);

const props = defineProps({ activeTab: Number });
const products = ref([]);
const allProducts = ref([]);
const loading = ref(true);
const error = ref(null);
const cart = ref([]);
const quantities = ref({});
const showCart = ref(false);
const theme = inject('theme');
const currentPage = ref(1);
const itemsPerPage = 6;

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const isInStock = (product) => product.stock_quantity > 0;

const activeImageIndex = ref({});

const getImageUrl = (product) => {
  console.log('API Object in getImageUrl:', api); // Debugging
  if (!api || !api.baseURL) {
    console.error('api or api.baseURL is undefined!');
    return 'default-image.jpg'; // Prevent further errors
  }
  if (!product.images.length) return 'default-image.jpg';
  const idx = activeImageIndex.value[product.id] || 0;
  return `${api.baseURL}/${product.images[idx].image_path}`;
};

const prevImage = (productId) => {
  const idx = activeImageIndex.value[productId] || 0;
  activeImageIndex.value[productId] = Math.max(idx - 1, 0);
};

const nextImage = (productId, total) => {
  const idx = activeImageIndex.value[productId] || 0;
  activeImageIndex.value[productId] = Math.min(idx + 1, total - 1);
};

const increaseQuantity = (product) => {
  quantities.value[product.id] = (quantities.value[product.id] || 0) + 1;
};
const decreaseQuantity = (product) => {
  quantities.value[product.id] = Math.max((quantities.value[product.id] || 0) - 1, 0);
};

const addToCart = (product) => {
  const existing = cart.value.find(i => i.id === product.id);
  if (existing) existing.quantity = quantities.value[product.id];
  else {
    cart.value.push({ ...product, quantity: quantities.value[product.id] });
    cartStore.setCartItems(cart.value, authStore.token);
  }
};

const removeFromCart = (id) => {
  cart.value = cart.value.filter(i => i.id !== id);
};

const toggleCart = () => nextTick(() => (showCart.value = !showCart.value));

const checkout = async () => {
  if (!authStore.token) return router.push('/signin');
  const payload = {
    user_id: authStore.user.id,
    items: cart.value.map(i => ({ product_id: i.id, quantity: i.quantity }))
  };
  try {
    await api.post('/orders', payload, {
      headers: { Authorization: `Bearer ${authStore.token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      withCredentials: true
    });
    alert('Order placed successfully!');
    cart.value = [];
  } catch (e) {
    console.error(e);
  }
};

const loadProducts = async () => {
  loading.value = true; error.value = null;
  //if (!authStore.token) return router.push('/signin');
  try {
    const res = await api.get('/products', { headers: { Authorization: `Bearer ${authStore.token}`, Accept: 'application/json' }, withCredentials: true });
    allProducts.value = Array.isArray(res.data) ? res.data : [];
    products.value = props.activeTab ? allProducts.value.filter(p => p.category_id === props.activeTab) : allProducts.value;
    products.value.forEach(p => { quantities.value[p.id] = quantities.value[p.id] || 0; activeImageIndex.value[p.id] = 0; });
  } catch (e) {
    error.value = 'Failed to fetch products.';
    console.error(e);
  } finally { loading.value = false; }
};

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => { const start = (currentPage.value - 1) * itemsPerPage; return products.value.slice(start, start + itemsPerPage); });
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

onBeforeMount(loadProducts);
watch(() => props.activeTab, loadProducts);
</script>
<template>
  <div class="p-4 md:p-6">
    <!-- Product Grid -->
    <div v-if="loading" class="flex justify-center items-center">
      <div aria-label="Loading..." role="status" class="flex items-center space-x-2">
        <svg class="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
          <!-- spinner lines -->
        </svg>
        <span class="text-4xl font-medium text-gray-500">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="products.length === 0" class="text-center text-gray-600">No products found.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="rounded-lg shadow-md overflow-hidden transition hover:shadow-lg p-3 md:p-4"
        :class="theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700'"
      >
        <!-- Image Carousel -->
        <div class="relative overflow-hidden w-full aspect-[4/3]">
          <img
            :src="getImageUrl(product,api.baseURL)"
            :alt="product.name"
            class="w-full h-full object-cover rounded-lg"
          />
          <button
            v-if="product.images.length > 1"
            @click="prevImage(product.id)"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full"
          >
            &#10094;
          </button>
          <button
            v-if="product.images.length > 1"
            @click="nextImage(product.id, product.images.length)"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full"
          >
            &#10095;
          </button>
        </div>

        <div class="p-3 md:p-4">
          <h3
            :class="theme === 'light' ? 'text-black' : 'text-white'"
            class="text-base md:text-lg font-semibold"
          >
            {{ product.name }}
          </h3>
          <p
            :class="theme === 'light' ? 'text-black' : 'text-white'"
            class="text-xs md:text-sm"
          >
            Category: {{ product.category.name }}
          </p>
          <p
            :class="theme === 'light' ? 'text-black' : 'text-white'"
            class="text-xs md:text-sm"
          >
            Last Restocked: {{ product.last_restocked }}
          </p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-lg md:text-xl font-bold text-blue-600">Ksh.{{ product.price }}</span>
            <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
              {{ isInStock(product) ? 'In Stock' : 'Out of Stock' }}
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
              <span
                :class="theme === 'light' ? 'text-black' : 'text-gray-300'"
                class="text-lg font-semibold"
              >
                {{ quantities[product.id] }}
              </span>
              <button
                @click="increaseQuantity(product)"
                class="bg-blue-500 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-base font-bold hover:bg-gray-600 text-white transition"
              >
                +
              </button>
            </div>
          </div>
          <button
            @click="addToCart(product)"
            class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-4 rounded-lg shadow-md transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- View Cart Button -->
    <button
      v-if="cart.length"
      @click="toggleCart"
      class="fixed bottom-5 right-5 md:right-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-5 rounded-lg shadow-lg transition text-sm sm:text-base"
    >
      View Cart ({{ cart.length }})
    </button>

    <!-- Teleported Cart -->
    <Teleport to="body">
      <div
        v-if="showCart"
        class="fixed top-5 right-5 w-11/12 sm:w-96 rounded-lg shadow-lg p-4 border"
        :class="theme === 'light'
          ? 'bg-white text-gray-900 border-gray-200'
          : 'bg-gray-800 text-gray-200 border-gray-900'"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg sm:text-xl font-bold">Cart</h2>
          <button @click="showCart = false" class="text-blue-500 hover:underline">Close</button>
        </div>
        <ul>
          <li
            v-for="item in cart"
            :key="item.id"
            class="flex justify-between items-center mt-3"
          >
            <span class="text-sm sm:text-base">{{ item.name }} ({{ item.quantity }})</span>
            <button
              @click="removeFromCart(item.id)"
              class="text-blue-500 hover:underline text-sm sm:text-base"
            >
              Remove
            </button>
          </li>
        </ul>
        <button
          @click="checkout"
          class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-md transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </Teleport>
  </div>
</template>

