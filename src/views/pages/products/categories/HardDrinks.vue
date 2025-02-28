<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Product Grid -->
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg p-4"
      >
        <!-- Product Image -->
        <div class="relative">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-cover rounded-lg"
          />
        </div>
  
        <!-- Product Info -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ product.name }}
          </h3>
  
          <!-- Price and In-Stock Status -->
          <div class="flex justify-between items-center mt-2">
            <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
            <span :class="product.inStock ? 'text-green-500' : 'text-red-500'">
              {{ product.inStock ? "In Stock" : "Out of Stock" }}
            </span>
          </div>
  
          <!-- Quantity Selector -->
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-3">
              <button
                @click="decreaseQuantity(product)"
                class="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold hover:bg-gray-300 transition"
              >
                -
              </button>
              <span class="text-lg font-semibold">{{ product.quantity }}</span>
              <button
                @click="increaseQuantity(product)"
                class="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
  
          <!-- Buy Now Button -->
          <button
            @click="buyNow(product)"
            class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Buy Now
          </button>
        </div>
      </div>
      <!-- Product Grid -->
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Sample Product Data
  const products = ref([
    { id: 1, name: "Pencil", price: 1.5, inStock: true, image: "src/assets/img/products/pencil.jpg", quantity: 1 },
    { id: 2, name: "Notebook", price: 5, inStock: true, image: "src/assets/img/products/notebook.jpg", quantity: 1 },
    { id: 3, name: "Backpack", price: 30, inStock: false, image: "src/assets/img/products/backpack.jpg", quantity: 1 },
  ]);
  
  // Functions to Increase or Decrease Quantity
  const increaseQuantity = (product) => {
    product.quantity++;
  };
  
  const decreaseQuantity = (product) => {
    if (product.quantity > 1) {
      product.quantity--;
    }
  };
  
  // Buy Now Function
  const buyNow = (product) => {
    alert(`Buying ${product.quantity}x ${product.name} for $${product.price * product.quantity}`);
  };
  </script>
  