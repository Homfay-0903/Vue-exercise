<template>
    <div class="tabs">
        <div class="tabs-header">
            <div class="tab-item" :class="{ active: activeName === pane.name }" v-for="pane in paneList"
                :key="pane.name" @click="handleTabClick(pane)">
                {{ pane.label }}
            </div>
        </div>
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, provide, useSlots } from 'vue'


export interface TabPaneProps {
    label: string
    name: string
}

interface Prop {
    modelValue: string
}

interface Emit {
    'update:modelValue': [name: string]
    'tab-click': [pane: TabPaneProps]
}

const props = defineProps<Prop>()
const emits = defineEmits<Emit>()

const activeName = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
})

provide('tabsContext', { activeName })

const slots = useSlots();
const paneList = computed(() => {
    const children: TabPaneProps[] = [];
    // 获取默认插槽里的所有组件
    const defaultSlots = slots.default?.() || [];

    const walk = (nodes: any[]) => {
        nodes.forEach((node) => {
            if (node.type?.__name === 'TabPane') {
                children.push(node.props);
            }
            // 递归查找
            if (node.children && Array.isArray(node.children)) {
                walk(node.children);
            }
        });
    };

    walk(defaultSlots);
    return children;
});

const handleTabClick = (pane: TabPaneProps) => {
    activeName.value = pane.name
    emits('tab-click', pane)
}
</script>

<style scoped>
.tabs {
    width: 100%;
}

.tabs-header {
    display: flex;
    border-bottom: 1px solid #e4e7ed;
}

.tab-item {
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.tab-item.active {
    color: #409eff;
    border-bottom: 2px solid #409eff;
}

.tabs-content {
    padding: 16px 0;
    color: #e4e7ed;
}
</style>