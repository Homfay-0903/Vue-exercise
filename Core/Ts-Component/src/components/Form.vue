<template>
    <div class="form-wrap">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { reactive, provide } from 'vue'

// 入参
const props = defineProps<{
    model: Record<string, any>
    rules?: Record<string, { required?: boolean; message: string }[]>
}>()

// 错误信息
const errorMsg = reactive<Record<string, string>>({})

// 提供给子组件
provide('form', {
    errorMsg,
    rules: props.rules
})

// 整体校验
const validate = () => {
    let pass = true
    // 遍历所有规则
    Object.entries(props.rules || {}).forEach(([key, rules]) => {
        const val = props.model[key]
        rules.forEach(rule => {
            if (rule.required && !val) {
                errorMsg[key] = rule.message
                pass = false
            } else if (val) {
                errorMsg[key] = ''
            }
        })
    })
    return pass
}

// 清除指定字段错误
const clearError = (key: string) => {
    errorMsg[key] = ''
}

// 重置
const reset = () => {
    // 清空数据
    Object.keys(props.model).forEach(k => {
        props.model[k] = ''
    })
    // 清空错误
    Object.keys(errorMsg).forEach(k => errorMsg[k] = '')
}

// 暴露方法
defineExpose({ validate, reset, clearError, errorMsg })
</script>