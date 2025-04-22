import { relations } from 'drizzle-orm';

import {
    pgTable,
    serial,
    text,
    decimal,
    boolean,
    timestamp,
    // integer, // Alternative for price if storing cents
  } from 'drizzle-orm/pg-core';
import { orderItems } from './order_items';


  export const productTable = pgTable('product', {
    // Use serial for auto-incrementing integer primary key
    id: serial('id').primaryKey(),
  
    // Product name - required
    name: text('name').notNull(),
  
    // Current price - required. Precision 10, Scale 2 allows up to 99,999,999.99
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    // --- OR if storing price in cents as an integer ---
    // priceInCents: integer('price_in_cents').notNull(),
  
    // Original price - optional
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
    // --- OR if storing price in cents as an integer ---
    // originalPriceInCents: integer('original_price_in_cents'),
  
    // Image URL - optional
    imageUrl: text('image_url'),
  
    // Category name - required (Could be a foreign key to a categories table later)
    category: text('category').notNull(),
  
    // Rating - optional. Precision 3, Scale 1 allows e.g., 4.5, 9.9
    rating: decimal('rating', { precision: 3, scale: 1 }),
  
    // Stock status - required, defaults to true
    inStock: boolean('in_stock').notNull().default(true),
  
    // Timestamps
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date()) // Automatically update on modification
      .notNull(),
  });

  export const productsRelations = relations(productTable, ({ many }) => ({
    // ADDED: Relation to order items (one product can be in many orders via the junction table)
    orderItems: many(orderItems),
    // Add other product relations if needed (e.g., to categories)
  }));
  // Optional: Define types for easier usage in your application code
  export type Product = typeof productTable.$inferSelect; // return type when queried
  export type NewProduct = typeof productTable.$inferInsert; // type for insertion