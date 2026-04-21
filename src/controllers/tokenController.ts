import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export async function createToken(req: Request, res: Response) {
  try {
    const { nickname } = req.body;
    const token = randomUUID();
    const syncToken = await prisma.syncToken.create({
      data: {
        token,
        nickname: typeof nickname === "string" && nickname.trim() ? nickname.trim().slice(0, 50) : null,
      },
    });
    res.status(201).json({ token: syncToken.token, nickname: syncToken.nickname });
  } catch {
    res.status(500).json({ error: "Erro ao criar token" });
  }
}
