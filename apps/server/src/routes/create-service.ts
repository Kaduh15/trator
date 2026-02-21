import {
  createServiceDB,
  createServiceInputSchema,
} from '@trator/db/functions/create-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
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
          [HTTP_STATUS.CREATED]: z.object({
            data: createServiceInputSchema.extend({
              id: z.uuidv7(),
              clientHourlyRateCents: z.number(),
              tractorHourlyRateCents: z.number(),
              createdAt: z.date(),
              updatedAt: z.date().optional().nullable(),
            }),
          }),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
          [HTTP_STATUS.UNAUTHORIZED]: z.object({
            message: z.string(),
          }),
          [HTTP_STATUS.FORBIDDEN]: z.object({
            message: z.string(),
          }),
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
