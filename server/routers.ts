import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== TAGS =====
  tags: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTags(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        color: z.string().default("#3b82f6"),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTag(ctx.user.id, input.name, input.color);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100),
        color: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateTag(input.id, ctx.user.id, input.name, input.color);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteTag(input.id, ctx.user.id);
      }),
  }),

  // ===== MANUSCRIPTS =====
  manuscripts: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getUserManuscripts(ctx.user.id, input.search);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const manuscript = await db.getManuscriptById(input.id, ctx.user.id);
        if (!manuscript) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return manuscript;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(500),
        status: z.enum(["draft", "submitted", "under_review", "accepted", "rejected", "published"]).optional(),
        journal: z.string().optional(),
        submissionDate: z.date().optional(),
        targetDate: z.date().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createManuscript(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(500),
        status: z.enum(["draft", "submitted", "under_review", "accepted", "rejected", "published"]),
        journal: z.string().optional(),
        submissionDate: z.date().optional(),
        targetDate: z.date().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateManuscript(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteManuscript(input.id, ctx.user.id);
      }),
  }),

  // ===== CONFERENCES =====
  conferences: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getUserConferences(ctx.user.id, input.search);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const conference = await db.getConferenceById(input.id, ctx.user.id);
        if (!conference) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return conference;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(500),
        location: z.string().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        submissionDeadline: z.date().optional(),
        attendanceStatus: z.enum(["interested", "submitted", "accepted", "attended", "rejected"]).optional(),
        website: z.string().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createConference(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(500),
        location: z.string().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        submissionDeadline: z.date().optional(),
        attendanceStatus: z.enum(["interested", "submitted", "accepted", "attended", "rejected"]),
        website: z.string().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateConference(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteConference(input.id, ctx.user.id);
      }),
  }),

  // ===== MEETINGS =====
  meetings: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getUserMeetings(ctx.user.id, input.search);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const meeting = await db.getMeetingById(input.id, ctx.user.id);
        if (!meeting) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return meeting;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(500),
        date: z.date(),
        duration: z.number().optional(),
        participants: z.array(z.string()).optional(),
        location: z.string().optional(),
        agenda: z.string().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createMeeting(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(500),
        date: z.date(),
        duration: z.number().optional(),
        participants: z.array(z.string()).optional(),
        location: z.string().optional(),
        agenda: z.string().optional(),
        notes: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateMeeting(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteMeeting(input.id, ctx.user.id);
      }),
  }),

  // ===== REMINDERS =====
  reminders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserReminders(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        activityType: z.enum(["manuscript", "conference", "meeting"]),
        activityId: z.number(),
        reminderType: z.enum(["submission_deadline", "conference_deadline", "meeting_time", "custom"]),
        daysBeforeEvent: z.number().optional(),
        reminderTime: z.string().optional(),
        isEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createReminder(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        daysBeforeEvent: z.number().optional(),
        reminderTime: z.string().optional(),
        isEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateReminder(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteReminder(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
