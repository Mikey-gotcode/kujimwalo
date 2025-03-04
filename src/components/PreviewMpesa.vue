<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-lg w-96">
                
                <!-- Input Field -->
                <input 
                    type="text" 
                    v-model="props.billAmount" 
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
const HTTPS_MPESA = 'https://233bb7379607c5.lhr.life/api'
import { defineProps, defineEmits,ref } from 'vue';
import axios from 'axios';


const props = defineProps({
    isOpen: Boolean,
    billAmount: Number,
    orderNo: String, // Ensure this is defined
    paymentMethod: String,
    title: String // Ensure this is defined
});

const emit = defineEmits(['close', 'paymentSuccess']);

const numbers = ref([...Array(10).keys()].map(i => ({ id: i, value: i }))); // Generates numbers 0-9
const alertMessage = ref('');
const amount = ref(props.billAmount || '');





const submitForm = async () => {
    if (!amount.value || isNaN(amount.value)) {
        showAlert("Please enter a valid amount");
        return;
    }

    try {
        const response = await axios.post(`${HTTPS_MPESA}/stkpush`, {
            amount: amount,
            phone: props.orderNo,
            payment_method: props.paymentMethod
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


const removeLastDigit = () => {
    amount.value = amount.value.slice(0, -1);
};

const clearInput = () => {
    amount.value = "";
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