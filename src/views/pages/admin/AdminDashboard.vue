<script setup>
import { inject } from 'vue';
import ProfileCard from './ProfileCard.vue';
import AdminProfile from './AdminProfile.vue'
import AdminLayout from './AdminLayout.vue';

// Inject theme
const theme = inject('theme');


</script>

<template>
  <AdminLayout> 


      <ProfileCard/>
      <AdminProfile/>

  </AdminLayout>

                       


                
</template>
