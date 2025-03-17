<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md transition hover:shadow-lg p-4">
      <div class="relative">
        <img :src="require(`@/assets/productImages/${product.imageURL}`)" :alt="product.name" class="w-full h-48 object-cover rounded-lg" />
      </div>

      <div class="p-4 min-h-[400px]">
        <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
        <p class="text-gray-600 text-sm">Category ID: {{ product.category_id }}</p>
        <p class="text-gray-600 text-sm">Last Restocked: {{ product.last_restocked }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
          <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
            {{ isInStock(product) ? "In Stock" : "Out of Stock" }}
          </span>
        </div>

        <div class="flex gap-2 mt-4">
          <button @click="editProduct(product)" class="w-full bg-blue-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition border border-red-500 hover:cursor-pointer">
            Edit
          </button>

          <button @click="confirmDelete(product.id)" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition border border-gray-500 hover:cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-bold mb-4">Edit Product</h2>
      <label class="block mb-2">Name</label>
      <input v-model="selectedProduct.name" class="w-full p-2 border rounded mb-3" type="text" />
      <label class="block mb-2">Price</label>
      <input v-model="selectedProduct.price" class="w-full p-2 border rounded mb-3" type="number" step="0.01" />
      <label class="block mb-2">Product Image</label>
      <input type="file" accept="image/*" @change="handleImageUpload" class="w-full p-2 border rounded mb-3" />
      <label class="block mb-2">Stock Quantity</label>
      <input v-model="selectedProduct.stock_quantity" class="w-full p-2 border rounded mb-3" type="number" />

      <div class="flex justify-between mt-4">
        <button @click="saveChanges" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
        <button @click="selectedProduct = null" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div v-if="successMessage" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500">
    {{ successMessage }}
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect, defineProps } from "vue";
import axios from "axios";
import api from "../../../../api";
import { useAuthStore } from "../../../../store/auth";
import { useRouter } from 'vue-router';

const props = defineProps({ activeTab: Number });

const products = ref([]);
const selectedProduct = ref(null);
const successMessage = ref("");
const imageFile = ref(null);
const authStore = useAuthStore();
const router = useRouter();

const isInStock = (product) => product.stock_quantity > 0;

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 5 * 1024 * 1024) { // Ensure file is <= 5MB
    imageFile.value = file;
  } else {
    alert("File size exceeds 5MB limit.");
  }
};

const editProduct = (product) => {
  selectedProduct.value = { ...product };
};

const saveChanges = async () => {
  if (!selectedProduct.value.name || !selectedProduct.value.price || !selectedProduct.value.stock_quantity) {
    alert("All fields are required.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", selectedProduct.value.name);
    formData.append("price", parseFloat(selectedProduct.value.price));
    formData.append("category_id", parseInt(selectedProduct.value.category_id));  // Ensure category_id is an integer
    formData.append("stock_quantity", parseInt(selectedProduct.value.stock_quantity));

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }

    const response = await axios.put(`${api.baseURL}/products/${selectedProduct.value.id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    const updatedProduct = response.data;
    const index = products.value.findIndex((p) => p.id === selectedProduct.value.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }

    selectedProduct.value = null;
    showSuccessMessage("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const confirmDelete = async (productId) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const authToken = authStore.token;
      if (!authToken) {
        alert("You need to log in first.");
        router.push('/signin');
        return;
      }

      await axios.delete(`${api.baseURL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      products.value = products.value.filter((p) => p.id !== productId);
      showSuccessMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};

const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ""; }, 3000);
};

const loadProducts = async () => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }

    const response = await axios.get(`${api.baseURL}/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true,
    });

    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  }
};

onBeforeMount(() => { loadProducts(); });
watchEffect(() => { loadProducts(); });
</script>
