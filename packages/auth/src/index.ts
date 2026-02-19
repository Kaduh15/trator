import { db } from '@trator/db'
import * as schema from '@trator/db/schema/auth'
import { env } from '@trator/env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI, username } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',

    schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [username(), admin(), openAPI()],
})
