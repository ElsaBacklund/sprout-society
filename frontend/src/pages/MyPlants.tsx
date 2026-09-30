import { useEffect, useState } from "react";
import api from "../services/api";
import WeekSchedule from "../components/WeekSchedule";
import "./MyPlants.css";
import { Link } from "react-router-dom";

interface ScheduleDay {
  date: string;
  status: "active" | "upcoming" | "idle" | "locked";
}

interface CareSchedule {
  watering: ScheduleDay[];
  sunlight: ScheduleDay[];
  nutrition: ScheduleDay[];
}

interface ContentPage {
  _id: string;
  plantName: string;
  imageUrl: string;
  category: string;
}

interface UserPlant {
  _id: string;
  contentPage: ContentPage;
  nickname?: string;
  addedAt: string;
  schedule: CareSchedule;
}

interface TierInfo {
  level: "grundpaket" | "plus" | "fullstandigt";
  currentCount: number;
  limit: number | null;
}

interface PlantsResponse {
  plants: UserPlant[];
  tier: TierInfo;
}

function MyPlants() {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [tier, setTier] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get<PlantsResponse>("/plants");
      setPlants(response.data.plants);
      setTier(response.data.tier);
    } catch (err) {
      console.error("Kunde inte hämta växter:", err);
      setError("Kunde inte hämta din samling.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (
    plantId: string,
    track: "watering" | "sunlight" | "nutrition"
  ) => {
    try {
      await api.post(`/plants/${plantId}/mark-done`, { track });
      // Hämta om listan så schemat räknas om
      fetchPlants();
    } catch (err) {
      console.error("Kunde inte markera som gjort:", err);
    }
  };

    const handleDelete = async (plantId: string, plantName: string) => {
    const confirmed = window.confirm(`Ta bort ${plantName} från din samling?`);
    if (!confirmed) return;

    try {
        await api.delete(`/plants/${plantId}`);
        fetchPlants();
    } catch (err) {
        console.error("Kunde inte ta bort växt:", err);
    }
    };

  if (loading) {
    return <p>Laddar din samling...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="my-plants">
      <h1>Min samling</h1>

            <div className="my-plants-header">
        {tier && (
            <p className="tier-info">
            {tier.currentCount} av {tier.limit ?? "∞"} växter — {tier.level}
            </p>
        )}
        <Link to="/my-plants/add" className="button-primary add-plant-link">
            + Lägg till växt
        </Link>
        </div>

      {plants.length === 0 ? (
        <p>Du har inga växter i din samling ännu.</p>
      ) : (
        <div className="plants-grid">
          {plants.map((plant) => (
            <article className="plant-card" key={plant._id}>
              <img
                className="plant-card-image"
                src={plant.contentPage.imageUrl}
                alt={plant.contentPage.plantName}
              />
              <div className="plant-card-body">
                <button
                    className="plant-delete-button"
                    onClick={() => handleDelete(plant._id, plant.nickname || plant.contentPage.plantName)}
                    title="Ta bort växt"
                >
                    🗑️
                </button>
                <h2>{plant.nickname || plant.contentPage.plantName}</h2>
                <p className="plant-species">{plant.contentPage.plantName}</p>
                <div className="plant-schedules">
                  <WeekSchedule
                    label="Vattning"
                    icon="💧"
                    color="blue"
                    days={plant.schedule.watering}
                    onMarkDone={() => handleMarkDone(plant._id, "watering")}
                  />
                  <WeekSchedule
                    label="Solljus"
                    icon="☀️"
                    color="yellow"
                    days={plant.schedule.sunlight}
                    onMarkDone={() => handleMarkDone(plant._id, "sunlight")}
                    upgradeMessage="Uppgradera till Bloomer för solljus-schema"
                  />
                  <WeekSchedule
                    label="Näring"
                    icon="🌿"
                    color="orange"
                    days={plant.schedule.nutrition}
                    onMarkDone={() => handleMarkDone(plant._id, "nutrition")}
                    upgradeMessage="Uppgradera till Green Thumb för näring-schema"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyPlants;