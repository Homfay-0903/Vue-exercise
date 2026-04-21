<template>
    <div v-if="visible" class="modal-mask" @click.self="handleClose">
        <div class="modal-content">
            <div class="modal-header">
                <slot name="header">default header</slot>
                <button class="close-btn" @click="handleClose">x</button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <slot name="foot">
                    <button @click="handleClose">close</button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

interface Modal {
    visible: boolean
}

const props = defineProps<Modal>()

const emits = defineEmits<{
    'update:visible': [value: boolean]
}>()

const handleClose = () => {
    emits('update:visible', false)
}
</script>

<style scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: red;
    background: rgba(27, 13, 213, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-content {
    background: #fff;
    width: 400px;
    border-radius: 4px;
    overflow: hidden;
}

.modal-header {
    padding: 12px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 12px;
    border-top: 1px solid #eee;
    text-align: right;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: red;
    font-size: 16px;
}
</style>