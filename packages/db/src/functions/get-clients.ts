import { desc } from 'drizzle-orm'
import { db } from '..'
import { client } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import type { Client } from '../validators/client'

export async function getClientsDB(): AsyncReturnFunction<Client[]> {
  const clients = await db.select().from(client).orderBy(desc(client.createdAt))

  if (!clients) {
    return [null, new Error('Failed to fetch clients')] as const
  }

  return [clients, null] as const
}
