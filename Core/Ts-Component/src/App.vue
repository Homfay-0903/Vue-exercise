<template>
  <div>
    <Button type="default">1</Button>
    <Button type="primary">2</Button>
    <Button type="success">3</Button>
    <Button type="danger">4</Button>
    <Button>5</Button>
  </div>
  <div>
    <Input v-model="value" clearable></Input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button.vue';
import Input from './components/Input.vue';

const value = ref('')
</script>

<style scoped></style>