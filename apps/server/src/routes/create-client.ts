import {
  createClientDB,
  createClientInputSchema,
} from '@trator/db/functions/create-client'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'

export const createClientsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/clients',
    {
      preHandler: [checkSession],
      schema: {
        tags: ['Clients'],
        body: createClientInputSchema,
        response: {
          [HTTP_STATUS.CREATED]: z.object({
            data: createClientInputSchema.extend({
              id: z.uuidv7(),
              createdAt: z.date(),
              updatedAt: z.date().optional().nullable(),
              isAssociated: z.boolean().default(false),
            }),
          }),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const [data, error] = await createClientDB(request.body)

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.CREATED).send({
        data: {
          id: data.id,
          name: data.name,
          phone: data.phone,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isAssociated: data.isAssociated,
        },
      })
    }
  )
}
