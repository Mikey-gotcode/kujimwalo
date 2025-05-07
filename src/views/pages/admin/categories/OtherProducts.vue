<template>
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
      <!-- Image Slider -->
      <div class="relative overflow-hidden w-full aspect-[4/3]">
        <img
          :src="getImageUrl(product)"
          class="w-full h-full object-cover rounded-lg"
          alt="Product image"
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
        <h3 :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-base md:text-lg font-semibold">
          {{ product.name }}
        </h3>
        <p :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-xs md:text-sm">
          Category: {{ product.category.name }}
        </p>
        <p :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-xs md:text-sm">
          Last Restocked: {{ product.last_restocked }}
        </p>
        <p :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-xs md:text-sm">
          Stock: {{ product.stock_quantity }}
        </p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xl font-bold text-blue-600">Ksh.{{ product.price }}</span>
          <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
            {{ isInStock(product) ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>

        <div class="flex gap-2 mt-4">
          <button @click="editProduct(product)"
                  class="w-full bg-blue-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition">
            Edit
          </button>
          <button @click="confirmDelete(product.id)"
                  class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-4">
    <button @click="prevPage" :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50">
      Prev
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-md bg-blue-200 hover:bg-gray-300 disabled:opacity-50">
      Next
    </button>
  </div>

  <!-- Edit Modal -->
  <div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-bold mb-4">Edit Product</h2>
      <label class="block mb-2">Name</label>
      <input v-model="selectedProduct.name" class="w-full p-2 border rounded mb-3" type="text" />

      <label class="block mb-2">Price</label>
      <input v-model="selectedProduct.price" class="w-full p-2 border rounded mb-3" type="number" step="0.01" />

      <label class="block mb-2">Image (optional)</label>
      <input type="file" accept="image/*" @change="handleImageUpload" class="w-full p-2 border rounded mb-3" />

      <label class="block mb-2">Stock Quantity</label>
      <input v-model="selectedProduct.stock_quantity" class="w-full p-2 border rounded mb-3" type="number" />

      <div class="flex justify-between mt-4">
        <button @click="saveChanges" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button @click="selectedProduct = null" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- Success Message -->
  <div v-if="successMessage" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
    {{ successMessage }}
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, defineProps, computed, inject } from 'vue';
import axios from 'axios';
import api from '../../../../api';
import { useAuthStore } from '../../../../store/auth';
import { useRouter } from 'vue-router';

const props = defineProps({ activeTab: Number });
const products = ref([]);
const allProducts = ref([]);
const activeImageIndex = ref({});
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);
const theme = inject('theme');
const successMessage = ref('');
const imageFile = ref(null);
const currentPage = ref(1);
const itemsPerPage = 6;

const authStore = useAuthStore();
const router = useRouter();

const isInStock = (product) => product.stock_quantity > 0;

const getImageUrl = (product) => {
  if (!product.images.length) return 'default-image.jpg';
  const idx = activeImageIndex.value[product.id] || 0;
  return `${api.baseURL}${product.images[idx].image_path}`;
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.size <= 5 * 1024 * 1024) imageFile.value = file;
  else alert('File size exceeds 5MB limit.');
};

const prevImage = (productId) => {
  const idx = activeImageIndex.value[productId] || 0;
  activeImageIndex.value[productId] = Math.max(idx - 1, 0);
};

const nextImage = (productId, total) => {
  const idx = activeImageIndex.value[productId] || 0;
  activeImageIndex.value[productId] = Math.min(idx + 1, total - 1);
};

const editProduct = (product) => {
  selectedProduct.value = { ...product };
};

const saveChanges = async () => {
  if (!selectedProduct.value.name || !selectedProduct.value.price || !selectedProduct.value.stock_quantity) {
    alert('All fields are required.');
    return;
  }
  try {
    const token = authStore.token;
    const url = `${api.baseURL}/products/${selectedProduct.value.id}`;

    const form = new FormData();
    form.append('name', selectedProduct.value.name);
    form.append('price', parseFloat(selectedProduct.value.price));
    form.append('stock_quantity', parseInt(selectedProduct.value.stock_quantity));
    form.append('_method', 'PATCH');
    if (imageFile.value) form.append('images[]', imageFile.value);

    await axios.post(url, form, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      withCredentials: true,
    });

    imageFile.value = null;
    selectedProduct.value = null;
    showSuccessMessage('Product updated successfully!');
    await loadProducts();
  } catch (err) {
    console.error(err);
    alert('Failed to update product.');
  }
};

const confirmDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  try {
    const token = authStore.token;
    await axios.delete(`${api.baseURL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      withCredentials: true,
    });
    products.value = products.value.filter(p => p.id !== id);
    showSuccessMessage('Product deleted successfully!');
  } catch (err) {
    console.error(err);
  }
};

const showSuccessMessage = (msg) => {
  successMessage.value = msg;
  setTimeout(() => successMessage.value = '', 3000);
};

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const token = authStore.token;
    if (!token) { router.push('/signin'); return; }

    const res = await axios.get(`${api.baseURL}/products`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      withCredentials: true,
    });

    allProducts.value = Array.isArray(res.data) ? res.data : [];  
    products.value = props.activeTab
      ? allProducts.value.filter(p => p.category_id === props.activeTab)
      : allProducts.value;

    products.value.forEach(p => (activeImageIndex.value[p.id] = 0));
  } catch (err) {
    error.value = 'Failed to fetch products.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
});
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

onBeforeMount(loadProducts);
watch(() => props.activeTab, loadProducts);
</script>
