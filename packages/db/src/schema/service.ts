import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'
import { user } from './auth'
import { client } from './clients'

export const serviceStatus = pgEnum('status', ['open', 'done', 'canceled'])

export const service = pgTable('service', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  clientId: uuid('client_id').notNull(),
  tractorUserId: text('tractor_user_id').notNull(),
  description: text('description').notNull(),
  status: serviceStatus('status').default('open').notNull(),
  workedMinutes: integer('worked_minutes').default(0).notNull(),
  clientHourlyRateCents: integer('client_hourly_rate_cents').notNull(),
  tractorHourlyRateCents: integer('tractor_hourly_rate_cents').notNull(),
  totalClientCents: integer('total_client_cents').default(0),
  totalTractorCents: integer('total_tractor_cents').default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
})

export const serviceRelations = relations(service, ({ one }) => ({
  client: one(client, {
    fields: [service.clientId],
    references: [client.id],
  }),
  tractor: one(user, {
    fields: [service.tractorUserId],
    references: [user.id],
  }),
}))
