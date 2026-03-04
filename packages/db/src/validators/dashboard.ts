import z from 'zod'

export const dashboardSummarySchema = z.object({
  month: z.string(),
  summary: z.object({
    totalGeneratedCents: z.number().positive().catch(0),
    receivedCents: z.number().catch(0),
    totalExpensesCents: z.number().positive().catch(0),
    finalBalanceCents: z.number().catch(0),
  }),
})

export const dashboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional(),
})

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
