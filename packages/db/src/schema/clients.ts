import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const client = pgTable('client', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  isAssociated: boolean('is_associated').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  phone: text('phone'),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
})
