import { eq } from 'drizzle-orm'
import { db } from '..'
import { client } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import type { Client } from '../validators/client'

export async function getClientByIdDB(
  clientId: Client['id']
): AsyncReturnFunction<Client> {
  const [clientResult] = await db
    .select()
    .from(client)
    .where(eq(client.id, clientId))

  if (!clientResult) {
    return [null, new Error('Client not found')] as const
  }

  return [clientResult, null] as const
}
