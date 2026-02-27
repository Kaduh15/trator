import { createInsertSchema } from 'drizzle-zod'
import { rateSetting } from '../schema/rate-setting'

export const createRateSettingsSchema = createInsertSchema(rateSetting).omit({
  createdAt: true,
  id: true,
})
export const selectRateSettingsSchema = createInsertSchema(rateSetting)
export const updateRateSettingsSchema = createInsertSchema(rateSetting).omit({
  createdAt: true,
  id: true,
})

export type CreateRateSettingsInput = ReturnType<
  typeof createRateSettingsSchema.parse
>
export type UpdateRateSettingsInput = ReturnType<
  typeof updateRateSettingsSchema.parse
>
export type RateSettings = ReturnType<typeof selectRateSettingsSchema.parse>
