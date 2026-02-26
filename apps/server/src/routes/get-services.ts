import {
  dataResponseSchema,
  errorResponseSchema,
  serviceListItemSchema,
} from '@trator/db'
import { getServicesDB } from '@trator/db/functions/get-services'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
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
          [HTTP_STATUS.OK]: dataResponseSchema(serviceListItemSchema.array()),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
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
