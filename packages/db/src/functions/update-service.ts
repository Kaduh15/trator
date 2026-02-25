import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '..'
import { service } from '../schema'

export const updateServiceInputSchema = z.object({
  serviceId: z.uuidv7(),
  workedMinutes: z.number(),
})

type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>

export const updateServiceDB = async (input: UpdateServiceInput) => {
  const parsed = updateServiceInputSchema.safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [serviceResult] = await db
    .select()
    .from(service)
    .where(eq(service.id, data.serviceId))

  if (!serviceResult) {
    return [null, new Error('Failed to update service')] as const
  }

  const [updatedService] = await db
    .update(service)
    .set({
      status: 'done',
      workedMinutes: data.workedMinutes,
      totalClientCents:
        Math.round(
          (data.workedMinutes / 60) *
            (serviceResult.clientHourlyRateCents / 100)
        ) * 100,
      totalTractorCents:
        Math.round(
          (data.workedMinutes / 60) *
            (serviceResult.tractorHourlyRateCents / 100)
        ) * 100,
      finishedAt: new Date(),
    })
    .where(eq(service.id, data.serviceId))
    .returning()

  if (!updatedService) {
    return [null, new Error('Failed to update service')] as const
  }

  return [updatedService, null] as const
}
