import { Elysia } from "elysia";
import { SlackResponse } from "./core/slack-responses";
import { slackVerificationMiddleware } from "./core/middleware/slack-verification";
import { appSchema } from "./core/schemas";
import staticPlugin from "@elysiajs/static";
import startController from "./core/handlers/start";
import guessController from "./core/handlers/guess";

export default new Elysia()
  .use(staticPlugin())
  .get("/", () => Bun.file("public/index.html"))
  .use(slackVerificationMiddleware)
  .post("/slack/events/start", startController, appSchema)
  .post("/slack/events/guess", guessController, appSchema)
  .post("/slack/events/help", () =>
    SlackResponse.generateResponse((r) => r.help)
  )
  .listen(3003);

console.log(`☕ Hanged Fella is running`);
