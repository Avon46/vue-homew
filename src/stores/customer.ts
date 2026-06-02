import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  createCustomer as createCustomerApi,
  deleteCustomer as deleteCustomerApi,
  getCustomers,
  updateCustomer as updateCustomerApi,
} from '@/api/customerApi'
import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
} from '@/types/customer'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const loading = ref(false)

  async function fetchCustomers() {
    loading.value = true

    try {
      customers.value = await getCustomers()
    } finally {
      loading.value = false
    }
  }

  async function createCustomer(request: CreateCustomerRequest) {
    await createCustomerApi(request)
    await fetchCustomers()
  }

  async function updateCustomer(
    id: number,
    request: UpdateCustomerRequest,
  ) {
    await updateCustomerApi(id, request)
    await fetchCustomers()
  }

  async function deleteCustomer(id: number) {
    await deleteCustomerApi(id)
    await fetchCustomers()
  }

  return {
    customers,
    loading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
})