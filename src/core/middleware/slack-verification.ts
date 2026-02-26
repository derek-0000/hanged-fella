import crypto from "crypto";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

if (!SLACK_SIGNING_SECRET) {
  throw new Error("SLACK_SIGNING_SECRET environment variable is required");
}

type SlackVerificationError = { error: string };

export async function verifySlackRequest(
  request: Request
): Promise<SlackVerificationError | null> {
  const timestamp = request.headers.get("X-Slack-Request-Timestamp");
  const slackSignature = request.headers.get("X-Slack-Signature");

  if (!timestamp || !slackSignature) {
    return { error: "Missing Slack signature headers" };
  }

  const parsedTimestamp = Number(timestamp);
  if (!Number.isInteger(parsedTimestamp)) {
    return { error: "Invalid request timestamp" };
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parsedTimestamp) > 60 * 5) {
    return { error: "Request timestamp is too old" };
  }

  const rawBody = await request.clone().text();
  const sigBasestring = `v0:${timestamp}:${rawBody}`;

  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET as string)
      .update(sigBasestring)
      .digest("hex");

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(mySignature),
      Buffer.from(slackSignature)
    );

    if (!isValid) {
      return { error: "Invalid Slack signature" };
    }
  } catch {
    return { error: "Invalid Slack signature" };
  }

  return null;
}
