import type { preHandlerHookHandler } from 'fastify'

export const tractorPermission: preHandlerHookHandler = (
  request,
  reply,
  done
) => {
  if (!request.session) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  if (request.session.user.role !== 'user') {
    return reply.status(403).send({ error: 'Forbidden' })
  }

  done()
}
