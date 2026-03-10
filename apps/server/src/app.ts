/** biome-ignore-all lint/complexity/noForEach: false positive */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: false positive */

import fastifyCors, { type FastifyCorsOptions } from '@fastify/cors'
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

  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`)

        // Convert Fastify headers to standard Headers object
        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) {
            headers.append(key, value.toString())
          }
        })
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        })
        // Process authentication request
        const response = await auth.handler(req)
        // Forward response to client
        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))
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
