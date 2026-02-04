import { eq, and, desc, like, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, manuscripts, conferences, meetings, tags, manuscriptTags, conferenceTags, meetingTags, reminders, reminderLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== TAGS =====

export async function getUserTags(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).where(eq(tags.userId, userId)).orderBy(tags.name);
}

export async function createTag(userId: number, name: string, color: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tags).values({ userId, name, color });
  return result;
}

export async function updateTag(tagId: number, userId: number, name: string, color: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tags).set({ name, color }).where(and(eq(tags.id, tagId), eq(tags.userId, userId)));
}

export async function deleteTag(tagId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.userId, userId)));
}

// ===== MANUSCRIPTS =====

export async function getUserManuscripts(userId: number, search?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query: any = db.select().from(manuscripts).where(eq(manuscripts.userId, userId));
  
  if (search) {
    query = db.select().from(manuscripts).where(
      and(eq(manuscripts.userId, userId), like(manuscripts.title, `%${search}%`))
    );
  }
  
  return query.orderBy(desc(manuscripts.createdAt));
}

export async function getManuscriptById(manuscriptId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(manuscripts).where(
    and(eq(manuscripts.id, manuscriptId), eq(manuscripts.userId, userId))
  );
  
  if (result.length === 0) return null;
  
  const manuscript = result[0];
  const tagIds = await db.select().from(manuscriptTags).where(eq(manuscriptTags.manuscriptId, manuscriptId));
  const manuscriptTagList = await db.select().from(tags).where(inArray(tags.id, tagIds.map(t => t.tagId)));
  
  return { ...manuscript, tags: manuscriptTagList };
}

export async function createManuscript(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(manuscripts).values({
    userId,
    title: data.title,
    status: data.status || "draft",
    journal: data.journal,
    submissionDate: data.submissionDate,
    targetDate: data.targetDate,
    notes: data.notes,
  });
  
  if (data.tagIds && data.tagIds.length > 0) {
    const manuscriptId = (result as any)?.insertId;
    if (manuscriptId) {
      await db.insert(manuscriptTags).values(
        data.tagIds.map((tagId: number) => ({ manuscriptId, tagId }))
      );
    }
  }
  
  return result;
}

export async function updateManuscript(manuscriptId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(manuscripts).set({
    title: data.title,
    status: data.status,
    journal: data.journal,
    submissionDate: data.submissionDate,
    targetDate: data.targetDate,
    notes: data.notes,
  }).where(and(eq(manuscripts.id, manuscriptId), eq(manuscripts.userId, userId)));
  
  if (data.tagIds !== undefined) {
    await db.delete(manuscriptTags).where(eq(manuscriptTags.manuscriptId, manuscriptId));
    if (data.tagIds.length > 0) {
      await db.insert(manuscriptTags).values(
        data.tagIds.map((tagId: number) => ({ manuscriptId, tagId }))
      );
    }
  }
}

export async function deleteManuscript(manuscriptId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(manuscriptTags).where(eq(manuscriptTags.manuscriptId, manuscriptId));
  return db.delete(manuscripts).where(and(eq(manuscripts.id, manuscriptId), eq(manuscripts.userId, userId)));
}

// ===== CONFERENCES =====

export async function getUserConferences(userId: number, search?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query: any = db.select().from(conferences).where(eq(conferences.userId, userId));
  
  if (search) {
    query = db.select().from(conferences).where(
      and(eq(conferences.userId, userId), like(conferences.name, `%${search}%`))
    );
  }
  
  return query.orderBy(desc(conferences.startDate));
}

export async function getConferenceById(conferenceId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(conferences).where(
    and(eq(conferences.id, conferenceId), eq(conferences.userId, userId))
  );
  
  if (result.length === 0) return null;
  
  const conference = result[0];
  const tagIds = await db.select().from(conferenceTags).where(eq(conferenceTags.conferenceId, conferenceId));
  const conferenceTagList = await db.select().from(tags).where(inArray(tags.id, tagIds.map(t => t.tagId)));
  
  return { ...conference, tags: conferenceTagList };
}

export async function createConference(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conferences).values({
    userId,
    name: data.name,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    submissionDeadline: data.submissionDeadline,
    attendanceStatus: data.attendanceStatus || "interested",
    website: data.website,
    notes: data.notes,
  });
  
  if (data.tagIds && data.tagIds.length > 0) {
    const conferenceId = (result as any)?.insertId;
    if (conferenceId) {
      await db.insert(conferenceTags).values(
        data.tagIds.map((tagId: number) => ({ conferenceId, tagId }))
      );
    }
  }
  
  return result;
}

export async function updateConference(conferenceId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(conferences).set({
    name: data.name,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    submissionDeadline: data.submissionDeadline,
    attendanceStatus: data.attendanceStatus,
    website: data.website,
    notes: data.notes,
  }).where(and(eq(conferences.id, conferenceId), eq(conferences.userId, userId)));
  
  if (data.tagIds !== undefined) {
    await db.delete(conferenceTags).where(eq(conferenceTags.conferenceId, conferenceId));
    if (data.tagIds.length > 0) {
      await db.insert(conferenceTags).values(
        data.tagIds.map((tagId: number) => ({ conferenceId, tagId }))
      );
    }
  }
}

export async function deleteConference(conferenceId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(conferenceTags).where(eq(conferenceTags.conferenceId, conferenceId));
  return db.delete(conferences).where(and(eq(conferences.id, conferenceId), eq(conferences.userId, userId)));
}

// ===== MEETINGS =====

export async function getUserMeetings(userId: number, search?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query: any = db.select().from(meetings).where(eq(meetings.userId, userId));
  
  if (search) {
    query = db.select().from(meetings).where(
      and(eq(meetings.userId, userId), like(meetings.title, `%${search}%`))
    );
  }
  
  return query.orderBy(desc(meetings.date));
}

export async function getMeetingById(meetingId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(meetings).where(
    and(eq(meetings.id, meetingId), eq(meetings.userId, userId))
  );
  
  if (result.length === 0) return null;
  
  const meeting = result[0];
  const tagIds = await db.select().from(meetingTags).where(eq(meetingTags.meetingId, meetingId));
  const meetingTagList = await db.select().from(tags).where(inArray(tags.id, tagIds.map(t => t.tagId)));
  
  return { ...meeting, tags: meetingTagList, participants: meeting.participants ? JSON.parse(meeting.participants) : [] };
}

export async function createMeeting(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(meetings).values({
    userId,
    title: data.title,
    date: data.date,
    duration: data.duration,
    participants: JSON.stringify(data.participants || []),
    location: data.location,
    agenda: data.agenda,
    notes: data.notes,
  });
  
  if (data.tagIds && data.tagIds.length > 0) {
    const meetingId = (result as any)?.insertId;
    if (meetingId) {
      await db.insert(meetingTags).values(
        data.tagIds.map((tagId: number) => ({ meetingId, tagId }))
      );
    }
  }
  
  return result;
}

export async function updateMeeting(meetingId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(meetings).set({
    title: data.title,
    date: data.date,
    duration: data.duration,
    participants: JSON.stringify(data.participants || []),
    location: data.location,
    agenda: data.agenda,
    notes: data.notes,
  }).where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)));
  
  if (data.tagIds !== undefined) {
    await db.delete(meetingTags).where(eq(meetingTags.meetingId, meetingId));
    if (data.tagIds.length > 0) {
      await db.insert(meetingTags).values(
        data.tagIds.map((tagId: number) => ({ meetingId, tagId }))
      );
    }
  }
}

export async function deleteMeeting(meetingId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(meetingTags).where(eq(meetingTags.meetingId, meetingId));
  return db.delete(meetings).where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)));
}

// ===== REMINDERS =====

export async function getUserReminders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reminders).where(eq(reminders.userId, userId));
}

export async function createReminder(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reminders).values({
    userId,
    activityType: data.activityType,
    activityId: data.activityId,
    reminderType: data.reminderType,
    daysBeforeEvent: data.daysBeforeEvent || 7,
    reminderTime: data.reminderTime || "09:00",
    isEnabled: data.isEnabled !== false,
  });
}

export async function updateReminder(reminderId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(reminders).set({
    daysBeforeEvent: data.daysBeforeEvent,
    reminderTime: data.reminderTime,
    isEnabled: data.isEnabled,
  }).where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

export async function deleteReminder(reminderId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(reminders).where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

export async function logReminderSent(reminderId: number, email: string, status: string = "sent", errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reminderLogs).values({
    reminderId,
    email,
    status: status as any,
    errorMessage,
  });
}
