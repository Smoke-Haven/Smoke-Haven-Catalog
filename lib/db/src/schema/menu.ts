import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  puffCount: text("puff_count").notNull(),
  flavor: text("flavor").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  isBestseller: boolean("is_bestseller").notNull().default(false),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ id: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItemsTable.$inferSelect;
