import { z } from "zod";

export const hangedFellaSchema = {
  body: z.object({
    text: z.string(),
    user_name: z.optional(z.string()),
  }),
};
