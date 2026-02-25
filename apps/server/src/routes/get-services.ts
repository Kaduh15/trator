import { getServicesDB } from '@trator/db/functions/get-services'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'

export const getServicesRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/services',
    {
      preHandler: [checkSession],
      schema: {
        tags: ['Services'],
        response: {
          [HTTP_STATUS.OK]: z.object({
            data: z
              .object({
                id: z.uuidv7(),
                description: z.string(),
                createdAt: z.date(),
                updatedAt: z.date().optional().nullable(),
                status: z.enum(['open', 'done', 'canceled']),
                client: z
                  .object({
                    isAssociated: z.boolean(),
                    id: z.uuidv7(),
                    name: z.string(),
                    phone: z.string().optional().nullable(),
                  })
                  .nullable(),
              })
              .array(),
          }),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      const [data, error] = await getServicesDB()

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
