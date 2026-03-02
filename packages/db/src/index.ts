import { env } from '@trator/env/server'
import { drizzle } from 'drizzle-orm/node-postgres'
import { EnhancedQueryLogger } from 'drizzle-query-logger'

import * as schema from './schema'

export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: env.NODE_ENV === 'development' ? new EnhancedQueryLogger() : false,
})

export * from './validators'
