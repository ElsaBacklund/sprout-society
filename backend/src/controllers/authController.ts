import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { Level, LEVEL_DISPLAY_NAME } from "../models/Level";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email och password krävs" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "E-postadressen är redan registrerad" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      level: Level.GRUNDPAKET,
    });

    const token = signToken({ userId: user.id, isAdmin: user.isAdmin });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        levelName: LEVEL_DISPLAY_NAME[user.level],
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Något gick fel vid registrering" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email och password krävs" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Fel e-post eller lösenord" });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ error: "Fel e-post eller lösenord" });
    }

    const token = signToken({ userId: user.id, isAdmin: user.isAdmin });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        levelName: LEVEL_DISPLAY_NAME[user.level],
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Något gick fel vid inloggning" });
  }
}

// JWT är stateless, så utloggning sker egentligen på klienten (token tas bort).
// Denna route finns ändå med eftersom uppgiften kräver en utloggningsfunktion.
export async function logout(_req: Request, res: Response) {
  res.json({ message: "Utloggad. Ta bort token på klientsidan." });
}
