<script setup>
import AdminLayout from './AdminLayout.vue';
import AddExpense from './AddExpense.vue'
import { ref, onMounted, computed, inject } from 'vue';
import axios from 'axios';
import api from '../../../api';
import { useAuthStore } from '../../../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const expenses = ref([]);
const loading = ref(true);
const error = ref(null);
const showExpenseModal = ref(false)
const currentPage = ref(1);
const itemsPerPage = 5;
const isEditModalOpen = ref(false);
const editingExpense = ref(null);

const theme = inject('theme', ref('light'));

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const fetchExpenses = async () => {
  try {
    const authToken = authStore.token;
    if (!authToken) {
      alert("You need to log in first.");
      router.push('/signin');
      return;
    }
    const response = await axios.get(`${api.baseURL}/expenses`, {
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
    });
    expenses.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch expenses';
  } finally {
    loading.value = false;
  }
};

const openEditModal = (expense) => {
  editingExpense.value = { ...expense };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingExpense.value = null;
};

const updateExpense = async () => {
  try {
    await axios.put(`${api.baseURL}/expenses/${editingExpense.value.id}`, editingExpense.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    fetchExpenses();
    closeEditModal();
  } catch (err) {
    alert('Failed to update expense');
  }
};

const deleteExpense = async (id) => {
  try {
    await axios.delete(`${api.baseURL}/expenses/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    expenses.value = expenses.value.filter(expense => expense.id !== id);
  } catch (err) {
    alert('Failed to delete expense');
  }
};

onMounted(fetchExpenses);

const totalPages = computed(() => Math.ceil(expenses.value.length / itemsPerPage));
const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return expenses.value.slice(start, start + itemsPerPage);
});
</script>


<template>
    <AdminLayout>
        <section class="py-8 md:py-16"
            :class="theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-200'">
            <div class="max-w-screen-xl mx-auto px-4">
                <h2 class="text-2xl font-semibold">Business Expenses</h2>
                <!-- Buttons -->
                <div class="flex flex-wrap justify-end gap-4 mb-4">
                    <button @click="showExpenseModal = true" class="px-4 py-2 rounded w-full sm:w-auto"
                        :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }">
                        + Add Expense
                    </button>
                    <!-- <button @click="showCategoryModal = true"
                class="px-4 py-2 rounded w-full sm:w-auto"
                :class="{ 'bg-blue-500 text-white': theme === 'light', 'bg-blue-400 text-black': theme === 'dark' }">
                + Add Category
              </button> -->

                </div>


                <AddExpense v-if="showExpenseModal" :isOpen="showExpenseModal" title="Add Expense"
                    @close="showExpenseModal = false" />
                <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-4">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-4 py-2 border rounded-md  bg-blue-200 hover:bg-gray-300 disabled:opacity-50 hover:scale-105 transition-transform">Prev</button>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-4 py-2 border rounded-md  bg-blue-200 hover:bg-gray-300 disabled:opacity-50 hover:scale-105 transition-transform">Next</button>
                </div>

                <div v-if="loading" class="flex justify-center items-center">
                    <div aria-label="Loading..." role="status" class="flex items-center space-x-2">
                        <svg class="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                            <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="24"></line>
                            <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="24"></line>
                            <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="24"></line>
                            <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                        </svg>
                        <span class="text-4xl font-medium text-gray-500">Loading...</span>
                    </div>
                </div>
                <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
                <div v-else class=" gap-6 mx-auto sm:grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
                    <div v-for="expense in paginatedExpenses" :key="expense.id"
                        class="border-gray-300 rounded-lg p-6 shadow-md flex justify-between" :class="theme">
                     <div class="py-2 flex px-2 gap-2">
                        <p class="text-lg font-bold px-3">{{ expense.name }} - Ksh.{{ expense.price }}</p>
                        <p class="text-lg font-bold">purchased on : {{ formatDate(expense.created_at) }}</p>
                        <div class="pl-64 md:pl-16 sm:pl-8 ">
                           <div class="flex">
                            <button @click="openEditModal(expense)"
                                class="px-4 py-2 bg-blue-500 text-white rounded-md">Edit</button>
                            <button @click="deleteExpense(expense.id)"
                                class="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
                           </div>
                        </div>
                     </div>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-md">
                <h3 class="text-xl font-semibold mb-4">Edit Expense</h3>
                <input v-model="editingExpense.name" class="border p-2 w-full mb-4" placeholder="Expense Name" />
                <input v-model="editingExpense.price" type="number" class="border p-2 w-full mb-4"
                    placeholder="Price" />
                <div class="flex justify-end gap-2">
                    <button @click="closeEditModal" class="px-4 py-2 border rounded-md">Cancel</button>
                    <button @click="updateExpense" class="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

