import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const gameStatusEnum = pgEnum("game_status", ["started", "finished"]);

export const games = pgTable("games", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(6)),
  answer: text("answer").notNull(),
  guessProgress: text("guess_progress").notNull(),
  status: gameStatusEnum("status").notNull().default("started"),
  attempts: integer("attempts").notNull().default(0),
  won: boolean("won").default(false).notNull(),
  guessedLetters: text("guessed_letters").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
