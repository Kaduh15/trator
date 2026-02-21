import { auth } from '@trator/auth'
import type { preHandlerAsyncHookHandler } from 'fastify'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'

export const checkSession: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  }

  request.session = session
}
