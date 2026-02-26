import {
  createServiceInputSchema,
  createServiceResponseSchema,
  dataResponseSchema,
  errorResponseSchema,
} from '@trator/db'
import { createServiceDB } from '@trator/db/functions/create-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'
import { tractorPermission } from './hooks/tractor-permission'

export const createServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/services',
    {
      preHandler: [checkSession, tractorPermission],
      schema: {
        tags: ['Services'],
        body: createServiceInputSchema.omit({ tractorUserId: true }),
        response: {
          [HTTP_STATUS.CREATED]: dataResponseSchema(
            createServiceResponseSchema
          ),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      if (!request.session) {
        sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
        return
      }

      const { clientId, description } = request.body

      const [data, error] = await createServiceDB({
        clientId,
        description,
        tractorUserId: request.session.user.id,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.CREATED).send({ data })
    }
  )
}
