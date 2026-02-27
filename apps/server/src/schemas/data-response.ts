import z from 'zod'

export const errorResponseSchema = z.object({
  message: z.string(),
})

export const dataResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
  })

export type ErrorResponse = z.infer<typeof errorResponseSchema>
