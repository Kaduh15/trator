import z from 'zod'

export const createRateSettingsInputSchema = z.object({
  clientAssociateHourlyRate: z.number().positive(),
  clientNonAssociateHourlyRate: z.number().positive(),
  tractorHourlyRate: z.number().positive(),
  createdByUserId: z.string(),
})

export const rateSettingsSchema = createRateSettingsInputSchema.extend({
  id: z.uuidv7(),
  createdAt: z.date(),
})

export type CreateRateSettingsInput = z.infer<
  typeof createRateSettingsInputSchema
>
export type RateSettings = z.infer<typeof rateSettingsSchema>
