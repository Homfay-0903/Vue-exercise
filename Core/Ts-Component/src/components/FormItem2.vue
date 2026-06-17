<template>
    <div>
        <div>
            <label v-if="label">{{ label }}</label>
            <span v-if="isRequired">*</span>
        </div>
        <div>
            <slot></slot>
            <div v-if="error">{{ error }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

interface Props {
    label?: string
    prop?: string
}

interface FormContext {
    errorMsg: Record<string, string>
    rules?: Record<string, { required?: boolean, message: string }[]>
}

const formContext = inject<FormContext>('form', {
    errorMsg: {},
    rules: undefined
})

const props = defineProps<Props>()

const isRequired = computed(() => {
    if (!props.prop || !formContext.rules) {
        return false
    }
    const rules = formContext.rules[props.prop]
    return rules?.some(rule => rule.required)
})

const error = computed(() => { return props.prop ? (formContext.errorMsg[props.prop] ?? '') : '' })
</script>

<style scoped></style>