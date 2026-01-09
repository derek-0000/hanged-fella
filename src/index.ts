import { Elysia } from "elysia";
import { SlackResponse } from "./core/slack-responses";
import { slackVerificationMiddleware } from "./core/middleware/slack-verification";
import { appSchema } from "./core/schemas";
import staticPlugin from "@elysiajs/static";
import guessController from "./core/handlers/guess";
import shareController from "./core/handlers/share";
import createController from "./core/handlers/create";
import path from "path";

export default new Elysia()
  .use(staticPlugin({ assets: path.join(import.meta.dir, "../public") }))
  .get("/", () => Bun.file(path.join(import.meta.dir, "../public/index.html")))
  .use(slackVerificationMiddleware)
  .post("/slack/events/guess", guessController, appSchema)
  .post("/slack/events/create", createController, appSchema)
  .post("/slack/events/share", shareController, appSchema)
  .post("/slack/events/help", () =>
    SlackResponse.generateResponse((r) => r.help)
  )
  .listen(3003);

console.log(`☕ Hanged Fella is running`);
