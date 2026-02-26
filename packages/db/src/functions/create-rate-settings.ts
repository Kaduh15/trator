import { db } from '..'
import { rateSetting } from '../schema'
import {
  type CreateRateSettingsInput,
  createRateSettingsInputSchema,
} from '../schemas/rate-settings'

export async function createRateSettingsDB(input: CreateRateSettingsInput) {
  const parsed = createRateSettingsInputSchema.safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [rateSettingsResult] = await db
    .insert(rateSetting)
    .values([
      {
        clientAssociateHourlyRate: data.clientAssociateHourlyRate,
        clientNonAssociateHourlyRate: data.clientNonAssociateHourlyRate,
        tractorHourlyRate: data.tractorHourlyRate,
        createdByUserId: data.createdByUserId,
      },
    ])
    .returning()

  if (!rateSettingsResult) {
    return [null, new Error('Failed to create rate settings')] as const
  }

  return [rateSettingsResult, null] as const
}
