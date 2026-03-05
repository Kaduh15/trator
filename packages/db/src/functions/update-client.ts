import { eq } from 'drizzle-orm'
import { db } from '..'
import { client } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import {
  type Client,
  type UpdateClientInput,
  updateClientSchema,
} from '../validators/client'

interface UpdateClientParams {
  clientId: Client['id']
  input: UpdateClientInput
}

export async function updateClientDB({
  clientId,
  input,
}: UpdateClientParams): AsyncReturnFunction<Client> {
  const validation = updateClientSchema.safeParse(input)

  if (!validation.success) {
    return [null, validation.error] as const
  }

  const [clientResult] = await db
    .select()
    .from(client)
    .where(eq(client.id, clientId))

  if (!clientResult) {
    return [null, new Error('Client not found')] as const
  }

  const [updatedClient] = await db
    .update(client)
    .set(input)
    .where(eq(client.id, clientId))
    .returning()

  if (!updatedClient) {
    return [null, new Error('Client not updated')] as const
  }

  return [updatedClient, null] as const
}
