import { getHoursDB } from '@trator/db/functions/get-hours'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { checkSession } from './hooks/check-session'
import { tractorPermission } from './hooks/tractor-permission'

export const getHoursRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/tractor/me',
    {
      preHandler: [checkSession, tractorPermission],
      schema: {
        tags: ['Trator'],
      },
    },
    async (request, reply) => {
      if (!request.session) {
        reply.status(401).send({ error: 'Unauthorized' })
        return
      }

      const [hours] = await getHoursDB()

      reply.status(200).send({ data: hours })
    }
  )
}
