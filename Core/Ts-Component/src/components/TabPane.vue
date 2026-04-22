<template>
    <div v-show="active" class="tab-pane">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';

const tabsContext = inject<{ activeName: ComputedRef<string> }>('tabsContext')

interface Props {
    label: string
    name: string
}

const props = defineProps<Props>()

const active = computed(() => {
    return tabsContext?.activeName.value === props.name
})
</script>

<style scoped>
.tab-pane {
    padding: 16px 0;
    color: aliceblue;
}
</style>