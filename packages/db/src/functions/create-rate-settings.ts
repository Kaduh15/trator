import z from 'zod'
import { db } from '..'
import { rateSetting } from '../schema'

export const createRateSettingsInputSchema = z.object({
  clientAssociateHourlyRate: z.number().positive(),
  clientNonAssociateHourlyRate: z.number().positive(),
  tractorHourlyRate: z.number().positive(),
  createdByUserId: z.string(),
})

export type CreateRateSettingsInput = z.infer<
  typeof createRateSettingsInputSchema
>

export async function createRateSettingsDB(input: CreateRateSettingsInput) {
  const [rateSettingsResult] = await db
    .insert(rateSetting)
    .values([
      {
        clientAssociateHourlyRate: input.clientAssociateHourlyRate,
        clientNonAssociateHourlyRate: input.clientNonAssociateHourlyRate,
        tractorHourlyRate: input.tractorHourlyRate,
        createdByUserId: input.createdByUserId,
      },
    ])
    .returning()

  if (!rateSettingsResult) {
    return [null, new Error('Failed to create rate settings')] as const
  }

  return [rateSettingsResult, null] as const
}
