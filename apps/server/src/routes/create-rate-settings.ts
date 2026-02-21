import {
  createRateSettingsDB,
  createRateSettingsInputSchema,
} from '@trator/db/functions/create-rate-settings'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

const rateSettingsResponseSchema = createRateSettingsInputSchema.extend({
  id: z.uuidv7(),
  createdByUserId: z.string(),
  createdAt: z.date(),
})

export const createRateSettingsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rateSettings',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['RateSettings'],
        body: createRateSettingsInputSchema.omit({ createdByUserId: true }),
        response: {
          [HTTP_STATUS.CREATED]: z.object({
            data: rateSettingsResponseSchema,
          }),
          [HTTP_STATUS.UNAUTHORIZED]: z.object({
            message: z.string(),
          }),
          [HTTP_STATUS.FORBIDDEN]: z.object({
            message: z.string(),
          }),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: z.object({
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
