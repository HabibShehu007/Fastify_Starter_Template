// src/configs/app.config.ts

import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import rateLimit from "@fastify/rate-limit";

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

  // Global Plugins
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  // rate limit globall register
  await fastify.register(rateLimit, {
    global: false, // 🎯 Crucial: Disables blanket limiting on all routes by default!
  });

  // JWT Authentication Plugin
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || "fallback_super_secret_key",
  });

  // Swagger with Zod JSON Schema Transform
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Digital Restaurant Menu API",
        description:
          "API Documentation for Real-Time QR Code Restaurant Menu System",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Auth",
          description: "Restaurant and staff authentication operations",
        },
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
