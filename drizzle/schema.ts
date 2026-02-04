import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tags for organizing activities
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).default("#3b82f6").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Manuscripts tracking
 */
export const manuscripts = mysqlTable("manuscripts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["draft", "submitted", "under_review", "accepted", "rejected", "published"]).default("draft").notNull(),
  journal: varchar("journal", { length: 255 }),
  submissionDate: timestamp("submissionDate"),
  targetDate: timestamp("targetDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Manuscript = typeof manuscripts.$inferSelect;
export type InsertManuscript = typeof manuscripts.$inferInsert;

/**
 * Manuscript-Tag relationship
 */
export const manuscriptTags = mysqlTable("manuscript_tags", {
  manuscriptId: int("manuscriptId").notNull(),
  tagId: int("tagId").notNull(),
});

/**
 * Conferences tracking
 */
export const conferences = mysqlTable("conferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  submissionDeadline: timestamp("submissionDeadline"),
  attendanceStatus: mysqlEnum("attendanceStatus", ["interested", "submitted", "accepted", "attended", "rejected"]).default("interested").notNull(),
  website: varchar("website", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conference = typeof conferences.$inferSelect;
export type InsertConference = typeof conferences.$inferInsert;

/**
 * Conference-Tag relationship
 */
export const conferenceTags = mysqlTable("conference_tags", {
  conferenceId: int("conferenceId").notNull(),
  tagId: int("tagId").notNull(),
});

/**
 * Meetings tracking
 */
export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  date: timestamp("date").notNull(),
  duration: int("duration"), // in minutes
  participants: text("participants"), // JSON array of participant names
  location: varchar("location", { length: 255 }),
  agenda: text("agenda"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;

/**
 * Meeting-Tag relationship
 */
export const meetingTags = mysqlTable("meeting_tags", {
  meetingId: int("meetingId").notNull(),
  tagId: int("tagId").notNull(),
});

/**
 * Email reminders configuration
 */
export const reminders = mysqlTable("reminders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityType: mysqlEnum("activityType", ["manuscript", "conference", "meeting"]).notNull(),
  activityId: int("activityId").notNull(),
  reminderType: mysqlEnum("reminderType", ["submission_deadline", "conference_deadline", "meeting_time", "custom"]).notNull(),
  daysBeforeEvent: int("daysBeforeEvent").default(7),
  reminderTime: varchar("reminderTime", { length: 5 }).default("09:00"), // HH:MM format
  isEnabled: boolean("isEnabled").default(true).notNull(),
  lastSentAt: timestamp("lastSentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Email reminder logs
 */
export const reminderLogs = mysqlTable("reminder_logs", {
  id: int("id").autoincrement().primaryKey(),
  reminderId: int("reminderId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
  errorMessage: text("errorMessage"),
});

export type ReminderLog = typeof reminderLogs.$inferSelect;
export type InsertReminderLog = typeof reminderLogs.$inferInsert;
