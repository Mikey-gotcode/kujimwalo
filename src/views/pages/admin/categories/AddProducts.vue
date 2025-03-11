<template>
   <teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>

            <!-- Success/Error Message with Styling -->
            <transition name="fade">
               <div v-if="message" class="mb-4 p-3 rounded-lg border" :class="messageType">
                  {{ message }}
               </div>
            </transition>

            <div class="grid gap-4 mb-4">
               <div>
                  <label for="name" class="block mb-2 text-sm font-medium">Name</label>
                  <input v-model="formData.name" type="text" id="name" class="input-field" required />
               </div>
               <div>
                  <label for="stock_quantity" class="block mb-2 text-sm font-medium">Stock Quantity</label>
                  <input v-model="formData.stock_quantity" type="text" id="stock_quantity" class="input-field" required />
               </div>
               <div>
                  <label for="price" class="block mb-2 text-sm font-medium">Price</label>
                  <input v-model="formData.price" type="number" id="price" class="input-field" required />
               </div>
               <div>
                  <label for="category" class="block mb-2 text-sm font-medium">Select Category</label>
                  <select v-model="formData.category_id" id="category" class="input-field">
                     <option value="" disabled>Select category</option>
                     <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                     </option>
                  </select>

                  <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
               </div>
            </div>

            <button type="submit" class="submit-btn">
               Add new product
            </button>
            <button type="button" @click="closeModal"
               class="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5">
               Close
            </button>
         </form>
      </div>
   </teleport>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import api from '../../../../api';
import { useAuthStore } from '../../../../store/auth';
import {useRouter} from 'vue-router'

defineProps(['isOpen', 'title']);
const emit = defineEmits();

const authStore = useAuthStore()
const router = useRouter()

const categories = ref([]);
const errorMessage = ref('');

const formData = reactive({
   name: '',
   category_id: '',
   price: '',
   stock_quantity: ''
});

const message = ref('');
const messageType = ref('');

const submitForm = async () => {
   try {
      const authToken = authStore.token;

      if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
      }
      //console.log("form data:", formData);
      const response = await axios.post(`${api.baseURL}/products`,  formData,{
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
      
      // Display success message with green effect
      message.value = response.data.message;
      messageType.value = 'bg-green-500 text-white p-3 border border-green-700';

      // Clear form after submission
      Object.keys(formData).forEach(key => formData[key] = '');
      
      // Hide message after 3 seconds
      setTimeout(() => message.value = '', 3000);
   } catch (error) {
      // Display error message with red effect
      message.value = 'Failed to add product. Try again!';
      messageType.value = 'bg-red-500 text-white p-3 border border-red-700';

      // Hide error message after 3 seconds
      setTimeout(() => message.value = '', 3000);
   }
};

const fetchCategories = async () => {
   const authToken = authStore.token

      if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
      }
   try {
      const response = await axios.get(`${api.baseURL}/category` ,{
      headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });
      categories.value = response.data; // Assuming API returns an array of { id, name }
   } catch (error) {
      errorMessage.value = 'Failed to load categories';
   }
};



const closeModal = () => {
  emit('close');
};


onMounted(fetchCategories);
</script>

<style scoped>
.input-field {
   width: 100%;
   padding: 8px;
   border: 1px solid #ccc;
   border-radius: 5px;
}

/* Success/Error Message Fade Effect */
.fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
   opacity: 0;
}

.submit-btn {
   width: 100%;
   padding: 10px;
   background-color: #4CAF50;
   color: white;
   font-weight: bold;
   border: none;
   border-radius: 5px;
   cursor: pointer;
}

.submit-btn:hover {
   background-color: #45a049;
}
</style>
