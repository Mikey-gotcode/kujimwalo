<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form @submit.prevent="submitForm" 
                class="p-6 rounded-lg shadow-lg w-96"
                :class="{'bg-white text-gray-900': theme === 'light', 'bg-gray-800 text-gray-200': theme === 'dark'}">
                
                <!-- Amount Input Field -->
                <input 
                    type="text" 
                    v-model="amount" 
                    class="w-full mb-4 p-2 border rounded text-lg text-center"
                    :class="{'bg-white text-gray-900 border-gray-300': theme === 'light', 'bg-gray-700 text-gray-200 border-gray-600': theme === 'dark'}"
                    @focus="editingField = 'amount'"
                />
                
                <!-- Phone Input Field -->
                <input 
                    type="text" 
                    v-model="phone" 
                    class="w-full mb-4 p-2 border rounded text-lg text-center"
                    :class="{'bg-white text-gray-900 border-gray-300': theme === 'light', 'bg-gray-700 text-gray-200 border-gray-600': theme === 'dark'}"
                    @focus="editingField = 'phone'"
                />

                <!-- Keypad Grid -->
                <div class="grid grid-cols-3 gap-2">
                    <button 
                        v-for="number in numbers" 
                        :key="number" 
                        @click.prevent="append(number)"
                        class="p-4 font-bold rounded hover:bg-opacity-80 focus:outline-none"
                        :class="{'bg-gray-200 text-gray-900 hover:bg-gray-300': theme === 'light', 'bg-gray-700 text-gray-200 hover:bg-gray-600': theme === 'dark'}"
                    >
                        {{ number }}
                    </button>

                    <!-- Backspace Button -->
                    <button 
                        @click.prevent="removeLastDigit"
                        class="p-4 text-white font-bold rounded hover:bg-opacity-80 focus:outline-none"
                        :class="{'bg-red-500 hover:bg-red-600': theme === 'light', 'bg-red-700 hover:bg-red-800': theme === 'dark'}"
                    >
                        ⌫
                    </button>

                    <!-- Clear Button -->
                    <button 
                        @click.prevent="clear"
                        class="p-4 text-white font-bold rounded hover:bg-opacity-80 focus:outline-none"
                        :class="{'bg-gray-500 hover:bg-gray-600': theme === 'light', 'bg-gray-600 hover:bg-gray-700': theme === 'dark'}"
                    >
                        C
                    </button>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="mt-2 w-full font-bold py-2 rounded hover:bg-opacity-80"
                    :class="{'bg-blue-600 text-white hover:bg-blue-700': theme === 'light', 'bg-blue-700 text-gray-100 hover:bg-blue-800': theme === 'dark'}"
                >
                    SUBMIT PAYMENT
                </button>

                <!-- Close Button -->
                <button 
                    type="button" 
                    @click="closeModal"
                    class="mt-2 w-full font-bold py-2 rounded hover:bg-opacity-80"
                    :class="{'bg-gray-300 text-gray-700 hover:bg-gray-400': theme === 'light', 'bg-gray-700 text-gray-200 hover:bg-gray-600': theme === 'dark'}"
                >
                    Close
                </button>
            </form>
        </div>
    </teleport>
</template>

<script setup>

import { defineProps, defineEmits, ref, watch, inject } from 'vue';
//import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../api';

const props = defineProps({
    isOpen: Boolean,
    billAmount: Number,
    orderNo: String,
    orderID: Number,
    paymentMethod: String,
    title: String
});

const emit = defineEmits(['close', 'paymentSuccess']);
const router = useRouter();
const authStore = useAuthStore();
const theme = inject('theme');

const numbers = ref([...Array(10).keys()]);
const amount = ref(props.billAmount?.toString() || '');
const alertMessage = ref('');
const phone = ref(props.orderNo || '');
const editingField = ref('amount');
const pollingInterval = 3000; // Check status every 3 seconds
const pollingTimeout = 60000; // Stop polling after 60 seconds
const isPolling = ref(false);
let pollingIntervalId = null;
let pollingStartTime = null;

const startPolling = (checkoutRequestId) => {
    isPolling.value = true;
    pollingStartTime = Date.now();
    pollingIntervalId = setInterval(async () => {
        try {
            const response = await api.get(`/mpesa/stk/status/${checkoutRequestId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    Accept: 'application/json'
                },
                withCredentials: true
            });

            if (response.data.result_code === 0) {
                console.log('Payment successful! Data:', response.data);
                clearInterval(pollingIntervalId);
                isPolling.value = false;
                showAlert("Payment successful!");
                emit('paymentSuccess', response.data);
                setTimeout(() => closeModal(), 2000);
            } else if (response.data.result_code !== null && response.data.result_code !== 0) {
                console.error('Payment failed:', response.data.result_desc, `(Code: ${response.data.result_code})`);
                showAlert(`Payment failed: ${response.data.result_desc} (Code: ${response.data.result_code})`);
                clearInterval(pollingIntervalId); // Stop polling on failure
                isPolling.value = false;
            } else {
                console.log('Waiting for payment...');
                // Continue polling
                if (Date.now() - pollingStartTime > pollingTimeout) {
                    clearInterval(pollingIntervalId);
                    isPolling.value = false;
                    showAlert("Payment timed out. Please try again.");
                }
            }
        } catch (error) {
            console.error('Error checking STK status:', error);
            clearInterval(pollingIntervalId);
            isPolling.value = false;
            showAlert("Error checking payment status. Please try again.");
        }
    }, pollingInterval);
};


watch(() => props.orderNo, (newPhone) => {
    phone.value = newPhone;
});

watch(() => props.billAmount, (newAmount) => {
    amount.value = newAmount?.toString() || '';
});

const append = (num) => {
    if (editingField.value === 'amount') {
        amount.value = amount.value === '0' ? num.toString() : amount.value + num.toString();
    } else {
        phone.value += num.toString();
    }
};

const removeLastDigit = () => {
    if (editingField.value === 'amount') {
        amount.value = amount.value.slice(0, -1) || "0";
    } else {
        phone.value = phone.value.slice(0, -1);
    }
};

const clear = () => {
    if (editingField.value === 'amount') {
        amount.value = '0';
    } else {
        phone.value = '';
    }
};

const submitForm = async () => {
    if (!amount.value || isNaN(parseInt(amount.value))) {
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

        const response = await api.post('/mpesa/stkpush', {
            amount: parseInt(amount.value),
            phone: phone.value,
            account_number: '12345',
            order_id: props.orderID
        },
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json'
            },
            withCredentials: true
        });

        if (response.data.checkout_request_id) {
            showAlert(response.data.message || "STK push initiated. Please check your phone to enter your PIN.");
            startPolling(response.data.checkout_request_id);
        } else {
            showAlert(`Payment initiation failed: ${response.data.error || response.data.message}`);
        }
    } catch (error) {
        showAlert(error.response?.data.message || "Payment initiation failed");
        console.error("STK Push Error:", error.response?.data || error);
    }
};

const showAlert = (message) => {
    console.log('Alert:', message); // Temporary for debugging
    alertMessage.value = message;
    setTimeout(() => {
        alertMessage.value = "";
    }, 5000);
};

const closeModal = () => {
    emit('close');
};
</script>
