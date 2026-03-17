import { z } from "zod";

export const messageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("GET_STATE"),
  }),

  z.object({
    type: z.literal("CREATE_TICKET"),
    payload: z.object({
      isPreferential: z.boolean("isPreferential is required"),
    }),
  }),

  z.object({
    type: z.literal("REQUEST_NEXT_TICKET"),
    payload: z.object({
      deskNumber: z.number("deskNumber is required").int().positive(),
      forceNormalTicket: z.boolean("forceNormalTicket is requiered"),
    }),
  }),

  z.object({
    type: z.literal("RESET_QUEUE"),
  }),
]);

export type MessageParsed = z.infer<typeof messageSchema>;
