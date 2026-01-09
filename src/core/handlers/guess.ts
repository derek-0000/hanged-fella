import { eq } from "drizzle-orm";
import { db } from "../../db";
import { games } from "../../db/schema";
import { HangedFella } from "../hanged-fella";
import { SlackResponse } from "../slack-responses";
import { tryCatch } from "../utils/tryCatch";
import { Context } from "elysia";
import { AppSchema } from "../schemas";

export default async function guessController({
  body,
}: Context<{ body: AppSchema }>) {
  const { text } = body;
  const [gameId, ...guessArr] = text.split(" ");

  const guess = guessArr.join(" ");

  const { data: gameData, error: gameDataError } = await tryCatch(
    db.select().from(games).where(eq(games.id, gameId)).limit(1)
  );

  if (gameDataError) {
    return SlackResponse.generateResponse((r) => r.genericError, "ephemeral");
  }

  const [game] = gameData;

  if (game.won) {
    return SlackResponse.generateResponse((r) => r.alreadyWon);
  }

  if (!game.won && game.status === "finished") {
    return SlackResponse.generateResponse((r) => r.loss(game.answer));
  }

  const { answer, guessedLetters, guessProgress } = game;

  if (guessedLetters.includes(guess)) {
    return SlackResponse.generateResponse((r) => r.alreadyGuessed(guess));
  }

  const hangedFella = new HangedFella(answer, guessProgress, game.attempts);

  const { result, progress } = hangedFella.updateProgress(guess);

  if (result === "incorrect") {
    await tryCatch(
      db
        .update(games)
        .set({
          attempts: game.attempts + 1,
          guessedLetters: `${guessedLetters}${guess},`,
        })
        .where(eq(games.id, gameId))
    );

    return SlackResponse.generateResponse((r) =>
      r.wrongGuess(guess, game.attempts, progress)
    );
  }

  if (result === "guessed") {
    const { data, error } = await tryCatch(
      db
        .update(games)
        .set({
          guessedLetters: `${guessedLetters}${guess},`,
          guessProgress: progress,
        })
        .where(eq(games.id, gameId))
        .returning()
    );

    if (error) {
      return SlackResponse.generateResponse((r) => r.genericError, "ephemeral");
    }

    const [updatedGame] = data;

    return SlackResponse.generateResponse((r) =>
      r.successfulGuess(guess, updatedGame.guessProgress)
    );
  }

  if (result === "loss") {
    const { data: lostGame, error: lostGameError } = await tryCatch(
      db
        .update(games)
        .set({
          guessedLetters: `${guessedLetters}${guess},`,
          guessProgress: progress,
          status: "finished",
          won: false,
        })
        .where(eq(games.id, gameId))
        .returning()
    );

    if (lostGameError) {
      return SlackResponse.generateResponse((r) => r.genericError, "ephemeral");
    }

    return SlackResponse.generateResponse((r) => r.loss(answer));
  }

  const { data: wonGame, error: wonGameError } = await tryCatch(
    db
      .update(games)
      .set({
        guessedLetters: `${guessedLetters}${guess},`,
        guessProgress: progress,
        status: "finished",
        won: true,
      })
      .where(eq(games.id, gameId))
      .returning()
  );

  if (wonGameError) {
    return SlackResponse.generateResponse((r) => r.genericError, "ephemeral");
  }

  const [updatedWonGame] = wonGame;

  return SlackResponse.generateResponse((r) => r.won(updatedWonGame.answer));
}
