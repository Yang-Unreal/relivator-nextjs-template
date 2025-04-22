// ~/db/schema/order_items.ts (Create this new file)
import {
    pgTable,
    integer,
    decimal,
    primaryKey, // Import for defining composite primary keys
  } from 'drizzle-orm/pg-core';
  import { relations } from 'drizzle-orm';
  import { orders } from './orders'; // Import the orders table schema
  import { productTable } from './products'; // Import the products table schema
  
  export const orderItems = pgTable('order_items', {
    // Foreign key to the orders table
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }), // If an order is deleted, its items are deleted too
  
    // Foreign key to the products table
    productId: integer('product_id') // Assuming products.id is integer/serial
      .notNull()
      // Decide onDelete behavior:
      // 'restrict': Prevent deleting a product if it's in any order item (safer for data integrity)
      // 'set null': Allow deleting product, set productId here to NULL (requires making productId nullable)
      // 'cascade': If product deleted, delete order item (less common for historical orders)
      .references(() => productTable.id, { onDelete: 'restrict' }),
  
    // Information specific to this item within this order
    quantity: integer('quantity').notNull().default(1),
    // Store the price *at the time of the order* because product prices can change
    pricePerUnit: decimal('price_per_unit', { precision: 10, scale: 2 }).notNull(),
  
  }, (table) => {
    // Define a composite primary key: an order can only have a specific product listed once.
    return {
      pk: primaryKey({ columns: [table.orderId, table.productId] }),
    }
  });
  
  // Define relations originating FROM orderItems
  export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    // Each order item belongs to exactly one order
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),
    // Each order item refers to exactly one product
    product: one(productTable, {
      fields: [orderItems.productId],
      references: [productTable.id],
    }),
  }));