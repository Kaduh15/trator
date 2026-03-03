import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { rateSetting, service, servicePayment } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import {
  type CreateServicePaymentInput,
  createServicePaymentSchema,
  type ServicePayment,
} from '../validators/service-payment'

export const createServicePaymentDB = async (
  input: Pick<
    CreateServicePaymentInput,
    'serviceId' | 'amountCents' | 'note' | 'createdByUserId'
  >
): AsyncReturnFunction<ServicePayment> => {
  const parsed = createServicePaymentSchema
    .pick({
      serviceId: true,
      amountCents: true,
      note: true,
      createdByUserId: true,
    })
    .safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [serviceResult] = await db
    .select()
    .from(service)
    .where(eq(service.id, data.serviceId))

  if (!serviceResult) {
    return [null, new Error('Service not found')] as const
  }

  const [reteSetting] = await db
    .select()
    .from(rateSetting)
    .orderBy(desc(rateSetting.createdAt))
    .limit(1)

  if (!reteSetting) {
    return [null, new Error('No rate setting found')] as const
  }

  const [result] = await db
    .insert(servicePayment)
    .values({
      serviceId: data.serviceId,
      amountCents: data.amountCents,
      note: data.note,
      createdByUserId: data.createdByUserId,
    })
    .returning()

  if (!result) {
    return [null, new Error('Failed to create servicePayment')] as const
  }

  return [result, null] as const
}
