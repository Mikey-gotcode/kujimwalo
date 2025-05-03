
<template>
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
<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 <div v-for="product in paginatedProducts" :key="product.id"
   class="rounded-lg shadow-md overflow-hiidden transition hover:shadow-lg p-3 md:p-4"
   :class="theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700'">
   <div class="relative">
        <!-- Image Slider -->
        <div class="relative overflow-hidden w-full aspect-[4/3]">
          <img :src="product.images[activeImageIndex[product.id]]?.image_path || 'default-image.jpg'"
               class="w-full h-full object-cover rounded-lg" />
          <button v-if="product.images.length > 1"
                  @click="prevImage(product.id)"
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full">
            &#10094;
          </button>
          <button v-if="product.images.length > 1"
                  @click="nextImage(product.id, product.images.length)"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full">
            &#10095;
          </button>
        </div>
      </div>

   <div class="p-3 md:p-4">
    <h3 :class="theme === 'light' ? 'text-black' : 'text-white'" class="text-base md:text-lg font-semibold">{{ product.name }}</h3>
     <p :class="theme === 'light' ? 'text-black' : 'text-white'"  class="text-xs md:text-sm">Category ID: {{ product.category_id }}</p>
     <p :class="theme === 'light' ? 'text-black' : 'text-white'"class="text-xs md:text-sm">Last Restocked: {{ product.last_restocked }}</p>
     <p :class="theme === 'light' ? 'text-black' : 'text-white'"class="text-xs md:text-sm">Stock Quantity:{{ product.stock_quantity }}</p>
     <div class="flex justify-between items-center mt-2">
       <span class="text-xl font-bold text-blue-600">Ksh.{{ product.price }}</span>
       <span :class="isInStock(product) ? 'text-green-500' : 'text-red-500'">
         {{ isInStock(product) ? "In Stock" : "Out of Stock" }}
       </span>
     </div>

     <div class="flex gap-2 mt-4">
       <button @click="editProduct(product)"
         class="w-full bg-blue-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition border border-red-500 hover:cursor-pointer">
         Edit
       </button>

       <button @click="confirmDelete(product.id)"
         class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition border border-gray-500 hover:cursor-pointer">
         Delete
       </button>
     </div>
   </div>
 </div>

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

  <!-- Success Message -->
  <div v-if="successMessage"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500">
    {{ successMessage }}
  </div>


</template>


<script setup>
import { ref, onBeforeMount, watch, defineProps, computed, inject } from "vue";
import axios from "axios";
import api from "../../../../api";
import { useAuthStore } from "../../../../store/auth";
import {useRouter} from 'vue-router'

const props = defineProps({
  activeTab: Number,
  required: true,
});

const products = ref([]);
const allProducts = ref([])
const activeImageIndex = ref({});
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);
const theme = inject("theme")
const successMessage = ref("");
const imageFile = ref(null); // Store the image file
const currentPage = ref(1);
const itemsPerPage = 6;

const authStore = useAuthStore()
const router = useRouter()

const isInStock = (product) => product.stock_quantity > 0;

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 5 * 1024 * 1024) { // Ensure file is <= 5MB
    imageFile.value = file;
  } else {
    alert("File size exceeds 5MB limit.");
  }
};

const prevImage = (productId) => {
  if (activeImageIndex.value[productId] > 0) {
    activeImageIndex.value[productId]--;
  }
};

const nextImage = (productId, totalImages) => {
  if (activeImageIndex.value[productId] < totalImages - 1) {
    activeImageIndex.value[productId]++;
  }
};

const editProduct = (product) => {
  selectedProduct.value = { ...product };
};

const saveChanges = async () => {
  if (
    !selectedProduct.value.name ||
    !selectedProduct.value.price ||
    !selectedProduct.value.category_id ||
    !selectedProduct.value.stock_quantity
  ) {
    alert("All fields are required.");
    return;
  }

  try {
    const authToken = authStore.token;
    let payload;
    let headers = {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    };

    // Check if an image is included
    if (imageFile.value) {
      // Use FormData (multipart/form-data)
      payload = new FormData();
      payload.append("name", selectedProduct.value.name);
      payload.append("price", parseFloat(selectedProduct.value.price));
      payload.append("category_id", parseInt(selectedProduct.value.category_id));
      payload.append("stock_quantity", parseInt(selectedProduct.value.stock_quantity));
      payload.append("images[]", imageFile.value); // Append image

      headers["Content-Type"] = "multipart/form-data";
    } else {
      // Use JSON (application/json)
      payload = {
        name: selectedProduct.value.name,
        price: parseFloat(selectedProduct.value.price),
        category_id: parseInt(selectedProduct.value.category_id),
        stock_quantity: parseInt(selectedProduct.value.stock_quantity),
      };

      headers["Content-Type"] = "application/json";
    }

    // Make the request
    await axios.patch(`${api.baseURL}/products/${selectedProduct.value.id}`, payload, {
      headers,
      withCredentials: true, // Important if using Laravel Sanctum
    });

    // Update UI state
    const index = products.value.findIndex((p) => p.id === selectedProduct.value.id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...selectedProduct.value };
    }

    selectedProduct.value = null;
    showSuccessMessage("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
  }
};



// Delete Product
const confirmDelete = async (productId) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const authToken = authStore.token;

      if (!authToken) {
        alert("You need to log in first.");
        router.push('/signin');
        return;
      }
      await axios.delete(`${api.baseURL}/products/${productId}`,{
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
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
  loading.value = true;
  error.value = null;
  try {
    const authToken = authStore.token;
    if (!authToken) {
      error.value = "You need to log in first.";
      router.push("/signin");
      return;
    }
    const response = await axios.get(`${api.baseURL}/products`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      withCredentials: true,
    });

    // Ensure products are always an array
    allProducts.value = Array.isArray(response.data) ? response.data : [];

    // Apply filtering safely
    products.value = props.activeTab 
      ? allProducts.value.filter((p) => p.category_id === props.activeTab) 
      : allProducts.value;

    updatePaginatedProducts();
  } catch (err) {
    error.value = "Failed to fetch products. Please try again later.";
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};


// Refresh paginated products when currentPage changes
const updatePaginatedProducts = () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1;
  }
};


const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
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

// Fetch products before component mounts
onBeforeMount(() => {
  loadProducts();
});

// Watch for changes in activeTab to re-filter products
watch(() => props.activeTab, () => {
  // Filter products again when activeTab changes
  products.value = props.activeTab 
    ? allProducts.value.filter((p) => p.category_id === props.activeTab) 
    : allProducts.value;
  
  updatePaginatedProducts();
});

</script>
