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
  <hr>
  <Tab v-model="activeName" @tab-click="handleClick">
    <TabPane label="User" name="first">User 内容</TabPane>
    <TabPane label="Config" name="second">Config 内容</TabPane>
    <TabPane label="Role" name="third">Role 内容</TabPane>
    <TabPane label="Task" name="fourth">Task 内容</TabPane>
  </Tab>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabPaneProps } from './components/Tab.vue';
import Button from './components/Button.vue';
import Input from './components/Input.vue';
import Modal from './components/Modal.vue';
import Tab from './components/Tab.vue';
import TabPane from './components/TabPane.vue';

const value = ref('')
const modalVisible = ref(false)
const activeName = ref('first')

const handleVisible = () => {
  modalVisible.value = !modalVisible.value
}
const handleClick = (pane: TabPaneProps) => {
  console.log(pane)
}
</script>

<style scoped></style>