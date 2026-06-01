<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const password = ref('')
function handleLogin() {
  console.log('帳號：', username.value)
  console.log('密碼：', password.value)
}
</script>

<template>
  <h1>登入</h1>
  <p>帳號</p>
  <input v-model="username" placeholder="請輸入帳號" />
  <p>密碼</p>
  <input v-model="password" type="password" placeholder="請輸入密碼" />
  <button @click="handleLogin">登入</button>
</template>

<style scoped></style>
