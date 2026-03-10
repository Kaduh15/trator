import fastifyCors, { type FastifyCorsOptions } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarReference from '@scalar/fastify-api-reference'
import { auth } from '@trator/auth'
import { env } from '@trator/env/server'
import { toNodeHandler } from 'better-auth/node'
import Fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import * as routes from './routes'

const baseCorsConfig: FastifyCorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400,
}

async function registerRoutes(app: ReturnType<typeof buildApp>) {
  for (const route of Object.values(routes)) {
    await app.register(route, { prefix: '/api' })
  }
}

export function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SampleApi',
        description: 'Sample backend service',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarReference, {
    routePrefix: '/api/docs',
    configuration: {
      theme: 'deepSpace',
      defaultOpenAllTags: true,
    },
  })

  app.decorateRequest('session', null)

  app.register(fastifyCors, baseCorsConfig)

  const authHandler = toNodeHandler(auth)

  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        reply.hijack()
        await authHandler(request.raw, reply.raw)
      } catch (error) {
        app.log.error({ err: error }, 'Authentication Error:')
        const rawReply = reply.raw as unknown as {
          statusCode: number
          setHeader: (name: string, value: string) => void
          end: (chunk?: string) => void
          headersSent?: boolean
        }
        if (!rawReply.headersSent) {
          rawReply.statusCode = 500
          rawReply.setHeader('content-type', 'application/json')
          rawReply.end(
            JSON.stringify({
              error: 'Internal authentication error',
              code: 'AUTH_FAILURE',
            })
          )
        }
      }
    },
  })

  app.get('/', () => {
    return 'OK'
  })

  registerRoutes(app)

  return app
}
