import { auth } from '@trator/auth'
import type { preHandlerAsyncHookHandler } from 'fastify'

export const checkSession: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  console.log('🚀 ~ checkSession ~ request.body:', request.body)

  if (!session) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  request.session = session
}
