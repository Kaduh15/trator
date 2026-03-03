import { createServicePaymentSchema } from '@trator/db'
import { createServicePaymentDB } from '@trator/db/functions/create-service-payment'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

export const registerPaymentRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/services/:serviceId/payment',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['Services'],
        body: createServicePaymentSchema.pick({
          amountCents: true,
          note: true,
        }),
        params: createServicePaymentSchema.pick({ serviceId: true }),
        response: {
          [HTTP_STATUS.CREATED]: dataResponseSchema(createServicePaymentSchema),
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
      const { serviceId } = request.params

      const [data, error] = await createServicePaymentDB({
        ...input,
        createdByUserId: request.session.user.id,
        serviceId,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.CREATED).send({ data })
    }
  )
}
