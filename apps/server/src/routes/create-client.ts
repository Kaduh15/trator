import { createClientSchema, selectClientSchema } from '@trator/db'
import { createClientDB } from '@trator/db/functions/create-client'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
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
        body: createClientSchema,
        response: {
          [HTTP_STATUS.CREATED]: dataResponseSchema(selectClientSchema),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const [data, error] = await createClientDB(request.body)

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.CREATED).send({ data })
    }
  )
}
