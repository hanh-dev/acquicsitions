import { pgTable, varchar, time, serial } from 'drizzle-orm/pg-core';

export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: time('createdAt').notNull().defaultNow(),
  updatedAt: time('updatedAt').notNull().defaultNow(),
});
