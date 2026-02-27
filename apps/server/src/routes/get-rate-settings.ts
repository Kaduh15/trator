import { selectRateSettingsSchema } from '@trator/db'
import { getRateSettingsDB } from '@trator/db/functions/get-rate-settings'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

export const getRateSettingsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rate-settings',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['RateSettings'],
        response: {
          [HTTP_STATUS.OK]: dataResponseSchema(selectRateSettingsSchema),
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
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
