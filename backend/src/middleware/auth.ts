import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Utöka Express Request så vi kan lägga på inloggad användares info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      isAdmin?: boolean;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Ingen token skickades med" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.isAdmin = payload.isAdmin;
    next();
  } catch {
    return res.status(401).json({ error: "Ogiltig eller utgången token" });
  }
}

// Används av Linn på admin-routes för innehållssidor
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Kräver administratörsbehörighet" });
  }
  next();
}
