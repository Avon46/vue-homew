<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import CustomerForm from '@/components/customers/CustomerForm.vue'
import { useAuthStore } from '@/stores/auth'
import type {
    CreateCustomerRequest,
    Customer,
    UpdateCustomerRequest,
} from '@/types/customer'

const router = useRouter()
const authStore = useAuthStore()
const customerStore = useCustomerStore()
const { customers, loading } = storeToRefs(customerStore)


const errorMessage = ref('')

const showCreateForm = ref(false)
const creating = ref(false)

const editingCustomer = ref<Customer | null>(null)
const updatingId = ref<number | null>(null)

const deletingId = ref<number | null>(null)
async function fetchCustomers() {
    errorMessage.value = ''

    try {
        await customerStore.fetchCustomers()
    } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage.value = '無法連線到後端服務，請確認後端是否啟動'
                return
            }

            if (error.response.status === 500) {
                errorMessage.value = '後端系統發生錯誤，請稍後再試'
                return
            }
        }

        if (authStore.isAuthenticated) {
            errorMessage.value = '讀取客戶資料失敗，請稍後再試'
        }
    }
}
function openCreateForm() {
    editingCustomer.value = null
    showCreateForm.value = true
}

function openEditForm(customer: Customer) {
    showCreateForm.value = false
    editingCustomer.value = customer
}
async function handleCreateCustomer(request: CreateCustomerRequest) {
    creating.value = true
    errorMessage.value = ''

    try {
        await customerStore.createCustomer(request)
        showCreateForm.value = false
    } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage.value = '無法連線到後端服務，請確認後端是否啟動'
                return
            }

            if (error.response.status === 400) {
                errorMessage.value = '新增失敗，請確認輸入資料是否正確'
                return
            }

            if (error.response.status === 500) {
                errorMessage.value = '後端新增資料失敗，請檢查資料庫或後端程式'
                return
            }
        }

        errorMessage.value = '新增客戶失敗，請稍後再試'
    } finally {
        creating.value = false
    }
}
async function handleUpdateCustomer(request: UpdateCustomerRequest) {
    if (!editingCustomer.value) {
        return
    }

    const customerId = editingCustomer.value.id

    updatingId.value = customerId
    errorMessage.value = ''

    try {
        await customerStore.updateCustomer(customerId, request)
        editingCustomer.value = null
    } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage.value = '無法連線到後端服務，請確認後端是否啟動'
                return
            }

            if (error.response.status === 400) {
                errorMessage.value = '修改失敗，請確認輸入資料是否正確'
                return
            }

            if (error.response.status === 404) {
                errorMessage.value = '此客戶不存在，資料可能已被刪除'
                editingCustomer.value = null
                await fetchCustomers()
                return
            }

            if (error.response.status === 500) {
                errorMessage.value = '後端修改資料失敗，請稍後再試'
                return
            }
        }

        errorMessage.value = '修改客戶失敗，請稍後再試'
    } finally {
        updatingId.value = null
    }
}
async function handleDeleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
        `確定要刪除客戶「${customer.name}」嗎？`,
    )

    if (!confirmed) {
        return
    }

    deletingId.value = customer.id
    errorMessage.value = ''

    try {
        await customerStore.deleteCustomer(customer.id)
    } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage.value = '無法連線到後端服務，請確認後端是否啟動'
                return
            }

            if (error.response.status === 404) {
                errorMessage.value = '此客戶不存在，資料可能已被刪除'
                await fetchCustomers()
                return
            }

            if (error.response.status === 500) {
                errorMessage.value = '後端刪除資料失敗，請稍後再試'
                return
            }
        }

        errorMessage.value = '刪除客戶失敗，請稍後再試'
    } finally {
        deletingId.value = null
    }
}

function handleLogout() {
    authStore.logout()
    router.push('/login')
}

onMounted(() => {
    fetchCustomers()
})
</script>

<template>
    <main class="customer-page">
        <header class="header">
            <div>
                <p class="system-name">Customer Management System</p>
                <h1>客戶管理</h1>
            </div>

            <button class="logout-button" @click="handleLogout">登出</button>
        </header>

        <section class="content-card">
            <div class="section-header">
                <div>
                    <h2>客戶列表</h2>
                    <p>管理系統中的客戶基本資料</p>
                </div>

                <button class="create-button" @click="openCreateForm">
                    新增客戶
                </button>
            </div>

            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </p>

            <div v-if="loading" class="status-message">
                資料載入中...
            </div>

            <table v-else>
                <thead>
                    <tr>
                        <th>編號</th>
                        <th>姓名</th>
                        <th>電話</th>
                        <th>Email</th>
                        <th>生日</th>
                        <th>操作</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="customers.length === 0">
                        <td colspan="6" class="empty-message">
                            目前沒有客戶資料
                        </td>
                    </tr>

                    <tr v-for="customer in customers" :key="customer.id">
                        <td>{{ customer.id }}</td>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.phone }}</td>
                        <td>{{ customer.email }}</td>
                        <td>{{ customer.birthday }}</td>
                        <td>
                            <button class="edit-button"
                                :disabled="updatingId === customer.id || deletingId === customer.id"
                                @click="openEditForm(customer)">
                                {{ updatingId === customer.id ? '修改中...' : '修改' }}
                            </button>

                            <button class="delete-button" :disabled="deletingId === customer.id"
                                @click="handleDeleteCustomer(customer)">
                                {{ deletingId === customer.id ? '刪除中...' : '刪除' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- 新增客戶表單 -->
        <CustomerForm v-if="showCreateForm && !creating" mode="create" @submit="handleCreateCustomer"
            @cancel="showCreateForm = false" />

        <!-- 修改客戶表單 -->
        <CustomerForm v-if="editingCustomer && updatingId === null" mode="edit" :initial-data="editingCustomer"
            @submit="handleUpdateCustomer" @cancel="editingCustomer = null" />

        <!-- 新增處理中遮罩 -->
        <div v-if="creating" class="saving-overlay">
            <div class="saving-card">新增資料中...</div>
        </div>

        <!-- 修改處理中遮罩 -->
        <div v-if="updatingId !== null" class="saving-overlay">
            <div class="saving-card">修改資料中...</div>
        </div>
    </main>
</template>

<style scoped>
.customer-page {
    min-height: 100vh;
    padding: 32px 48px;
    background: #f3f6fb;
    font-family: Arial, sans-serif;
}

.header {
    max-width: 1100px;
    margin: 0 auto 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.system-name {
    margin: 0 0 8px;
    color: #2563eb;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 1px;
}

.header h1 {
    margin: 0;
    color: #0f172a;
}

.logout-button {
    padding: 10px 20px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: white;
    color: #334155;
    cursor: pointer;
}

.content-card {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 30px rgb(15 23 42 / 6%);
}

.section-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h2 {
    margin: 0 0 8px;
    color: #0f172a;
}

.section-header p {
    margin: 0;
    color: #64748b;
}

.create-button {
    padding: 11px 20px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

.error-message {
    margin: 0 0 20px;
    padding: 12px 16px;
    border-radius: 8px;
    background: #fef2f2;
    color: #dc2626;
}

.status-message {
    padding: 44px;
    color: #64748b;
    text-align: center;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    padding: 14px;
    border-bottom: 1px solid #e2e8f0;
    color: #475569;
    text-align: left;
    font-size: 14px;
}

td {
    padding: 18px 14px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
}

.empty-message {
    padding: 44px;
    color: #94a3b8;
    text-align: center;
}

.edit-button,
.delete-button {
    padding: 7px 12px;
    border-radius: 6px;
    background: white;
    cursor: pointer;
}

.edit-button {
    margin-right: 8px;
    border: 1px solid #2563eb;
    color: #2563eb;
}

.delete-button {
    border: 1px solid #dc2626;
    color: #dc2626;
}

.saving-overlay {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: rgb(15 23 42 / 35%);
}

.saving-card {
    padding: 20px 28px;
    border-radius: 12px;
    background: white;
    color: #334155;
    font-weight: bold;
}

.edit-button:disabled {
    border-color: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
}
</style>
