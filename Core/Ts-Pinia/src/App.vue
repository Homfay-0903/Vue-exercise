<template>
  <UserProfile></UserProfile>
  <hr>
  <ShopDemo></ShopDemo>
</template>

<script setup lang="ts">
import UserProfile from './components/UserProfile.vue';
import ShopDemo from './components/ShopDemo.vue';
import { setupUserStoreListener } from './utils/listeners';
import { onMounted } from 'vue';

onMounted(() => {
  setupUserStoreListener()
})
</script>

<style scoped></style>