import { relations } from 'drizzle-orm';

import {
    pgTable,
    serial,
    text,
    timestamp,
    decimal,
    integer,
    pgEnum,
  } from 'drizzle-orm/pg-core';
  // Import the *generated* userTable
  import { userTable } from './users'; // Adjust path if generation target is different
  
  export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
  
  export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: text('user_id') // Matches type of userTable.id (likely text from better-auth)
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }), // Reference the generated userTable
    status: orderStatusEnum('status').default('pending').notNull(),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    // ... other order fields
  });

  export const ordersRelations = relations(orders, ({ one }) => ({
    // Relation to user (one order belongs to one user)
    user: one(userTable, {
      fields: [orders.userId],
      references: [userTable.id],
    }),
    // Relation to order items (if you add an order_items table)
    // orderItems: many(orderItems),
  }));