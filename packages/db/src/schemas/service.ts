import z from 'zod'

export const serviceStatusSchema = z.enum(['open', 'done', 'canceled'])

export const servicePaymentSchema = z.object({
  id: z.uuidv7(),
  amountCents: z.number().int(),
  paidAt: z.date().nullable(),
})

export const serviceClientSchema = z.object({
  isAssociated: z.boolean(),
  id: z.uuidv7(),
  name: z.string(),
  phone: z.string().nullable(),
})

export const serviceListItemSchema = z.object({
  id: z.uuidv7(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  status: serviceStatusSchema,
  workedMinutes: z.number().int().min(0),
  totalAmountCents: z.number().int().min(0),
  client: serviceClientSchema.nullable(),
  payments: servicePaymentSchema.array(),
})

export const createServiceInputSchema = z.object({
  clientId: z.uuidv7(),
  description: z.string(),
  tractorUserId: z.string(),
})

export const createServiceResponseSchema = createServiceInputSchema.extend({
  id: z.uuidv7(),
  clientHourlyRateCents: z.number().int().min(0),
  tractorHourlyRateCents: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export const updateServiceInputSchema = z.object({
  serviceId: z.uuidv7(),
  workedMinutes: z.number(),
})

export const updateServiceResponseSchema = z.object({
  id: z.uuidv7(),
  clientId: z.uuidv7(),
  tractorUserId: z.string(),
  description: z.string().max(255),
  status: serviceStatusSchema,
  workedMinutes: z.number().int().min(0),
  clientHourlyRateCents: z.number().int().min(0),
  tractorHourlyRateCents: z.number().int().min(0),
  totalClientCents: z.number().int().nullable(),
  totalTractorCents: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type ServiceListItem = z.infer<typeof serviceListItemSchema>
export type ServicePayment = z.infer<typeof servicePaymentSchema>
export type ServiceClient = z.infer<typeof serviceClientSchema>
export type CreateServiceInput = z.infer<typeof createServiceInputSchema>
export type CreateServiceResponse = z.infer<typeof createServiceResponseSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>
export type UpdateServiceResponse = z.infer<typeof updateServiceResponseSchema>
