<template>
    <div class="form-item">
        <label v-if="label">
            {{ label }}
            <span v-if="isRequired">*</span>
        </label>
        <div class="content">
            <slot></slot>
            <div class="error" v-if="error">{{ error }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

interface formContext {
    errorMsg: Record<string, string>
    rules?: Record<string, { required?: boolean; message: string }[]>
}

const props = defineProps<{
    label?: string
    prop?: string
}>()

// 注入父组件提供的表单上下文
const formContext = inject<formContext>('form', {
    errorMsg: {},
    rules: undefined
})

// 接收父组件透传的错误
const error = computed(() => {
    return props.prop ? (formContext.errorMsg[props.prop] ?? '') : ''
})

// 判断是否必填
const isRequired = computed(() => {
    if (!props.prop || !formContext.rules) return false
    const rules = formContext.rules[props.prop]
    return rules?.some(rule => rule.required)
})
</script>

<style scoped>
.form-item {
    margin-bottom: 16px;
}

.error {
    color: red;
    font-size: 12px;
}
</style>