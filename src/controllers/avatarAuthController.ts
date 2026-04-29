import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const MIN_PASSWORD_LENGTH = 6;

export async function register(req: Request, res: Response) {
  try {
    const { avatarName, password } = req.body;

    if (
      typeof avatarName !== "string" ||
      avatarName.trim().length < 3 ||
      avatarName.trim().length > 30
    ) {
      res.status(400).json({ error: "avatarName deve ter entre 3 e 30 caracteres" });
      return;
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ error: `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres` });
      return;
    }

    const name = avatarName.trim();
    const existing = await prisma.avatarUser.findUnique({ where: { avatarName: name } });
    if (existing) {
      res.status(409).json({ error: "Avatar já existe" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.avatarUser.create({
      data: { avatarName: name, passwordHash },
    });

    const token = jwt.sign({ sub: user.id, avatarName: user.avatarName }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.status(201).json({ token });
  } catch {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { avatarName, password } = req.body;

    if (typeof avatarName !== "string" || typeof password !== "string") {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const user = await prisma.avatarUser.findUnique({ where: { avatarName: avatarName.trim() } });
    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ sub: user.id, avatarName: user.avatarName }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.status(200).json({ token });
  } catch {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
