import { boolean, date, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const client = pgTable('client', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  isAssociated: boolean('is_associated').default(false).notNull(),
  createdAt: date('created_at', {
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
  phone: text('phone'),
  updatedAt: date('updated_at', {
    mode: 'date',
  }).$onUpdate(() => new Date()),
})
