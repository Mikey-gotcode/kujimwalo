<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-lg w-96">
                
                <!-- Input Field -->
                <input 
                    type="text" 
                    v-model="amount" 
                    class="w-full mb-4 p-2 border border-gray-300 rounded text-lg text-center"
                    readonly
                />

                <!-- Keypad Grid -->
                <div class="grid grid-cols-3 gap-2"> 
                    <button 
                        v-for="number in numbers" 
                        :key="number.id" 
                        @click.prevent="appendNumber(number.value)"
                        class="p-4 bg-gray-200 text-lg font-bold rounded hover:bg-gray-300 focus:outline-none"
                    >
                        {{ number.value }}
                    </button>

                    <!-- Backspace Button -->
                    <button 
                        @click.prevent="removeLastDigit"
                        class="p-4 bg-red-500 text-white text-lg font-bold rounded hover:bg-red-600 focus:outline-none"
                    >
                        ⌫
                    </button>

                    <!-- Clear Button -->
                    <button 
                        @click.prevent="clearInput"
                        class="p-4 bg-gray-500 text-white text-lg font-bold rounded hover:bg-gray-600 focus:outline-none"
                    >
                        C
                    </button>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="mt-2 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
                >
                    SUBMIT PAYMENT
                </button>

                <!-- Close Button -->
                <button 
                    type="button" 
                    @click="closeModal"
                    class="mt-2 w-full bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400"
                >
                    Close
                </button>
            </form>

            <!-- Alert Message -->
            <div v-if="alertMessage" class="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow">
                {{ alertMessage }}
            </div>
        </div>
    </teleport>
</template>


<script setup>

import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import api from '../api';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
    isOpen: Boolean,
    billAmount: Number,
    orderID: Number,
    paymentMethod: String,
    title: String
});

const emit = defineEmits(['close', 'paymentSuccess']);
const authStore = useAuthStore()
const router = useRouter()

const amount = ref(props.billAmount || 0);
const alertMessage = ref('');
const numbers = ref([...Array(10).keys()].map(i => ({ id: i, value: i }))); // Generates numbers 0-9

watch(() => props.billAmount, (newAmount) => {
    amount.value = newAmount;
});

const appendNumber = (num) => {
    amount.value += num;
};

const removeLastDigit = () => {
    amount.value = amount.value.slice(0, -1);
};

const clearInput = () => {
    amount.value = "";
};

const submitForm = async () => {
    if (!amount.value || isNaN(amount.value)) {
        showAlert("Please enter a valid amount");
        return;
    }

    try {
        const authToken = authStore.token;

        if (!authToken) {
        alert("You need to log in first.");
        router.push('/signin');
        return;
        }
        const response = await axios.post(`${api.baseURL}/orders/${props.orderID}/process-payment`,
        {
            amount:amount.value,
            payment_method:props.paymentMethod
        },
        {
            headers: {
                Authorization: `Bearer ${authToken}`, // Ensure the correct format
                Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
      withCredentials: true, // Important if using Laravel Sanctum
    });

        if (response.data.success) {
            showAlert(response.data.message || "Payment successful");
            emit('paymentSuccess'); // Notify parent to refresh orders
            setTimeout(() => closeModal(), 2000);
        } else {
            showAlert(`Payment failed: ${response.data.message}`);
        }
    } catch (error) {
        showAlert(error.response?.data?.error || "Payment failed");
    }
};
const showAlert = (message) => {
    alertMessage.value = message;
    setTimeout(() => {
        alertMessage.value = "";
    }, 5000);
};

const closeModal = () => {
    emit('close');
};
</script>
