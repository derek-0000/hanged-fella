import { Elysia } from "elysia";
import { SlackResponse } from "./core/slack-responses";
import { verifySlackRequest } from "./core/middleware/slack-verification";
import { appSchema } from "./core/schemas";
import guessController from "./core/handlers/guess";
import shareController from "./core/handlers/share";
import createController from "./core/handlers/create";
import indexHandler from "./core/handlers";

export default new Elysia()
  .get("/", indexHandler)
  .guard(
    {
      async beforeHandle({ request, set }) {
        const verificationError = await verifySlackRequest(request);

        if (verificationError) {
          set.status = 401;
          return verificationError;
        }
      },
    },
    (app) =>
      app
        .post("/slack/events/guess", guessController, appSchema)
        .post("/slack/events/create", createController, appSchema)
        .post("/slack/events/share", shareController, appSchema)
        .post("/slack/events/help", () =>
          SlackResponse.generateResponse((r) => r.help)
        )
  )
  .listen(3003);

console.log(`☕ Hanged Fella is running`);
