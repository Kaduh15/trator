import { selectClientSchema } from '@trator/db'
import { getClientsDB } from '@trator/db/functions/get-clients'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
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
          [HTTP_STATUS.OK]: dataResponseSchema(selectClientSchema.array()),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
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
