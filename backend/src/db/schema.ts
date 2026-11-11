// UniConnect database schema (PostgreSQL, via Drizzle ORM).
// After changing this file run `npm run db:generate` then `npm run db:migrate`.

import {
  pgTable, pgEnum, uuid, text, integer, boolean, timestamp, primaryKey, index, uniqueIndex, jsonb,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['STUDENT', 'LECTURER', 'STAFF']);
export const staffTypeEnum = pgEnum('staff_type', ['ACADEMIC', 'NON_ACADEMIC']);
export const verificationEnum = pgEnum('verification_status', ['NONE', 'PENDING', 'VERIFIED', 'REJECTED']);
export const badgeEnum = pgEnum('badge', ['STUDENT', 'LECTURER', 'EXECUTIVE', 'STAFF']);
export const postKindEnum = pgEnum('post_kind', ['FEED', 'STATUS']);
export const mediaTypeEnum = pgEnum('media_type', ['TEXT', 'IMAGE', 'VIDEO']);
export const adminRoleEnum = pgEnum('admin_role', ['SUPER_ADMIN', 'ADMIN']);
export const requestStatusEnum = pgEnum('request_status', ['PENDING', 'APPROVED', 'REJECTED']);
export const reportStatusEnum = pgEnum('report_status', ['OPEN', 'RESOLVED', 'DISMISSED']);
export const communityRoleEnum = pgEnum('community_role', ['OWNER', 'MODERATOR', 'MEMBER']);
export const communityKindEnum = pgEnum('community_kind', ['COURSE', 'DEPARTMENT', 'CLUB', 'STUDY_GROUP', 'GENERAL']);
export const conversationKindEnum = pgEnum('conversation_kind', ['DIRECT', 'COMMUNITY']);
export const liveKindEnum = pgEnum('live_kind', ['TUTORIAL', 'CLASS', 'MEETING']);
export const liveStatusEnum = pgEnum('live_status', ['SCHEDULED', 'LIVE', 'ENDED']);

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const faculties = pgTable('faculties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  campus: text('campus'),
});

export const departments = pgTable(
  'departments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    facultyId: uuid('faculty_id').notNull().references(() => faculties.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('departments_faculty_name').on(t.facultyId, t.name)],
);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash'),
    googleId: text('google_id').unique(),
    fullName: text('full_name').notNull(),
    username: text('username').notNull().unique(),
    role: roleEnum('role').notNull().default('STUDENT'),
    staffType: staffTypeEnum('staff_type'),
    matricNo: text('matric_no'),
    level: integer('level'),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    facultyId: uuid('faculty_id').references(() => faculties.id),
    departmentId: uuid('department_id').references(() => departments.id),
    verification: verificationEnum('verification').notNull().default('NONE'),
    badge: badgeEnum('badge'),
    executiveOffice: text('executive_office'),
    profileComplete: boolean('profile_complete').notNull().default(false),
    tokenVersion: integer('token_version').notNull().default(0),
    failedLogins: integer('failed_logins').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    adminRole: adminRoleEnum('admin_role'),
    adminPermissions: text('admin_permissions').array().notNull().default([]),
    totpSecret: text('totp_secret'),
    totpEnabled: boolean('totp_enabled').notNull().default(false),
    suspendedAt: timestamp('suspended_at', { withTimezone: true }),
    suspendReason: text('suspend_reason'),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('users_faculty').on(t.facultyId), index('users_department').on(t.departmentId)],
);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: postKindEnum('kind').notNull().default('FEED'),
    mediaType: mediaTypeEnum('media_type').notNull().default('TEXT'),
    text: text('text'),
    mediaUrl: text('media_url'),
    background: text('background'),
    font: text('font'),
    facultyId: uuid('faculty_id').references(() => faculties.id),
    departmentId: uuid('department_id').references(() => departments.id),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    communityId: uuid('community_id').references((): AnyPgColumn => communities.id, { onDelete: 'cascade' }),
    viewCount: integer('view_count').notNull().default(0),
    clickCount: integer('click_count').notNull().default(0),
    likeCount: integer('like_count').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0),
    replyCount: integer('reply_count').notNull().default(0),
    shareCount: integer('share_count').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    index('posts_kind_created').on(t.kind, t.createdAt),
    index('posts_author_created').on(t.authorId, t.createdAt),
    index('posts_department_created').on(t.departmentId, t.createdAt),
    index('posts_faculty_created').on(t.facultyId, t.createdAt),
    index('posts_expires').on(t.expiresAt),
    index('posts_community_created').on(t.communityId, t.createdAt),
  ],
);

export const likes = pgTable(
  'likes',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] }), index('likes_post').on(t.postId)],
);

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('comments_post_created').on(t.postId, t.createdAt), index('comments_parent').on(t.parentId)],
);

export const postViews = pgTable(
  'post_views',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
);

export const shares = pgTable(
  'shares',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [index('shares_post').on(t.postId)],
);

export const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.followerId, t.followingId] }), index('follows_following').on(t.followingId)],
);

export const verificationRequests = pgTable(
  'verification_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: badgeEnum('type').notNull(),
    executiveOffice: text('executive_office'),
    note: text('note'),
    status: requestStatusEnum('status').notNull().default('PENDING'),
    reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
    reviewNote: text('review_note'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('verification_status_created').on(t.status, t.createdAt), index('verification_user').on(t.userId)],
);

export const verificationDocuments = pgTable('verification_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().references(() => verificationRequests.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  storedName: text('stored_name').notNull(),
  mimeType: text('mime_type').notNull(),
  originalName: text('original_name'),
  createdAt: createdAt(),
});

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reporterId: uuid('reporter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    details: text('details'),
    status: reportStatusEnum('status').notNull().default('OPEN'),
    action: text('action'),
    resolvedBy: uuid('resolved_by').references(() => users.id, { onDelete: 'set null' }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('reports_status_created').on(t.status, t.createdAt)],
);

export const adminActions = pgTable(
  'admin_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    details: jsonb('details'),
    createdAt: createdAt(),
  },
  (t) => [index('admin_actions_created').on(t.createdAt)],
);

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const communities = pgTable(
  'communities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    kind: communityKindEnum('kind').notNull().default('GENERAL'),
    courseCode: text('course_code'),
    avatarUrl: text('avatar_url'),
    isPrivate: boolean('is_private').notNull().default(false),
    inviteCode: text('invite_code').notNull().unique(),
    facultyId: uuid('faculty_id').references(() => faculties.id, { onDelete: 'set null' }),
    departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    memberCount: integer('member_count').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index('communities_department').on(t.departmentId), index('communities_faculty').on(t.facultyId)],
);

export const communityMembers = pgTable(
  'community_members',
  {
    communityId: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: communityRoleEnum('role').notNull().default('MEMBER'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.communityId, t.userId] }), index('community_members_user').on(t.userId)],
);

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  kind: conversationKindEnum('kind').notNull(),
  directKey: text('direct_key').unique(),
  communityId: uuid('community_id').unique().references(() => communities.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: createdAt(),
});

export const conversationMembers = pgTable(
  'conversation_members',
  {
    conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lastReadAt: timestamp('last_read_at', { withTimezone: true }).notNull().defaultNow(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] }), index('conversation_members_user').on(t.userId)],
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id').references(() => users.id, { onDelete: 'set null' }),
    text: text('text'),
    imageUrl: text('image_url'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('messages_conversation_created').on(t.conversationId, t.createdAt)],
);

export const liveSessions = pgTable(
  'live_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    hostId: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    kind: liveKindEnum('kind').notNull().default('TUTORIAL'),
    communityId: uuid('community_id').references(() => communities.id, { onDelete: 'cascade' }),
    roomName: text('room_name').notNull().unique(),
    status: liveStatusEnum('status').notNull().default('SCHEDULED'),
    attendeesCanPublish: boolean('attendees_can_publish').notNull().default(true),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    peakParticipants: integer('peak_participants').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index('live_status_scheduled').on(t.status, t.scheduledFor), index('live_community').on(t.communityId)],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    communityId: uuid('community_id').references(() => communities.id, { onDelete: 'cascade' }),
    liveSessionId: uuid('live_session_id').references(() => liveSessions.id, { onDelete: 'cascade' }),
    text: text('text'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('notifications_user_created').on(t.userId, t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type LiveSession = typeof liveSessions.$inferSelect;
