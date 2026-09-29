// src/validations/validations.schema.ts

import { z } from "zod";

export const healthCheckResponseSchema = z
  .object({
    success: z
      .boolean()
      .describe("Indicates if the server is up and running successfully"),
    message: z.string().describe("Status message from the server"),
    timestamp: z
      .string()
      .describe("ISO timestamp of when the check was performed"),
  })
  .describe("Health Check Response");
