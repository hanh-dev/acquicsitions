CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"createdAt" time DEFAULT now() NOT NULL,
	"updatedAt" time DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
