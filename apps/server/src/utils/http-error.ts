import type { FastifyReply } from 'fastify'

export const sendError = (
  reply: FastifyReply,
  status: number,
  message: string
) => reply.status(status).send({ message })
