import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import type z from 'zod'
import { client } from '../schema/clients'

export const createClientSchema = createInsertSchema(client).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})
export const selectClientSchema = createSelectSchema(client)
export const updateClientSchema = createUpdateSchema(client).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type Client = z.infer<typeof selectClientSchema>
