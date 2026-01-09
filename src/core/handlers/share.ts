import { eq } from "drizzle-orm";
import { db } from "../../db";
import { games } from "../../db/schema";
import { SlackResponse } from "../slack-responses";
import { tryCatch } from "../utils/tryCatch";
import { AppSchema } from "../schemas";
import { Context } from "elysia";

export default async function shareController({
  body,
}: Context<{ body: AppSchema }>) {
  const { text, user_name: userName } = body;

  const [gameId] = text.split(" ");

  const { data: gameData, error: gameDataError } = await tryCatch(
    db.select().from(games).where(eq(games.id, gameId)).limit(1)
  );

  if (gameDataError) {
    return SlackResponse.generateResponse((r) => r.genericError, "ephemeral");
  }

  return SlackResponse.generateResponse((r) =>
    r.shareGameSuccess(gameId, userName, gameData[0].guessProgress)
  );
}
