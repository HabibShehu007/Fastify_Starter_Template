// src/configs/app.config.ts

import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

export async function AppConfigs(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
          colorize: true,
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Set Zod Compilers
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Plugins
  await fastify.register(cors, {
    origin: true,
  });

  // Swagger with Zod JSON Schema Transform
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Fastify Starter API",
        description:
          "API Documentation for Real-Time QR Code Restaurant Menu System",
        version: "1.0.0",
      },
      tags: [
        { name: "Health", description: "System health and status operations" },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });

  return fastify;
}
