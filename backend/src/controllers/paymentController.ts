import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User";
import { Receipt } from "../models/Receipt";
import { Level, LEVEL_PRICE, LEVEL_DISPLAY_NAME } from "../models/Level";

// Simulerar ett betalsteg (ingen riktig betalleverantör).
export async function selectLevel(req: Request, res: Response) {
  try {
    const { level } = req.body as { level: Level };

    if (!Object.values(Level).includes(level)) {
      return res.status(400).json({ error: "Ogiltig nivå angiven" });
    }

    const userId = req.userId!;
    const amount = LEVEL_PRICE[level];

    // --- Låtsas-betalsteg ---
    // Här skulle en riktig betallösning anropas. Vi simulerar en lyckad
    // betalning direkt och skapar ett transaktions-id.
    const transactionId = crypto.randomUUID();

    const receipt = await Receipt.create({
      user: userId,
      level,
      amount,
      transactionId,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { level },
      { new: true }
    );

    res.json({
      message: "Betalning genomförd (simulerad)",
      newLevel: user?.level,
      newLevelName: user ? LEVEL_DISPLAY_NAME[user.level] : undefined,
      receipt,
    });
  } catch (error) {
    res.status(500).json({ error: "Något gick fel vid val av nivå" });
  }
}
