import { getServiceByIdDB } from '@trator/db/functions/get-service-by-id'
import { updateServiceDB } from '@trator/db/functions/update-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '@/utils/http-status'

export const serviceFinishRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/services/:id/finish',
    {
      schema: {
        tags: ['Services'],
        params: z.object({
          id: z.uuidv7(),
        }),
        body: z.object({
          workedMinutes: z.number().positive(),
        }),
      },
    },
    async (request, reply) => {
      const { id: serviceId } = request.params

      const { workedMinutes } = request.body

      const [service, errorGetService] = await getServiceByIdDB(serviceId)

      if (errorGetService) {
        reply
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: errorGetService.message })
        return
      }

      const finishedAt = new Date()

      const [data, errorUpdateService] = await updateServiceDB({
        serviceId,
        input: {
          workedMinutes,
          totalClientCents:
            service.clientHourlyRateCents * Math.floor(workedMinutes / 60),
          totalTractorCents:
            service.tractorHourlyRateCents * Math.floor(workedMinutes / 60),
          finishedAt,
        },
      })

      if (errorUpdateService) {
        reply
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: errorUpdateService.message })
        return
      }

      reply.status(HTTP_STATUS.OK).send({ data })
    }
  )
}
