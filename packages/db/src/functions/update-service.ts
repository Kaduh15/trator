import { eq } from 'drizzle-orm'
import { db } from '..'
import { service } from '../schema/index'
import {
  type Service,
  type UpdateServiceInput,
  updateServiceSchema,
} from '../validators/service'

export const updateServiceDB = async ({
  serviceId,
  input,
}: {
  serviceId: Service['id']
  input: UpdateServiceInput
}) => {
  const parsed = updateServiceSchema.safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [serviceResult] = await db
    .select()
    .from(service)
    .where(eq(service.id, serviceId))

  if (!serviceResult) {
    return [null, new Error('Failed to update service')] as const
  }

  const [updatedService] = await db
    .update(service)
    .set({
      ...data,
      status:
        data?.workedMinutes && data.workedMinutes > 0 ? 'done' : undefined,
    })
    .where(eq(service.id, serviceId))
    .returning()

  if (!updatedService) {
    return [null, new Error('Failed to update service')] as const
  }

  return [updatedService, null] as const
}
