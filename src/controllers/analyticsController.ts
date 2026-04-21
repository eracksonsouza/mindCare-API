import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const EMOTION_LABELS: Record<string, string> = {
  happy: "Feliz",
  calm: "Calmo",
  neutral: "Neutro",
  anxious: "Ansioso",
  sad: "Triste",
};

const DAY_NAMES_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface DayData {
  day: string;
  dayName: string;
  intensity: number;
  emotionValue: string;
  emotion: string;
}

export async function getWeeklyAnalytics(_req: Request, res: Response) {
  try {
  const tokenId = res.locals.tokenId as string;

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const checkIns = await prisma.checkIn.findMany({
    where: {
      tokenId,
      timestamp: { gte: sevenDaysAgo },
    },
    orderBy: { timestamp: "asc" },
  });

  if (checkIns.length === 0) {
    res.json({
      weekData: [],
      average: 0,
      saddestDay: null,
      happiestDay: null,
      insight: "Você ainda não tem check-ins registrados.",
    });
    return;
  }

  const weekData: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);

    const dayCheckIns = checkIns.filter((c) => {
      const d = new Date(c.timestamp);
      return d >= date && d < next;
    });

    let intensity = 0;
    let emotionValue = "neutral";
    if (dayCheckIns.length > 0) {
      const last = dayCheckIns[dayCheckIns.length - 1];
      emotionValue = last.emotion;
      intensity = last.intensity;
    }

    weekData.push({
      day: date.getDate().toString(),
      dayName: DAY_NAMES_SHORT[date.getDay()],
      intensity,
      emotionValue,
      emotion: EMOTION_LABELS[emotionValue] ?? emotionValue,
    });
  }

  const valid = weekData.filter((d) => d.intensity > 0);
  const average =
    valid.length > 0
      ? Math.round((valid.reduce((s, d) => s + d.intensity, 0) / valid.length) * 10) / 10
      : 0;

  const sadDays = weekData.filter(
    (d) => d.emotionValue === "sad" || d.emotionValue === "anxious"
  );
  const saddestDay =
    sadDays.length > 0
      ? sadDays.reduce((p, c) => (p.intensity > c.intensity ? p : c))
      : null;

  const happyDays = weekData.filter(
    (d) => d.emotionValue === "happy" || d.emotionValue === "calm"
  );
  const happiestDay =
    happyDays.length > 0
      ? happyDays.reduce((p, c) => (p.intensity > c.intensity ? p : c))
      : null;

  let insight = "Você teve uma semana ";
  if (average >= 7) insight += "geralmente positiva. Suas emoções parecem equilibradas.";
  else if (average >= 5) insight += "com altos e baixos. É normal ter dias diferentes.";
  else insight += "mais desafiadora. Lembre-se de ser gentil consigo mesmo.";

  if (saddestDay) {
    insight += ` ${saddestDay.dayName} foi um dia mais difícil (${saddestDay.emotion}, ${saddestDay.intensity}/10).`;
  }
  if (happiestDay) {
    insight += ` ${happiestDay.dayName} foi um dia especialmente bom.`;
  }

  res.json({ weekData, average, saddestDay, happiestDay, insight });
  } catch {
    res.status(500).json({ error: "Erro ao calcular analytics" });
  }
}
