import { db } from '..'
import { rateSetting } from '../schema'
import type { AsyncReturnFunction } from '../types/function-db'
import {
  type CreateRateSettingsInput,
  createRateSettingsSchema,
  type RateSettings,
} from '../validators/rate-settings'

export async function createRateSettingsDB(
  input: CreateRateSettingsInput
): AsyncReturnFunction<RateSettings> {
  const parsed = createRateSettingsSchema.safeParse(input)

  if (!parsed.success) {
    return [null, parsed.error] as const
  }

  const { data } = parsed

  const [rateSettingsResult] = await db
    .insert(rateSetting)
    .values(data)
    .returning()

  if (!rateSettingsResult) {
    return [null, new Error('Failed to create rate settings')] as const
  }

  return [rateSettingsResult, null] as const
}
