import {
  createServiceDB,
  createServiceInputSchema,
} from '@trator/db/functions/create-service'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { checkSession } from './hooks/check-session'
import { tractorPermission } from './hooks/tractor-permission'

export const createServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/services',
    {
      preHandler: [checkSession, tractorPermission],
      schema: {
        body: createServiceInputSchema.omit({ tractorUserId: true }),
      },
    },
    async (request) => {
      if (!request.session) {
        throw new Error('Unauthorized')
      }

      const { clientId, description } = request.body

      const [data, error] = await createServiceDB({
        clientId,
        description,
        tractorUserId: request.session.user.id,
      })

      if (error) {
        throw error
      }

      return data
    }
  )
}
