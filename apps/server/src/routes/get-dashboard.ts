import { dashboardQuerySchema, dashboardSummarySchema } from '@trator/db'
import { getDashboardDB } from '@trator/db/functions/get-dashboard'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { adminPermission } from './hooks/admin-permission'
import { checkSession } from './hooks/check-session'

export const getDashboardRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/dashboard',
    {
      preHandler: [checkSession, adminPermission],
      schema: {
        tags: ['Dashboard'],
        querystring: dashboardQuerySchema,
        response: {
          [HTTP_STATUS.OK]: dataResponseSchema(dashboardSummarySchema),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { month } = request.query
      const [data, error] = await getDashboardDB({ month })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
