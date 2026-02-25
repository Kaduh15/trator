import {
  updateServiceDB,
  updateServiceInputSchema,
} from '@trator/db/functions/update-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'
import { checkSession } from './hooks/check-session'
import { tractorPermission } from './hooks/tractor-permission'

export const updateServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.put(
    '/services/:serviceId',
    {
      preHandler: [checkSession, tractorPermission],
      schema: {
        tags: ['Services'],
        body: updateServiceInputSchema.omit({ serviceId: true }),
        params: z.object({
          serviceId: z.string(),
        }),
        response: {
          [HTTP_STATUS.OK]: z.object({
            data: z.object({
              id: z.uuidv7(),
              clientId: z.uuidv7(),
              tractorUserId: z.string(),
              description: z.string().max(255),
              status: z.enum(['open', 'done', 'canceled']),
              workedMinutes: z.number().int().min(0),
              clientHourlyRateCents: z.number().int().min(0),
              tractorHourlyRateCents: z.number().int().min(0),
              totalClientCents: z.number().int().nullable(),
              totalTractorCents: z.number().int().nullable(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
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
      const { workedMinutes } = request.body
      const { serviceId } = request.params
      const [data, error] = await updateServiceDB({
        serviceId,
        workedMinutes,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
