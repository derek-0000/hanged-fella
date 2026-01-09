import { Context } from "elysia";
import { db } from "../../db";
import { games } from "../../db/schema";
import { HangedFella } from "../hanged-fella";
import { AppSchema } from "../schemas";
import { SlackResponse } from "../slack-responses";

export default async function createController({
  body,
}: Context<{ body: AppSchema }>) {
  const { text, user_name: userName } = body;

  const [answer] = text.split(" ");

  const hangedFella = new HangedFella(answer);

  const { guessProgress } = hangedFella;

  try {
    const [newGame] = await db
      .insert(games)
      .values({
        answer,
        guessProgress,
        won: false,
      })
      .returning();

    return SlackResponse.generateResponse(
      (r) => r.createGameSuccess(newGame.id, userName, guessProgress),
      "ephemeral"
    );
  } catch (error) {
    return SlackResponse.generateResponse(
      (r) => r.createGameError,
      "ephemeral"
    );
  }
}
