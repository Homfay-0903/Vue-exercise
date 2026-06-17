<template>
    <div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue';

interface Props {
    model: Record<string, any>
    rules: Record<string, { required?: boolean, message: string }[]>
}

const props = defineProps<Props>()

const errorMsg = reactive<Record<string, string>>({})

provide('form', {
    errorMsg,
    rules: props.rules
})

const validate = () => {
    let pass = true

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

const clearError = (key: string) => { errorMsg[key] = '' }

const reset = () => {
    // 清空数据
    Object.keys(props.model).forEach(k => {
        props.model[k] = ''
    })
    // 清空错误
    Object.keys(errorMsg).forEach(k => {
        errorMsg[k] = ''
    })
}

defineExpose({ errorMsg, validate, clearError, reset })
</script>

<style scoped></style>