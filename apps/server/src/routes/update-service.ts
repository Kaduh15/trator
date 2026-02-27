import { selectServiceSchema, updateServiceSchema } from '@trator/db'
import { updateServiceDB } from '@trator/db/functions/update-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '@/schemas/data-response'
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
        body: updateServiceSchema,
        params: selectServiceSchema.pick({ id: true }),
        response: {
          [HTTP_STATUS.OK]: dataResponseSchema(selectServiceSchema),
          [HTTP_STATUS.INTERNAL_SERVER_ERROR]: errorResponseSchema,
          [HTTP_STATUS.UNAUTHORIZED]: errorResponseSchema,
          [HTTP_STATUS.FORBIDDEN]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: serviceId } = request.params
      const [data, error] = await updateServiceDB({
        serviceId,
        input: request.body,
      })

      if (error) {
        sendError(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
