import { pgTable, varchar, uuid, timestamp, uniqueIndex, boolean } from 'drizzle-orm/pg-core';

export const clubs = pgTable('clubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  groupId: varchar('group_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    groupIdIdx: uniqueIndex('group_id_idx').on(table.groupId),
  }
});

export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: varchar('address').notNull(),
  clubId: uuid('club_id')
    .notNull()
    .references(() => clubs.id),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: varchar('address').notNull(),
  username: varchar('username').notNull(),
  email: varchar('email').notNull(),
  bio: varchar('bio').notNull(),
  profilePicture: varchar('profile_picture'),
  isCompleteProfile: boolean('is_complete_profile').default(false),
  attestationId: varchar('attestation_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    addressIdx: uniqueIndex('address_idx').on(table.address),
    usernameIdx: uniqueIndex('username_idx').on(table.username),
    emailIdx: uniqueIndex('email_idx').on(table.email),
  }
});