import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'
import { user } from './auth'

export const rateSetting = pgTable('rate_setting', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  clientAssociateHourlyRate: integer('client_associate_hourly_rate').notNull(),
  clientNonAssociateHourlyRate: integer(
    'client_non_associate_hourly_rate'
  ).notNull(),
  tractorHourlyRate: integer('tractor_hourly_rate').notNull(),
  createdByUserId: text('created_by_user_id')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const rateSettingRelations = relations(rateSetting, ({ one }) => ({
  user: one(user, {
    fields: [rateSetting.createdByUserId],
    references: [user.id],
  }),
}))
