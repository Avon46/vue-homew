import axiosInstance from '@/api/axiosInstance'
import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '@/types/customer'

export async function getCustomers(): Promise<Customer[]> {
  const response = await axiosInstance.get<Customer[]>('/api/customers')

  return response.data
}

export async function createCustomer(request: CreateCustomerRequest): Promise<Customer> {
  const response = await axiosInstance.post<Customer>('/api/customers', request)

  return response.data
}

export async function updateCustomer(
  id: number,
  request: UpdateCustomerRequest,
): Promise<Customer> {
  const response = await axiosInstance.put<Customer>(`/api/customers/${id}`, request)

  return response.data
}

export async function deleteCustomer(id: number): Promise<void> {
  await axiosInstance.delete(`/api/customers/${id}`)
}
