import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const token = authHeader.slice(7);
    const syncToken = await prisma.syncToken.findUnique({ where: { token } });

    if (!syncToken) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }

    res.locals.tokenId = syncToken.id;
    next();
  } catch {
    res.status(500).json({ error: "Erro de autenticação" });
  }
}
