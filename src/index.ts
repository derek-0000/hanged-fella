import { Elysia } from "elysia";
import { SlackResponse } from "./core/slack-responses";
import { db } from "./db";
import { games } from "./db/schema";
import { eq } from "drizzle-orm";
import { tryCatch } from "./core/utils/tryCatch";
import { HangedFella } from "./core/hanged-fella";
import { slackVerificationMiddleware } from "./core/middleware/slack-verification";
import { hangedFellaSchema } from "./core/schemas";

export default new Elysia()
  .use(slackVerificationMiddleware)
  .post(
    "/slack/events",
    async ({ body }) => {
      const { text, user_name: userName } = body;
      const [action, ...rest] = text.split(" ");

      if (action === "start" && userName) {
        const [answer] = rest;

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

          return SlackResponse.generateResponse((r) =>
            r.createGameSuccess(newGame.id, userName, guessProgress)
          );
        } catch (error) {
          return SlackResponse.generateResponse((r) => r.createGameError);
        }
      }

      if (action === "guess") {
        const [gameId, guess] = rest;

        const { data: gameData, error: gameDataError } = await tryCatch(
          db.select().from(games).where(eq(games.id, gameId)).limit(1)
        );

        if (gameDataError) {
          return SlackResponse.generateResponse((r) => r.genericError);
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

        const hangedFella = new HangedFella(
          answer,
          guessProgress,
          game.attempts
        );

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
            r.wrongGuess(guess, game.attempts)
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
            return SlackResponse.generateResponse((r) => r.genericError);
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
            return SlackResponse.generateResponse((r) => r.genericError);
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
          return SlackResponse.generateResponse((r) => r.genericError);
        }

        const [updatedWonGame] = wonGame;

        return SlackResponse.generateResponse((r) =>
          r.won(updatedWonGame.answer)
        );
      }

      if (action === "help") {
        return SlackResponse.generateResponse((r) => r.help);
      }

      return SlackResponse.generateResponse((r) => r.wrongAction);
    },
    hangedFellaSchema
  )
  .listen(3000);

console.log(
  `☕ Hanged Fella is running at ${app.server?.hostname}:${app.server?.port}`
);
