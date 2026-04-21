import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import tokenRouter from "./routes/token";
import checkinsRouter from "./routes/checkins";
import analyticsRouter from "./routes/analytics";
import journalRouter from "./routes/journal";

const app = express();
const PORT = process.env.PORT || 3333;

const corsOrigins = (process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "50kb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/token", tokenRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/journal", journalRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`MindCare API rodando em http://localhost:${PORT}`);
});
