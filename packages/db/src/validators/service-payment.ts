import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import type z from 'zod'
import { servicePayment } from '../schema/service-payment'

export const createServicePaymentSchema = createInsertSchema(servicePayment)
export const selectServicePaymentSchema = createSelectSchema(servicePayment)
export const updateServicePaymentSchema = createUpdateSchema(servicePayment)

export type ServicePayment = z.infer<typeof selectServicePaymentSchema>
export type CreateServicePaymentInput = z.infer<
  typeof createServicePaymentSchema
>
export type UpdateServicePaymentInput = z.infer<
  typeof updateServicePaymentSchema
>
