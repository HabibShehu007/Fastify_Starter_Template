// src/routes/base-routes/base.routes.ts
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { healthCheckResponseSchema } from "@/validations/validations.schema.js";

export async function baseRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/",
    {
      schema: {
        tags: ["Health"],
        summary: "Health Check",
        description: "Verify server status and availability",
        response: {
          200: healthCheckResponseSchema,
        },
      },
    },
    async () => {
      return {
        success: true,
        message: "Server is running 🚀",
        timestamp: new Date().toISOString(),
      };
    },
  );
}
