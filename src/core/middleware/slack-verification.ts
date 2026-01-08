import { Elysia } from "elysia";
import crypto from "crypto";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

if (!SLACK_SIGNING_SECRET) {
  throw new Error("SLACK_SIGNING_SECRET environment variable is required");
}

export const slackVerificationMiddleware = new Elysia({
  name: "slack-verification",
})
  .derive(async ({ request }) => {
    const rawBody = await request.clone().text();
    return { rawBody };
  })
  .onBeforeHandle(async ({ request, rawBody, set }) => {
    const timestamp = request.headers.get("X-Slack-Request-Timestamp");
    const slackSignature = request.headers.get("X-Slack-Signature");

    if (!timestamp || !slackSignature) {
      set.status = 401;
      return { error: "Missing Slack signature headers" };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - parseInt(timestamp)) > 60 * 5) {
      set.status = 401;
      return { error: "Request timestamp is too old" };
    }

    const sigBasestring = `v0:${timestamp}:${rawBody}`;

    const mySignature =
      "v0=" +
      crypto
        .createHmac("sha256", SLACK_SIGNING_SECRET)
        .update(sigBasestring)
        .digest("hex");

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(mySignature),
        Buffer.from(slackSignature)
      );

      if (!isValid) {
        set.status = 401;
        return { error: "Invalid Slack signature" };
      }
    } catch {
      set.status = 401;
      return { error: "Invalid Slack signature" };
    }
  });
