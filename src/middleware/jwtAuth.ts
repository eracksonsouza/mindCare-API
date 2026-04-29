import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  avatarName: string;
}

declare global {
  namespace Express {
    interface Locals {
      jwtPayload: JwtPayload;
    }
  }
}

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET ?? "change-me";

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    res.locals.jwtPayload = payload;
    next();
  } catch {
    res.status(401).json({ error: "Não autorizado" });
  }
}
