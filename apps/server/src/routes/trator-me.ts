import {
  dataResponseSchema,
  errorResponseSchema,
  tractorHoursSchema,
} from '@trator/db'
import { getHoursDB } from '@trator/db/functions/get-hours'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'
import { tractorPermission } from './hooks/tractor-permission'

export const getHoursRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/tractor/me',
    {
      preHandler: [checkSession, tractorPermission],
      schema: {
        tags: ['Trator'],
        response: {
          [HTTP_STATUS.OK]: dataResponseSchema(tractorHoursSchema),
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const [hours, error] = await getHoursDB()

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data: hours })
    }
  )
}
