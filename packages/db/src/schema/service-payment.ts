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
import { service } from './service'

export const paymentMethod = pgEnum('payment_method', ['pix'])

export const servicePayment = pgTable('service_payment', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  serviceId: uuid('service_id')
    .references(() => service.id)
    .notNull(),
  createdByUserId: text('created_by_user_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  method: paymentMethod('method').default('pix').notNull(),
  note: text('note'),
  paidAt: timestamp('paid_at', { withTimezone: true }).defaultNow().notNull(),
})

export const servicePaymentRelations = relations(servicePayment, ({ one }) => ({
  service: one(service, {
    fields: [servicePayment.serviceId],
    references: [service.id],
  }),
  user: one(user, {
    fields: [servicePayment.createdByUserId],
    references: [user.id],
  }),
}))
