import type { preHandlerHookHandler } from 'fastify'
import { sendError } from '@/utils/http-error'
import { HTTP_STATUS } from '@/utils/http-status'

export const tractorPermission: preHandlerHookHandler = (
  request,
  reply,
  done
) => {
  if (!request.session) {
    return sendError(reply, HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  }

  if (request.session.user.role !== 'user') {
    return sendError(reply, HTTP_STATUS.FORBIDDEN, 'Forbidden')
  }

  done()
}
