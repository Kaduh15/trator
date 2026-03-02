import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import type z from 'zod'
import { client, servicePayment } from '../schema'
import { service } from '../schema/service'

export const createServiceSchema = createInsertSchema(service).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  finishedAt: true,
})
export const selectServiceSchema = createSelectSchema(service)

export const selectServiceWithClientAndPaymentsSchema = createSelectSchema(
  service
)
  .omit({
    clientId: true,
  })
  .extend({
    client: createSelectSchema(client).omit({
      createdAt: true,
      updatedAt: true,
    }),
    payments: createSelectSchema(servicePayment).array(),
  })

export const updateServiceSchema = createUpdateSchema(service).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export type Service = z.infer<typeof selectServiceSchema>
export type ServiceWithClientAndPayments = z.infer<
  typeof selectServiceWithClientAndPaymentsSchema
>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
