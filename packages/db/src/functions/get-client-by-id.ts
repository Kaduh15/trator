import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '..'
import { client } from '../schema'

export const getClientByIdInputSchema = z.object({
  id: z.uuidv7(),
})

export type GetClientByIdInput = z.infer<typeof getClientByIdInputSchema>

export async function getClientByIdDB(input: GetClientByIdInput) {
  const [clientResult] = await db
    .select()
    .from(client)
    .where(eq(client.id, input.id))

  if (!clientResult) {
    return [null, new Error('Client not found')] as const
  }

  return [clientResult, null] as const
}
