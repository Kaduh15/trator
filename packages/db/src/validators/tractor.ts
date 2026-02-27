import z from 'zod'

export const tractorWeekSchema = z.object({
  weekStartDate: z.string(),
  workedMinutes: z.number().int().min(0),
  tractorCents: z.number().int().min(0),
})

export const tractorHoursSchema = z.object({
  totalWorkedMinutes: z.number().int().min(0),
  totalTractorCents: z.number().int().min(0),
  weeks: tractorWeekSchema.array(),
})

export type TractorHours = z.infer<typeof tractorHoursSchema>
