<template>
    <div :class="theme" class="min-h-screen flex items-center justify-center p-6 transition">
        <div class="w-full max-w-xl space-y-8">
            <!-- Change Password Section -->
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition">
                <h2 class="text-lg font-semibold text-black dark:text-white">Change password</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Update your password associated with your account.
                </p>

                <form @submit.prevent="changePassword" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 dark:text-gray-300 text-sm">Current password</label>
                        <input v-model="currentPassword" type="password"
                            class="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 dark:text-gray-300 text-sm">New password</label>
                        <input v-model="newPassword" type="password"
                            class="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 dark:text-gray-300 text-sm">Confirm password</label>
                        <input v-model="confirmPassword" type="password"
                            class="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Save
                    </button>
                </form>
            </div>

            <!-- Log Out Other Sessions -->
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition">
                <h2 class="text-lg font-semibold text-black dark:text-white">Log out other sessions</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Enter your password to log out from all other sessions.
                </p>

                <form @submit.prevent="logoutSessions">
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 text-sm">Your password</label>
                        <input v-model="logoutPassword" type="password"
                            class="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Log out other sessions
                    </button>
                </form>
            </div>

            <!-- Delete Account -->
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition">
                <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    This action is irreversible. Enter your password to confirm.
                </p>

                <form @submit.prevent="confirmDelete">
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 text-sm">Your password</label>
                        <input v-model="deletePassword" type="password"
                            class="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    <button type="button" @click="confirmDelete"
                        class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                        Delete Account
                    </button>
                </form>
            </div>

            <!-- Delete Confirmation Modal -->
            <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 class="text-lg font-semibold text-black dark:text-white">Are you sure?</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        This action cannot be undone. Your account will be permanently deleted.
                    </p>

                    <div class="flex justify-end space-x-4">
                        <button @click="showDeleteModal = false"
                            class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
                            Cancel
                        </button>
                        <button @click="deleteAccount"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Confirm Delete
                        </button>
                    </div>
                </div>


            </div>
        </div>
        </div>
</template>

<script setup>
  import { ref, inject } from "vue";
  import axios from 'axios'
  import api from "../../../../api";
  import { useAuthStore } from "../../../../store/auth";
  
  // Inject theme from parent provider
  const theme = inject("theme");
  
 // Form fields
 const currentPassword = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");
  const logoutPassword = ref("");
  const deletePassword = ref("");
const authStore = useAuthStore()

const authToken = authStore.token
  
const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await axios.post('/change-password', {
            current_password: currentPassword.value,
            new_password: newPassword.value,
            new_password_confirmation: confirmPassword.value // Correct field name!
        }, 
        { 
            headers: {
                Authorization: `Bearer ${authToken}`, 
                Accept: 'application/json',
            },
            withCredentials: true 
        });

        alert(response.data.message);
    } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
    }
};


// Log Out Other Sessions
const logoutSessions = async () => {
    try {
        const response = await axios.post('/logout-other-sessions', {
            password: logoutPassword.value
        }, {
         headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },withCredentials: true });
        
        alert(response.data.message);
    } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
    }
};

// Confirm Delete Account
const confirmDelete = () => {
    showDeleteModal.value = true;
};

// Delete Account
const deleteAccount = async () => {
    try {
        const response = await axios.post('/delete-account', {
            password: deletePassword.value
        }, { 
        headers: {
        Authorization: `Bearer ${authToken}`, // Ensure the correct format
        Accept: 'application/json', // Sometimes required for Laravel-based APIs
      },
        withCredentials: true });
        
        alert(response.data.message);
        showDeleteModal.value = false;
    } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
    }
};
  </script>
  
  <style>
  /* Light/Dark Theme Handling */
  .light {
    background-color: #f3f4f6;
    color: black;
  }
  
  .dark {
    background-color: #111827;
    color: white;
  }
  </style>
  