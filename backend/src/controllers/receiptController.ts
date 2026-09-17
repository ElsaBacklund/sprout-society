import { Request, Response } from "express";
import { Receipt } from "../models/Receipt";

export async function getMyReceipts(req: Request, res: Response) {
  try {
    const receipts = await Receipt.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ receipts });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta kvitton" });
  }
}
