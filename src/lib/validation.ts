import { z } from "zod";
import { MIN_THRESHOLD, MAX_THRESHOLD, DEFAULT_THRESHOLD_CELSIUS } from "./constants";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export const checkRequestSchema = z.object({
  postcode: z
    .string()
    .trim()
    .regex(UK_POSTCODE_REGEX, "Enter a valid UK postcode"),
  thresholdCelsius: z
    .number()
    .min(MIN_THRESHOLD)
    .max(MAX_THRESHOLD)
    .default(DEFAULT_THRESHOLD_CELSIUS),
});

export type CheckRequest = z.infer<typeof checkRequestSchema>;
