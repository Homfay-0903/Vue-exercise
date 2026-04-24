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
  <hr>
  <List ref="listRef" @load-data="getData" />
  <hr>
  <Formview></Formview>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabPaneProps } from './components/Tab.vue';
import Button from './components/Button.vue';
import Input from './components/Input.vue';
import Modal from './components/Modal.vue';
import Tab from './components/Tab.vue';
import TabPane from './components/TabPane.vue';
import List from './components/List.vue';
import Formview from './views/Formview.vue';
import type { ListItem } from './components/List.vue';

const value = ref('')
const modalVisible = ref(false)
const activeName = ref('first')

const handleVisible = () => {
  modalVisible.value = !modalVisible.value
}
const handleClick = (pane: TabPaneProps) => {
  console.log(pane)
}

const listRef = ref<any>(null);//?
//const mockData = (page: number, size: number): ListItem[] => {
//  return Array.from({ length: size }, (_, i) => ({
//    id: (page - 1) * size + i + 1,
//    content: `列表项 ${(page - 1) * size + i + 1}`,
//  }));
//};

const mockData = (page: number, size: number): ListItem[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: (page - 1) * size + i + 1,
    content: `now is ${(page - 1) * size + i + 1}`
  }))
}

// 模拟请求
//const getData = async (page: number) => {
//  // 模拟接口延迟
//  await new Promise(resolve => setTimeout(resolve, 800));
//
//  const data = mockData(page, 10);
//  // 第5页后没有更多
//  const isLast = page >= 5;
//  listRef.value?.setList(data, isLast);
//};

const getData = async (page: number) => {
  await new Promise(reslove => setTimeout(reslove, 800))

  const data = mockData(page, 10)
  const isLast = page >= 5

  listRef.value.setList(data, isLast)
}
</script>

<style scoped></style>