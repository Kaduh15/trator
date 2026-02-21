import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarReference from '@scalar/fastify-api-reference'
import { auth } from '@trator/auth'
import { env } from '@trator/env/server'
import Fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createServiceRoute } from './routes/create-service'

const baseCorsConfig = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400,
}

async function registerRoutes(app: ReturnType<typeof buildApp>) {
  await app.register(createServiceRoute, { prefix: '/api' })
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
      servers: [],
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarReference, {
    routePrefix: '/api/docs',
  })

  app.decorateRequest('session', null)

  app.register(fastifyCors, baseCorsConfig)

  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)
        const headers = new Headers()
        for (const [key, value] of Object.entries(request.headers)) {
          if (value) {
            headers.append(key, value.toString())
          }
        }
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })
        const response = await auth.handler(req)
        reply.status(response.status)
        for (const [key, value] of response.headers.entries()) {
          reply.header(key, value)
        }
        reply.send(response.body ? await response.text() : null)
      } catch (error) {
        app.log.error({ err: error }, 'Authentication Error:')
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        })
      }
    },
  })

  app.get('/', () => {
    return 'OK'
  })

  registerRoutes(app)

  return app
}
