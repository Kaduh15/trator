import {
  createRateSettingsInputSchema,
  dataResponseSchema,
  errorResponseSchema,
  rateSettingsSchema,
} from '@trator/db'
import { createRateSettingsDB } from '@trator/db/functions/create-rate-settings'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

export const createRateSettingsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rateSettings',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['RateSettings'],
        body: createRateSettingsInputSchema.omit({ createdByUserId: true }),
        response: {
          [HTTP_STATUS.CREATED]: dataResponseSchema(rateSettingsSchema),
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      if (!request.session) {
        sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
        return
      }

      const {
        clientAssociateHourlyRate,
        clientNonAssociateHourlyRate,
        tractorHourlyRate,
      } = request.body

      const [data, error] = await createRateSettingsDB({
        clientAssociateHourlyRate,
        clientNonAssociateHourlyRate,
        tractorHourlyRate,
        createdByUserId: request.session.user.id,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.CREATED).send({ data })
    }
  )
}
