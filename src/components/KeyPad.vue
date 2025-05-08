<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form @submit.prevent="submitForm" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                
                <!-- Input Field -->
                <input 
                    type="text" 
                    v-model="amount" 
                    class="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded text-lg text-center bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    readonly
                />

                <!-- Keypad Grid -->
                <div class="grid grid-cols-3 gap-2"> 
                    <button 
                        v-for="number in numbers" 
                        :key="number.id" 
                        @click.prevent="appendNumber(number.value)"
                        class="p-4 bg-gray-200 dark:bg-gray-700 text-lg font-bold rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
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
                        class="p-4 bg-gray-500 dark:bg-gray-600 text-white text-lg font-bold rounded hover:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none"
                    >
                        C
                    </button>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="mt-2 w-full bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-400"
                >
                    SUBMIT PAYMENT
                </button>

                <!-- Close Button -->
                <button 
                    type="button" 
                    @click="closeModal"
                    class="mt-2 w-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white font-bold py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                    Close
                </button>
            </form>

        </div>
    </teleport>
    <!-- Alert Message -->
    <div v-if="alertMessage" class="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow">
        {{ fullMessage }}
    </div>
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
const authStore = useAuthStore();
const router = useRouter();

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
    amount.value = amount.value.toString().slice(0, -1) || "0";
};


const clearInput = () => {
    amount.value = "";
};

const submitForm = async () => {
    if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
        showAlert({ message: "Please enter a valid amount" });
        return;
    }

    try {
        const authToken = authStore.token;

        if (!authToken) {
            alert("You need to log in first.");
            router.push('/signin');
            return;
        }

        const response = await axios.post(`/orders/${props.orderID}/process-payment`, 
        {
            amount: amount.value,
            payment_method: props.paymentMethod
        }, 
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
            },
            withCredentials: true,
        });

        if (response?.data) {
            showAlert(response.data); // Ensure response.data is passed correctly
            emit('paymentSuccess');
            setTimeout(() => closeModal(), 2000);
        } else {
            showAlert({ message: "Payment failed: Unexpected response format." });
        }
    } catch (error) {
        showAlert({ message: error.response?.data?.error || "Payment failed due to a network error." });
    }
};



const showAlert = (responseData) => {
    if (!responseData || typeof responseData !== "object") {
        console.error("Invalid response data:", responseData);
        alertMessage.value = "An unexpected error occurred.";
        alert("An unexpected error occurred."); // Fallback alert
        return;
    }

    // Extract message and remaining balance correctly
    const message = responseData.message || "Something went wrong.";
    const remainingBalance = responseData.remaining_balance !== undefined ? responseData.remaining_balance : null;

    // Format the alert message
    const fullMessage = remainingBalance > 0 
        ? `${message} Remaining balance: KES ${remainingBalance}`
        : message;

    alertMessage.value = fullMessage;

    // Browser fallback alert
    alert(fullMessage);

    console.log("Alert message set:", fullMessage); // Debugging log

    setTimeout(() => {
        console.log("Clearing alert"); // Debugging log
        alertMessage.value = "";
    }, 5000);
};


const closeModal = () => {
    emit('close');
};
</script>
