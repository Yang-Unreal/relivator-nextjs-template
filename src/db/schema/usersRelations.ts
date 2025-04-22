import { relations } from 'drizzle-orm';

// Import ALL table schemas you need to relate
// Import generated auth tables
import { userTable, accountTable, sessionTable /* ... other generated tables */ } from './users'; // Adjust path if needed
// Import manual tables
import { orders } from './orders';
// import { productTable } from './products'; // Assuming you have products.ts

// Define relations for the user table
export const usersRelations = relations(userTable, ({ many}) => ({
  // Relation to orders (one user has many orders)
  orders: many(orders),

  // Relations needed by better-auth adapter (usually handled internally but good practice to know they exist)
  accounts: many(accountTable),
  sessions: many(sessionTable),
  // Add other relations originating from the user if needed
}));


// Define relations for account table (as needed by auth)
export const accountsRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

// Define relations for session table (as needed by auth)
export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// Add relations definitions for verificationTable, twoFactorTable etc. if needed for queries.