import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { client, rateSetting, service } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import {
  type CreateServiceInput,
  createServiceSchema,
  type Service,
} from '../validators/service'

export const createServiceDB = async (
  input: Pick<CreateServiceInput, 'description' | 'clientId' | 'tractorUserId'>
): AsyncReturnFunction<Service> => {
  const parsed = createServiceSchema
    .pick({ description: true, clientId: true, tractorUserId: true })
    .safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [clientResult] = await db
    .select()
    .from(client)
    .where(eq(client.id, data.clientId))

  if (!clientResult) {
    return [null, new Error('Client not found')] as const
  }

  const [reteSetting] = await db
    .select()
    .from(rateSetting)
    .orderBy(desc(rateSetting.createdAt))
    .limit(1)

  if (!reteSetting) {
    return [null, new Error('No rate setting found')] as const
  }

  const clientHourlyRateCents = clientResult.isAssociated
    ? reteSetting.clientAssociateHourlyRate
    : reteSetting.clientNonAssociateHourlyRate

  const [result] = await db
    .insert(service)
    .values({
      clientId: clientResult.id,
      clientHourlyRateCents,
      tractorHourlyRateCents: reteSetting.tractorHourlyRate,
      description: data.description,
      tractorUserId: data.tractorUserId,
    })
    .returning()

  if (!result) {
    return [null, new Error('Failed to create service')] as const
  }

  return [result, null] as const
}
