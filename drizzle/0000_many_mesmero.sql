CREATE TABLE `audit_logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`table_name` varchar(100) NOT NULL,
	`row_id` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`old_data` json,
	`new_data` json,
	`user_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `program_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`program_id` int,
	`item_name` varchar(255) NOT NULL,
	`unit_price` decimal(20,2) NOT NULL,
	`quantity` int NOT NULL,
	`total_price` decimal(20,2) NOT NULL,
	CONSTRAINT `program_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`budget_year` int NOT NULL,
	`status` enum('diajukan','approved','rejected') NOT NULL DEFAULT 'diajukan',
	`is_locked` boolean NOT NULL DEFAULT false,
	`total_budget` decimal(20,2) NOT NULL DEFAULT '0',
	`created_by` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `realizations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`program_id` int,
	`user_id` int,
	`amount` decimal(20,2) NOT NULL,
	`description` text NOT NULL,
	`evidence_url` varchar(500),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `realizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`program_id` int,
	`reporter_name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`evidence_url` varchar(500),
	`status` enum('pending','investigating','resolved') NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standard_prices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`max_price` decimal(20,2) NOT NULL,
	CONSTRAINT `standard_prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `standard_prices_item_name_unique` UNIQUE(`item_name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('admin','dprd','pelaksana','auditor','umum') NOT NULL DEFAULT 'umum',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `program_items` ADD CONSTRAINT `program_items_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `programs` ADD CONSTRAINT `programs_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `realizations` ADD CONSTRAINT `realizations_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `realizations` ADD CONSTRAINT `realizations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;