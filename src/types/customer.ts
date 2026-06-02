export interface Customer {
  id: number
  name: string
  phone: string
  email: string
  identityNumber: string
  birthday: string
  status?: string
}

export interface CreateCustomerRequest {
  name: string
  phone: string
  email: string
  identityNumber: string
  birthday: string
}
export type UpdateCustomerRequest = CreateCustomerRequest
