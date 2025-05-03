import { z } from "zod";

export const FormSchema = z
  .object({
    title: z.string().min(1, {
      message: "Title is required.",
    }),
    content: z.string().min(1, {
      message: "Content is required.",
    }),
    minParticipants: z.coerce.number().min(1, "Minimum participants should be more than 0."),
    deadline: z.date({
      message: "Deadline is required.",
    }),
    resultDeadline: z.date({
      message: "Result deadline is required.",
    }),
    totalWinners: z.coerce.number().min(1, "Must have at least 1 winner"),
    prizes: z.array(
      z.object({
        value: z.coerce.number().positive("Value must be greater than 0")
      })
    ),
    bountyType: z.coerce.number().min(0, "Bounty type is required"),
  })
  .refine((data) => data.deadline < data.resultDeadline, {
    message: "Deadline must be earlier than result deadline",
    path: ["deadline"],
  });
