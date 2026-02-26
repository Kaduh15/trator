import { env } from '@trator/env/server'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

export * from './schemas'

export const db = drizzle(env.DATABASE_URL, { schema })
