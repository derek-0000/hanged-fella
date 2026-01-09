import { z } from "zod";

export const appSchema = {
  body: z.object({
    text: z.string(),
    user_name: z.string(),
  }),
};

export type AppSchema = z.infer<typeof appSchema.body>;
