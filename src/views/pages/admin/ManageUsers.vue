<template>

    <AdminLayout>

        <div class="p-6">

            <div class="md:flex md:items-center md:justify-between mb-4">

                <div class="mb-2 md:mb-0">

                    <h1 class="text-xl font-semibold text-gray-900">Manage Users</h1>

                </div>

                <button

                    type="button"

                    @click="isCreateUserModalVisible = true"

                    class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"

                >

                    <svg class="w-4 h-4 mr-2 -ml-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>

                    </svg>

                    Add new user

                </button>

            </div>


            <div class="bg-white rounded-lg shadow p-4 md:p-6">

                <div class="mb-4 md:flex md:items-center md:justify-between">

                    <div class="flex items-center mb-2 md:mb-0">

                        <div class="relative w-full md:w-auto mr-2">

                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">

                                <svg class="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>

                                </svg>

                            </div>

                            <input

                                type="text"

                                id="search-input"

                                v-model="searchQuery"

                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"

                                placeholder="Search users..."

                            />

                        </div>

                        <div class="flex items-center space-x-2 mr-4">

                            <div class="flex items-center">

                                <input id="search-name" type="checkbox" v-model="searchBy.name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">

                                <label for="search-name" class="ml-2 text-sm font-medium text-gray-900">Name</label>

                            </div>

                            <div class="flex items-center">

                                <input id="search-email" type="checkbox" v-model="searchBy.email" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">

                                <label for="search-email" class="ml-2 text-sm font-medium text-gray-900">Email</label>

                            </div>

                            <div class="flex items-center">

                                <input id="search-phone" type="checkbox" v-model="searchBy.phoneNumber" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">

                                <label for="search-phone" class="ml-2 text-sm font-medium text-gray-900">Phone</label>

                            </div>

                        </div>

                        <div class="mr-2">

                            <select v-model="selectedRole" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">

                                <option value="">All Roles</option>

                                <option value="customer">Customer</option>

                                <option value="admin">Admin</option>

                                <option value="staff">Staff</option>

                            </select>

                        </div>

                        <div>

                            <button @click="fetchFilteredUsers" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300">

                                Search

                            </button>

                        </div>

                    </div>

                    <div class="flex items-center">

                        <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5" type="button">

                            Actions

                            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">

                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>

                            </svg>

                        </button>

                        <div id="actionsDropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36">

                            <ul class="py-2 text-sm text-gray-700" aria-labelledby="actionsDropdownButton">

                                <li>

                                    <button type="button" id="archiveAllUsersButton" data-modal-target="archiveAllUsersModal" data-modal-toggle="archiveAllUsersModal" class="block px-4 py-2 hover:bg-gray-100 w-full text-left">

                                        <svg class="w-4 h-4 mr-2 -ml-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">

                                            <path fill-rule="evenodd" d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>

                                            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z"/>

                                        </svg>

                                        Archive all

                                    </button>

                                </li>

                                <li>

                                    <button type="button" id="deleteAllUsersButton" data-modal-target="deleteAllUsersModal" data-modal-toggle="deleteAllUsersModal" class="block px-4 py-2 hover:bg-gray-100 w-full text-left">

                                        <svg class="w-4 h-4 mr-2 -ml-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">

                                            <path fill-rule="evenodd" d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>

                                            </svg>

                                            Delete all

                                        </button>

                                    </li>

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="overflow-x-auto">

                    <table class="min-w-full text-left text-sm font-light">

                        <thead class="border-b font-medium dark:border-neutral-500">

                            <tr>

                                <th scope="col" class="px-4 py-2">Select</th>

                                <th scope="col" class="px-4 py-2">User</th>

                                <th scope="col" class="px-4 py-2">Role</th>

                                <th scope="col" class="px-4 py-2">Email</th>

                                <th scope="col" class="px-4 py-2">Phone</th>

                                <th scope="col" class="px-4 py-2">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr v-for="user in users" :key="user.id" class="border-b dark:border-neutral-500 hover:bg-gray-50">

                                <td class="px-4 py-2">

                                    <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />

                                </td>

                                <td class="px-4 py-2 flex items-center space-x-2">

                                    <img :src="user.avatar" alt="User avatar" class="w-8 h-8 rounded-full" />

                                    <span>{{ user.name }}</span>

                                </td>

                                <td class="px-4 py-2">{{ user.role }}</td>

                                <td class="px-4 py-2">{{ user.email }}</td>

                                <td class="px-4 py-2">{{ user.phone }}</td>

                                <td class="px-4 py-2">

                                    <button class="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">Edit</button>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <div class="mt-4 flex items-center justify-between">

                    <button

                        type="button"

                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100"

                    >

                        Download CSV

                    </button>

                    <p class="text-sm text-gray-700">

                        Total users: <span class="font-semibold">{{ users.length }}</span>

                    </p>

                </div>

            </div>


            <Teleport to="body">
    <div v-if="isCreateUserModalVisible" id="createUserModal" class="relative z-50">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                                    Add New User
                                </h3>
                                <div class="mt-2">
                                    <form @submit.prevent="createUser">
                                        <div class="mb-4">
                                            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                            <input v-model="newUser.name" type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="mb-4">
                                            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                            <input v-model="newUser.email" type="email" id="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="mb-4">
                                            <label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                                            <input v-model="newUser.phone" type="text" id="phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="mb-4">
                                            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                            <input v-model="newUser.password" type="password" id="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        </div>
                                        <div class="mb-4">
                                            <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                            <select v-model="newUser.role" id="role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                <option disabled>select a role</option>
                                                <option value="admin">Admin</option>
                                                <option value="staff">Staff</option>
                                            </select>
                                        </div>
                                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                                                Add User
                                            </button>
                                            <button @click="isCreateUserModalVisible = false" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Teleport>


    </AdminLayout>

</template>


<script setup>

import AdminLayout from './AdminLayout.vue';

import { ref, onMounted } from 'vue';

//import axios from 'axios';

import { useAuthStore } from '../../../store/auth';

import api from '../../../api';


const users = ref([]);

const authStore = useAuthStore();

const searchQuery = ref('');

const searchBy = ref({

    name: true,

    email: false,

    phoneNumber: false,

});

const selectedRole = ref('');

const isCreateUserModalVisible = ref(false);

const newUser = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '' // Setting a default role
});

const fetchUsers = async () => {

    const authToken = authStore.token;

    try {

        const response = await api.get('/users', {

            headers: {

                Authorization: `Bearer ${authToken}`,

                Accept: 'application/json',

            },

            withCredentials: true,

        });

        console.log('Initial users data:', response.data);

        users.value = response.data;

    } catch (error) {

        console.error('Error fetching users:', error);

    }

};


const fetchFilteredUsers = async () => {

    const authToken = authStore.token;

    try {

        const params = new URLSearchParams();

        if (searchQuery.value) {

            params.append('query', searchQuery.value);

            if (searchBy.value.name) params.append('searchByName', 'true');

            if (searchBy.value.email) params.append('searchByEmail', 'true');

            if (searchBy.value.phoneNumber) params.append('searchByPhone', 'true');

        }

        if (selectedRole.value) {

            params.append('role', selectedRole.value);

        }


        const response = await api.get(`/users/search?${params.toString()}`, {

            headers: {

                Authorization: `Bearer ${authToken}`,

                Accept: 'application/json',

            },

            withCredentials: true,

        });

        users.value = response.data;

    } catch (error) {

        console.error('Error fetching filtered users:', error);

    }

};


const createUser = async () => {

    const authToken = authStore.token;

    try {

        const response = await api.post('/register', newUser.value, {

            headers: {

                Authorization: `Bearer ${authToken}`,

                Accept: 'application/json',

            },

            withCredentials: true,

        });

        console.log('User created:', response.data);

        // Optionally, you can reset the form and close the modal

        newUser.value = {

            role: 'staff',

            username: '',

            email: '',

            password: '',

            locations: ''

        };

        isCreateUserModalVisible.value = false;

        // Refresh the user list

        fetchUsers();

    } catch (error) {

        console.error('Error creating user:', error);

        // Handle error messages here

    }

};


onMounted(fetchUsers);

</script> 