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
  <div>
    <button @click="handleVisible">change</button>
  </div>
  <Modal v-model:visible="modalVisible">
    <template #header>header-content</template>
    content
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button.vue';
import Input from './components/Input.vue';
import Modal from './components/Modal.vue';

const value = ref('')
const modalVisible = ref(false)

const handleVisible = () => {
  modalVisible.value = !modalVisible.value
}
</script>

<style scoped></style>