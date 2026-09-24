import { Request, Response } from "express";
import { UserPlant } from "../models/UserPlant";
import { User } from "../models/User";
import { Level } from "../models/Level";
import { TIER_FEATURES } from "../config/tiers";

// POST /api/plants
// "Lägg till en växt i samlingen"
export const addPlant = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { contentPageId, nickname, watering, sunlight, nutrition } = req.body;

    // Grundvalidering: contentPageId + watering är alltid required
    if (!contentPageId) {
      return res.status(400).json({ message: "contentPageId krävs" });
    }
    if (!watering || typeof watering.intervalDays !== "number") {
      return res.status(400).json({ message: "watering.intervalDays krävs" });
    }

    // Hämta användaren för att veta nivån
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }
    const userLevel = user.level;
    const features = TIER_FEATURES[userLevel];

    // Räkna befintliga växter och jämför mot tak
    const currentCount = await UserPlant.countDocuments({ user: userId });
    if (currentCount >= features.maxPlants) {
      return res.status(403).json({
        message: "Du har nått max antal växter för din nivå",
        currentCount,
        limit: features.maxPlants,
        upgrade: true,
      });
    }

    // Bygg upp växt-datan, respektera vilka spår som är upplåsta för nivån
    const plantData: any = {
      user: userId,
      contentPage: contentPageId,
      nickname,
      watering: { intervalDays: watering.intervalDays },
    };

    if (features.sunlightUnlocked && sunlight?.intervalDays) {
      plantData.sunlight = { intervalDays: sunlight.intervalDays };
    }
    if (features.nutritionUnlocked && nutrition?.intervalDays) {
      plantData.nutrition = { intervalDays: nutrition.intervalDays };
    }

    // Skapa och returnera växten
    const newPlant = await UserPlant.create(plantData);
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte lägga till växt", error });
  }
};