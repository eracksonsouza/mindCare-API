import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyExpress from "@fastify/express";
import express, { NextFunction, Request, Response } from "express";
import tokenRouter from "./routes/token";
import checkinsRouter from "./routes/checkins";
import analyticsRouter from "./routes/analytics";
import journalRouter from "./routes/journal";
import authRouter from "./routes/auth";

const app = Fastify();
const PORT = Number(process.env.PORT ?? 3333);

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

async function bootstrap() {
  await app.register(fastifyCors, {
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  });

  await app.register(fastifyExpress);
  app.use(express.json({ limit: "50kb" }));

  app.get("/health", async (_req, reply) => reply.send({ ok: true }));

  app.use("/api/token", tokenRouter);
  app.use("/api/checkins", checkinsRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/journal", journalRouter);
  app.use("/api/auth", authRouter);

  app.setNotFoundHandler((_req, reply) => {
    reply.status(404).send({ error: "Rota não encontrada" });
  });

  app.setErrorHandler((err: Error, _req, reply) => {
    reply.status(500).send({ error: "Erro interno do servidor" });
  });

  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`MindCare API rodando em http://localhost:${PORT}`);
}

bootstrap().catch((err: Error) => {
  console.error("Falha ao iniciar servidor", err);
  process.exit(1);
});
