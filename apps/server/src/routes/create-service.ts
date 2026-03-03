import { createServiceSchema } from '@trator/db'
import { createServiceDB } from '@trator/db/functions/create-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
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
        body: createServiceSchema.pick({ clientId: true, description: true }),
        response: {
          [HTTP_STATUS.CREATED]: dataResponseSchema(createServiceSchema),
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

      const input = request.body

      const [data, error] = await createServiceDB({
        ...input,
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
