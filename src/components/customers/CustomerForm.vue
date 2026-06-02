<script setup lang="ts">
import { reactive } from 'vue'
import type {
    CreateCustomerRequest,
    Customer,
} from '@/types/customer'

const props = withDefaults(
    defineProps<{
        mode?: 'create' | 'edit'
        initialData?: Customer | null
    }>(),
    {
        mode: 'create',
        initialData: null,
    },
)

const emit = defineEmits<{
    submit: [request: CreateCustomerRequest]
    cancel: []
}>()

const form = reactive<CreateCustomerRequest>({
    name: props.initialData?.name ?? '',
    phone: props.initialData?.phone ?? '',
    email: props.initialData?.email ?? '',
    identityNumber: props.initialData?.identityNumber ?? '',
    birthday: props.initialData?.birthday ?? '',
})

function handleSubmit() {
    emit('submit', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        identityNumber: form.identityNumber.trim(),
        birthday: form.birthday,
    })
}
</script>

<template>
    <div class="overlay">
        <section class="form-card">
            <div class="form-header">
                <div>
                    <p class="form-label">
                        {{ props.mode === 'edit' ? 'EDIT CUSTOMER' : 'NEW CUSTOMER' }}
                    </p>

                    <h2>
                        {{ props.mode === 'edit' ? '修改客戶' : '新增客戶' }}
                    </h2>
                </div>

                <button class="close-button" type="button" @click="emit('cancel')">
                    ×
                </button>
            </div>

            <form class="customer-form" @submit.prevent="handleSubmit">
                <div class="field">
                    <label for="name">姓名</label>
                    <input id="name" v-model="form.name" type="text" placeholder="請輸入姓名" required />
                </div>

                <div class="field">
                    <label for="phone">電話</label>
                    <input id="phone" v-model="form.phone" type="text" placeholder="例如：0912345678" required />
                </div>

                <div class="field">
                    <label for="email">Email</label>
                    <input id="email" v-model="form.email" type="email" placeholder="例如：customer@example.com"
                        required />
                </div>

                <div class="field">
                    <label for="identityNumber">身分證字號</label>
                    <input id="identityNumber" v-model="form.identityNumber" type="text" placeholder="例如：A123456789"
                        required />
                </div>

                <div class="field">
                    <label for="birthday">生日</label>
                    <input id="birthday" v-model="form.birthday" type="date" required />
                </div>

                <div class="actions">
                    <button class="cancel-button" type="button" @click="emit('cancel')">
                        取消
                    </button>

                    <button class="submit-button" type="submit">
                        {{ props.mode === 'edit' ? '確認修改' : '確認新增' }}
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background: rgb(15 23 42 / 45%);
}

.form-card {
    width: 100%;
    max-width: 520px;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    padding: 28px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 20px 50px rgb(15 23 42 / 20%);
}

.form-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.form-label {
    margin: 0 0 6px;
    color: #2563eb;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
}

.form-header h2 {
    margin: 0;
    color: #0f172a;
}

.close-button {
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 28px;
    cursor: pointer;
}

.customer-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field label {
    color: #334155;
    font-size: 14px;
    font-weight: bold;
}

.field input {
    padding: 12px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

.field input:focus {
    border-color: #2563eb;
    outline: none;
}

.actions {
    position: sticky;
    bottom: -28px;
    margin: 14px -28px -28px;
    padding: 16px 28px 28px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: white;
}

.cancel-button,
.submit-button {
    padding: 11px 18px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.cancel-button {
    border: 1px solid #cbd5e1;
    background: white;
    color: #475569;
}

.submit-button {
    border: none;
    background: #2563eb;
    color: white;
}
</style>