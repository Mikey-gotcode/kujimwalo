<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="bg-white rounded-lg shadow-md transition hover:shadow-lg p-4"
    >
      <div class="relative">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <div class="p-4 min-h-[400px]">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ product.name }}
        </h3>
        <p class="text-gray-600 text-sm">Category ID: {{ product.category_id }}</p>
        <p class="text-gray-600 text-sm">Last Restocked: {{ product.last_restocked }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
          <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
            {{ isInStock(product) ? "In Stock" : "Out of Stock" }}
          </span>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="editProduct(product)"
            class="w-full bg-blue-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition border border-red-500 hover:cursor-pointer"
          >
            Edit
          </button>

          <button
            @click="confirmDelete(product.id)"
            class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition border border-gray-500 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="selectedProduct"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-bold mb-4">Edit Product</h2>
      <label class="block mb-2">Name</label>
      <input v-model="selectedProduct.name" class="w-full p-2 border rounded mb-3" type="text" />
      <label class="block mb-2">Price</label>
      <input v-model="selectedProduct.price" class="w-full p-2 border rounded mb-3" type="number" step="0.01" />
      <label class="block mb-2">Image URL</label>
      <input v-model="selectedProduct.image" class="w-full p-2 border rounded mb-3" type="text" />
      <label class="block mb-2">Stock Quantity</label>
      <input v-model="selectedProduct.stock_quantity" class="w-full p-2 border rounded mb-3" type="number" />

      <div class="flex justify-between mt-4">
        <button
          @click="saveChanges"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
        <button
          @click="selectedProduct = null"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- Success Message -->
  <div
    v-if="successMessage"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500"
  >
    {{ successMessage }}
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect, defineProps } from "vue";
import axios from "axios";
import api from "../../../../api";

const props = defineProps({
  activeTab: Number,
  required: true,
});

const products = ref([]);
const selectedProduct = ref(null);
const successMessage = ref("");

const isInStock = (product) => product.stock_quantity > 0;

const editProduct = (product) => {
  selectedProduct.value = { ...product };
};

const saveChanges = async () => {
  try {
    console.log("category id:",selectedProduct.value.category_id)
    await axios.patch(`${api.baseURL}/products/${selectedProduct.value.category_id}`, {
      name: selectedProduct.value.name,
      price: selectedProduct.value.price,
      category_id:selectedProduct.value.category_id,
      image: selectedProduct.value.image || null,
      stock_quantity: selectedProduct.value.stock_quantity,
    });

    const index = products.value.findIndex((p) => p.id === selectedProduct.value.id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...selectedProduct.value };
    }
    selectedProduct.value = null;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Delete Product
const confirmDelete = async (productId) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await axios.delete(`${api.baseURL}/products/${productId}`);
      products.value = products.value.filter((p) => p.id !== productId);
      showSuccessMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};

// Show success message for a few seconds
const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000);
};

// Load and filter products
const loadProducts = async () => {
  try {
    const response = await axios.get(`${api.baseURL}/products`);
    const allProducts = response.data;

    // Filter products based on activeTab (categoryId)
    products.value = props.activeTab ? allProducts.filter((p) => p.category_id === props.activeTab) : allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  }
};

// Fetch products before component mounts
onBeforeMount(() => {
  loadProducts();
});

// Watch for changes in activeTab to re-filter products
watchEffect(() => {
  loadProducts();
});
</script>
