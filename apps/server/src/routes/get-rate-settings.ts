import { getRateSettingsDB } from '@trator/db/functions/get-rate-settings'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

const rateSettingsResponseSchema = z.object({
  id: z.uuidv7(),
  clientAssociateHourlyRate: z.number(),
  clientNonAssociateHourlyRate: z.number(),
  tractorHourlyRate: z.number(),
  createdByUserId: z.string(),
  createdAt: z.date(),
})

export const getRateSettingsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rate-settings',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['RateSettings'],
        response: {
          [HTTP_STATUS.OK]: z.object({
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
    async (_request, reply) => {
      const [data, error] = await getRateSettingsDB()

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
