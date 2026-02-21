import z from 'zod'
import { db } from '..'
import { client } from '../schema'

export const createClientInputSchema = z.object({
  name: z.string().min(3),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{0,14}$/)
    .optional()
    .nullable(),
})

export type CreateClientInput = z.infer<typeof createClientInputSchema>

export async function createClientDB(input: CreateClientInput) {
  const [clientResult] = await db
    .insert(client)
    .values([
      {
        name: input.name,
        phone: input.phone,
      },
    ])
    .returning()

  if (!clientResult) {
    return [null, new Error('Failed to create client')] as const
  }

  return [clientResult, null] as const
}
