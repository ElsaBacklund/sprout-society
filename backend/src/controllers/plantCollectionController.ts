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

// räknar ut veckoschema för ett särskilt spår
// Returnerar 7 dagar (idag + 6 framåt) med "status" per dag
type DayStatus = "active" | "upcoming" | "idle" | "locked";

interface ScheduleDay {
  date: string;         // "YYYY-MM-DD"
  status: DayStatus;
}

function buildWeekSchedule(
  intervalDays: number | undefined,
  lastDoneAt: Date | undefined,
  isUnlocked: boolean
): ScheduleDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Bygg 7 tomma dagar
  const week: ScheduleDay[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    week.push({
      date: day.toISOString().split("T")[0],
      status: isUnlocked ? "idle" : "locked",
    });
  }

  // Om spåret är låst blir alla 7 dagar låsta, vilket blir "inget mer att räkna"
  if (!isUnlocked || !intervalDays) {
    return week;
  }

  // "Räkna nästa aktivitetsdatum"
  // Om aldrig gjort blir nästa dag idag. Annars blir det: lastDoneAt + intervalDays
  const nextDate = lastDoneAt ? new Date(lastDoneAt) : new Date(today);
  if (lastDoneAt) {
    nextDate.setDate(nextDate.getDate() + intervalDays);
  }
  nextDate.setHours(0, 0, 0, 0);

  // Loopar framåt och markerar aktiva dagar i veckan
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 6);

  while (nextDate <= weekEnd) {
    const dayIndex = Math.floor(
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      week[dayIndex].status = dayIndex === 0 ? "active" : "upcoming";
    }
    nextDate.setDate(nextDate.getDate() + intervalDays);
  }

  return week;
}

// GET /api/plants
// Hämta användarens växtsamling med veckoschema per "rad"
export const getMyPlants = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Hämta användarens level för att veta vilka spår som är upplåsta
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }
    const features = TIER_FEATURES[user.level];

    // Hämta växterna och contentPage så man får info om växttypen
    const plants = await UserPlant.find({ user: userId }).populate("contentPage");

    // Bygg svar med veckoschema per rad
    const plantsWithSchedule = plants.map((plant) => ({
      _id: plant._id,
      contentPage: plant.contentPage,
      nickname: plant.nickname,
      addedAt: plant.addedAt,
      schedule: {
        watering: buildWeekSchedule(
          plant.watering?.intervalDays,
          plant.watering?.lastDoneAt,
          features.wateringUnlocked
        ),
        sunlight: buildWeekSchedule(
          plant.sunlight?.intervalDays,
          plant.sunlight?.lastDoneAt,
          features.sunlightUnlocked
        ),
        nutrition: buildWeekSchedule(
          plant.nutrition?.intervalDays,
          plant.nutrition?.lastDoneAt,
          features.nutritionUnlocked
        ),
      },
    }));

    res.json({
      plants: plantsWithSchedule,
      tier: {
        level: user.level,
        currentCount: plants.length,
        limit: features.maxPlants === Infinity ? null : features.maxPlants,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta växter", error });
  }
};