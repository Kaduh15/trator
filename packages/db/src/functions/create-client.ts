import { db } from '..'
import { client } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import {
  type Client,
  type CreateClientInput,
  createClientSchema,
} from '../validators/client'

export async function createClientDB(
  input: CreateClientInput
): AsyncReturnFunction<Client> {
  const parsed = createClientSchema.safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [clientResult] = await db
    .insert(client)
    .values([
      {
        name: data.name,
        phone: data.phone,
      },
    ])
    .returning()

  if (!clientResult) {
    return [null, new Error('Failed to create client')] as const
  }

  return [clientResult, null] as const
}
