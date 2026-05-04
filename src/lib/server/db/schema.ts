import { mysqlTable, serial, varchar, text, int, decimal, boolean, timestamp, mysqlEnum, json } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	role: mysqlEnum('role', ['admin', 'dprd', 'pelaksana', 'auditor', 'umum']).notNull().default('umum'),
	createdAt: timestamp('created_at').defaultNow()
});

export const programs = mysqlTable('programs', {
	id: int('id').autoincrement().primaryKey(),
	category: varchar('category', { length: 100 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	code: varchar('code', { length: 50 }).notNull(),
	budgetYear: int('budget_year').notNull(),
	status: mysqlEnum('status', ['diajukan', 'approved', 'rejected']).notNull().default('diajukan'),
	isLocked: boolean('is_locked').notNull().default(false),
	totalBudget: decimal('total_budget', { precision: 20, scale: 2 }).notNull().default('0'),
	createdBy: int('created_by').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow()
});

export const programItems = mysqlTable('program_items', {
	id: int('id').autoincrement().primaryKey(),
	programId: int('program_id').references(() => programs.id, { onDelete: 'cascade' }),
	itemName: varchar('item_name', { length: 255 }).notNull(),
	unitPrice: decimal('unit_price', { precision: 20, scale: 2 }).notNull(),
	quantity: int('quantity').notNull(),
	totalPrice: decimal('total_price', { precision: 20, scale: 2 }).notNull()
});

export const standardPrices = mysqlTable('standard_prices', {
	id: int('id').autoincrement().primaryKey(),
	itemName: varchar('item_name', { length: 255 }).notNull().unique(),
	maxPrice: decimal('max_price', { precision: 20, scale: 2 }).notNull()
});

export const realizations = mysqlTable('realizations', {
	id: int('id').autoincrement().primaryKey(),
	programId: int('program_id').references(() => programs.id),
	userId: int('user_id').references(() => users.id),
	amount: decimal('amount', { precision: 20, scale: 2 }).notNull(),
	description: text('description').notNull(),
	evidenceUrl: varchar('evidence_url', { length: 500 }),
	latitude: varchar('latitude', { length: 50 }),
	longitude: varchar('longitude', { length: 50 }),
	createdAt: timestamp('created_at').defaultNow()
});

export const auditLogs = mysqlTable('audit_logs', {
	id: int('id').autoincrement().primaryKey(),
	tableName: varchar('table_name', { length: 100 }).notNull(),
	rowId: int('row_id').notNull(),
	action: varchar('action', { length: 50 }).notNull(),
	oldData: json('old_data'),
	newData: json('new_data'),
	userId: int('user_id').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow()
});

export const reports = mysqlTable('reports', {
	id: int('id').autoincrement().primaryKey(),
	programId: int('program_id').references(() => programs.id),
	reporterName: varchar('reporter_name', { length: 255 }).notNull(),
	description: text('description').notNull(),
	evidenceUrl: varchar('evidence_url', { length: 500 }),
	status: mysqlEnum('status', ['pending', 'investigating', 'resolved']).notNull().default('pending'),
	createdAt: timestamp('created_at').defaultNow()
});
