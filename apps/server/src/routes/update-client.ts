import { selectClientSchema, updateClientSchema } from '@trator/db'
import { updateClientDB } from '@trator/db/functions/update-client'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'

export const updateClientRoute: FastifyPluginCallbackZod = (app) => {
  app.put(
    '/clients/:id',
    {
      preHandler: [checkSession],
      schema: {
        tags: ['Clients'],
        body: updateClientSchema.pick({
          isAssociated: true,
        }),
        params: selectClientSchema.pick({
          id: true,
        }),
        response: {
          [HTTP_STATUS.OK]: dataResponseSchema(selectClientSchema),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const [data, error] = await updateClientDB({
        clientId: request.params.id,
        input: request.body,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
