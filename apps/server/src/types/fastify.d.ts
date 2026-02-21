import type { auth } from '@trator/auth'
import 'fastify'

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

declare module 'fastify' {
  interface FastifyRequest {
    session: AuthSession
  }
}
