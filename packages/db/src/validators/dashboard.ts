import z from 'zod'

export const dashboardSummarySchema = z.object({
  month: z.string(),
  currency: z.string(),
  summary: z.object({
    totalGeneratedCents: z.number().positive(),
    receivedCents: z.number().positive(),
    totalExpensesCents: z.number().positive(),
    finalBalanceCents: z.number(),
  }),
})

export const dashboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional(),
})

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
