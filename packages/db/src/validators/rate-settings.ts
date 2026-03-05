import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { rateSetting } from '../schema/rate-setting'

export const createRateSettingsSchema = createInsertSchema(rateSetting).omit({
  createdAt: true,
  id: true,
})
export const selectRateSettingsSchema = createSelectSchema(rateSetting)
export const updateRateSettingsSchema = createUpdateSchema(rateSetting).omit({
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
