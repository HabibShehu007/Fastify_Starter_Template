import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";

dotenv.config();

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
});

// Plugins
await fastify.register(cors, {
  origin: true,
});

// Swagger
await fastify.register(swagger, {
  openapi: {
    info: {
      title: "API Documentation",
      description: "Starter Fastify Backend",
      version: "1.0.0",
    },
  },
});

await fastify.register(swaggerUi, {
  routePrefix: "/docs",
});

// Health Check
fastify.get(
  "/",
  {
    schema: {
      tags: ["Health"],
      summary: "Health Check",
      description: "Verify server status",
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            timestamp: { type: "string" },
          },
        },
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

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    fastify.log.info(`🚀 Server running at http://localhost:${PORT}`);

    fastify.log.info(
      `📚 Swagger Docs available at http://localhost:${PORT}/docs`,
    );
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

startServer();
