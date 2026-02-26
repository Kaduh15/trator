import z from 'zod'

export const createClientInputSchema = z.object({
  name: z.string().min(3),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{0,14}$/)
    .optional()
    .nullable(),
})

export const clientSchema = createClientInputSchema.extend({
  id: z.uuidv7(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  isAssociated: z.boolean(),
})

export type CreateClientInput = z.infer<typeof createClientInputSchema>
export type Client = z.infer<typeof clientSchema>
