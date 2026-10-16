import dotenv from "dotenv";
import { AppConfigs } from "@/configs/app.config.js";
import { baseRoutes } from "@/routes/base-routes/base.routes.js";

dotenv.config();

const PORT = Number(process.env.PORT);

const startServer = async () => {
  try {
    const fastify = await AppConfigs();

    // Register route modules right here in the entry point
    await fastify.register(baseRoutes);

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    fastify.log.info(`🚀 Server running at http://localhost:${PORT}`);
    fastify.log.info(
      `📚 Swagger Docs available at http://localhost:${PORT}/docs`,
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
