import { Request, Response } from "express";
import { ContentPage } from "../models/ContentPage";
import { User } from "../models/User";
import { hasAccess, Level } from "../models/Level";

// Skapa en ny innehållssida
// (requireAuth + requireAdmin körs redan i routen, så vi behöver inte kolla isAdmin här)
export const createContentPage = async (req: Request, res: Response) => {
  try {
    const newPage = new ContentPage({
      ...req.body,           // title, plantName, category, careInstructions osv skickas från frontend
      createdBy: req.userId,
    });

    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte skapa innehållssida", error });
  }
};

// Hämta alla innehållssidor (för listvyn)
export const getAllContentPages = async (req: Request, res: Response) => {
  try {
    const pages = await ContentPage.find();

    // Admin ser allt (t.ex. i adminvyn, för att kunna redigera)
    if (req.isAdmin) {
      return res.json(pages);
    }

    // Vanlig användare, filtrera bort sidor de inte har åtkomst till
    // Nivån finns inte i token, så vi hämtar användaren från databasen
    const user = await User.findById(req.userId);
    const userLevel = user?.level ?? Level.GRUNDPAKET;

    const filtered = pages.filter((page) =>
      hasAccess(userLevel, page.requiredLevel)
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta innehållssidor", error });
  }
};

// Hämta en innehållssida, uppgraderingsförslag sker här
export const getContentPageById = async (req: Request, res: Response) => {
  try {
    const page = await ContentPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Sidan hittades inte" });
    }

    // Admin ser alltid allt
    if (req.isAdmin) {
      return res.json(page);
    }

    const user = await User.findById(req.userId);
    const userLevel = user?.level ?? Level.GRUNDPAKET;

    if (!hasAccess(userLevel, page.requiredLevel)) {
      return res.status(403).json({
        message: "Din nivå räcker inte för denna sida",
        requiredLevel: page.requiredLevel,   // frontend kan visa "uppgradera till X"
        upgrade: true,
      });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta sidan", error });
  }
};

// Uppdatera en innehållssida, admin
export const updateContentPage = async (req: Request, res: Response) => {
  try {
    const updated = await ContentPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true ger tillbaka den uppdaterade versionen
    );

    if (!updated) {
      return res.status(404).json({ message: "Sidan hittades inte" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte uppdatera sidan", error });
  }
};

// Ta bort en innehållssida, admin
export const deleteContentPage = async (req: Request, res: Response) => {
  try {
    const deleted = await ContentPage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Sidan hittades inte" });
    }

    res.json({ message: "Sidan borttagen" });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte ta bort sidan", error });
  }
};