<template>
    <button class="general-style" :class="aloneStyle">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

//interface Button {
//    type: string
//}

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value: string) => {
            return ['default', 'primary', 'success', 'danger'].includes(value)
        }
    }
})

const aloneStyle = computed(() => {
    return `alone-style-${props.type}`
})
</script>

<style scoped>
.general-style {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.alone-style-default {
    background-color: black;
}

.alone-style-primary {
    background-color: blue;
}

.alone-style-success {
    background-color: green;
}

.alone-style-danger {
    background-color: red;
}
</style>