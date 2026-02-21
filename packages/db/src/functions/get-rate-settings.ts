import { desc } from 'drizzle-orm'
import { db } from '..'
import { rateSetting } from '../schema'

export async function getRateSettingsDB() {
  const [rateSettingsResult] = await db
    .select()
    .from(rateSetting)
    .orderBy(desc(rateSetting.createdAt))
    .limit(1)

  if (!rateSettingsResult) {
    return [null, new Error('No rate settings found')] as const
  }

  return [rateSettingsResult, null] as const
}
