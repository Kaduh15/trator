import { getClientsDB } from '@trator/db/functions/get-clients'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'

export const getClientsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/clients',
    {
      preHandler: [checkSession],
      schema: {
        tags: ['Clients'],
        response: {
          [HTTP_STATUS.OK]: z.object({
            data: z
              .object({
                id: z.uuidv7(),
                name: z.string(),
                phone: z.string().optional().nullable(),
                createdAt: z.date(),
                updatedAt: z.date().optional().nullable(),
                isAssociated: z.boolean().default(false),
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
      const [data, error] = await getClientsDB()

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
