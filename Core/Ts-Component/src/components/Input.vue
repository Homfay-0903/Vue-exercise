<template>
    <div>
        <input type="text" v-model="inputValue" :placeholder="placeholder" :disabled="disabled" @input="handleInput">
        <span v-if="inputValue && clearable && !disabled" @click="handleClear">x</span>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Input {
    modelValue: string
    clearable?: boolean
    disabled?: boolean
    placeholder?: string
}

const props = withDefaults(defineProps<Input>(), {
    clearable: false,
    disabled: false,
    placeholder: 'please input'
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
}>()

const inputValue = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})

const handleClear = () => {
    emits('update:modelValue', '')
}

const handleInput = () => { }
</script>

<style scoped></style>