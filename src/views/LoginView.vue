<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref(
    route.query.reason === 'expired'
        ? '登入狀態已失效，請重新登入'
        : '',
)
const loading = ref(false)



async function handleLogin() {
    errorMessage.value = ''
    loading.value = true

    try {
        await authStore.login(username.value, password.value)
        await router.push('/customers')
    } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage.value = '無法連線到後端服務，請確認後端是否啟動'
                return
            }

            if (error.response.status === 401) {
                errorMessage.value = '登入失敗，請確認帳號或密碼'
                return
            }
        }

        errorMessage.value = '系統發生錯誤，請稍後再試'
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <main class="login-page">
        <section class="login-card">
            <div class="title-area">
                <p class="system-name">Customer Management System</p>
                <h1>會員登入</h1>
                <p class="description">請輸入帳號與密碼以進入客戶管理系統</p>
            </div>

            <form class="login-form" @submit.prevent="handleLogin">
                <label for="username">帳號</label>
                <input id="username" v-model="username" type="text" placeholder="請輸入帳號" required />

                <label for="password">密碼</label>
                <input id="password" v-model="password" type="password" placeholder="請輸入密碼" required />

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <button type="submit" :disabled="loading">
                    {{ loading ? '登入中...' : '登入' }}
                </button>
            </form>
        </section>
    </main>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #f3f6fb;
    font-family: Arial, sans-serif;
}

.login-card {
    width: 400px;
    padding: 40px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 30px rgb(15 23 42 / 8%);
}

.system-name {
    margin: 0 0 12px;
    color: #2563eb;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 1px;
}

.title-area h1 {
    margin: 0 0 10px;
    color: #0f172a;
    font-size: 28px;
}

.description {
    margin: 0 0 30px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.login-form label {
    margin-top: 8px;
    color: #334155;
    font-size: 14px;
    font-weight: bold;
}

.login-form input {
    padding: 13px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 15px;
}

.login-form input:focus {
    border-color: #2563eb;
    outline: none;
}

.login-form button {
    margin-top: 20px;
    padding: 14px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
}

.login-form button:hover {
    background: #1d4ed8;
}

.error-message {
    margin: 10px 0 0;
    color: #dc2626;
    font-size: 14px;
}

.login-form button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}
</style>