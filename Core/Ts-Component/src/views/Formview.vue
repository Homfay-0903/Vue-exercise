<template>
    <Form ref="formRef" :model="form" :rules="rules">
        <FormItem label="账号" prop="username">
            <input v-model="form.username" @input="clearError('username')" />
        </FormItem>
        <FormItem label="密码" prop="password">
            <input v-model="form.password" @input="clearError('password')" />
        </FormItem>
        <button @click="submit">提交</button>
        <button @click="reset">重置</button>
    </Form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Form from '../components/Form2.vue'
import FormItem from '../components/FormItem2.vue'

const formRef = ref()
const form = reactive({
    username: '',
    password: ''
})
const rules = {
    username: [{ required: true, message: '账号不能为空' }],
    password: [{ required: true, message: '密码不能为空' }]
}

const submit = () => {
    const ok = formRef.value.validate()
    if (ok) console.log('提交成功', form)
}

const reset = () => {
    formRef.value.reset()
}

// 清除指定字段错误
const clearError = (key: string) => {
    formRef.value?.clearError(key)
}
</script>