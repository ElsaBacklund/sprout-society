import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddPlant.css";

// använder GET /api/content för att fylla dropdown
interface ContentPage {
  _id: string;
  title: string;
  plantName: string;
  requiredLevel: "grundpaket" | "plus" | "fullstandigt";
}

// Från GET /api/plants får man bara med "tier" så vet man vad användaren är
interface TierInfo {
  level: "grundpaket" | "plus" | "fullstandigt";
  currentCount: number;
  limit: number | null;
}

interface PlantsResponse {
  tier: TierInfo;
}

function AddPlant() {
  const navigate = useNavigate();

  // Data för dropdown
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [tier, setTier] = useState<TierInfo | null>(null);

  // Formulär-state
  const [contentPageId, setContentPageId] = useState("");
  const [nickname, setNickname] = useState("");
  const [wateringDays, setWateringDays] = useState("3");
  const [sunlightDays, setSunlightDays] = useState("2");
  const [nutritionDays, setNutritionDays] = useState("14");

  // UI-state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Hämta både content pages och tier i parallelll
        const [contentRes, plantsRes] = await Promise.all([
          api.get<ContentPage[]>("/content"),
          api.get<PlantsResponse>("/plants"),
        ]);
        setContentPages(contentRes.data);
        setTier(plantsRes.data.tier);
      } catch (err) {
        console.error("Kunde inte hämta data:", err);
        setError("Kunde inte hämta växttyper.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contentPageId) {
      setError("Välj en växttyp");
      return;
    }

    setSubmitting(true);
    setError("");

    // Bygg body och inkludera sunlight/nutrition bara om tier tillåter
    const body: any = {
      contentPageId,
      nickname: nickname.trim() || undefined,
      watering: { intervalDays: Number(wateringDays) },
    };

    if (tier?.level === "plus" || tier?.level === "fullstandigt") {
      body.sunlight = { intervalDays: Number(sunlightDays) };
    }
    if (tier?.level === "fullstandigt") {
      body.nutrition = { intervalDays: Number(nutritionDays) };
    }

    try {
      await api.post("/plants", body);
      navigate("/my-plants");
    } catch (err: any) {
      console.error("Kunde inte lägga till växt:", err);
      const message =
        err.response?.data?.message || "Kunde inte lägga till växt.";
      setError(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Laddar...</p>;
  }

  return (
    <main className="add-plant">
      <h1>Lägg till växt</h1>

      <form className="add-plant-form" onSubmit={handleSubmit}>
        <label>
          Växttyp
          <select
            value={contentPageId}
            onChange={(e) => setContentPageId(e.target.value)}
            required
          >
            <option value="">-- Välj en växt --</option>
            {contentPages.map((page) => (
              <option key={page._id} value={page._id}>
                {page.plantName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Smeknamn <span className="optional-tag">(valfritt)</span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="t.ex. Bosse"
          />
        </label>

        <label>
          💧 Vattna var X:e dag
          <input
            type="number"
            min="1"
            max="60"
            value={wateringDays}
            onChange={(e) => setWateringDays(e.target.value)}
            required
          />
        </label>

        {(tier?.level === "plus" || tier?.level === "fullstandigt") && (
          <label>
            ☀️ Rotera mot solljus var X:e dag
            <input
              type="number"
              min="1"
              max="60"
              value={sunlightDays}
              onChange={(e) => setSunlightDays(e.target.value)}
            />
          </label>
        )}

        {tier?.level === "fullstandigt" && (
          <label>
            🌿 Ge näring var X:e dag
            <input
              type="number"
              min="1"
              max="60"
              value={nutritionDays}
              onChange={(e) => setNutritionDays(e.target.value)}
            />
          </label>
        )}

        {tier?.level === "grundpaket" && (
          <p className="upgrade-hint">
            🔒 Uppgradera till Bloomer för solljus-schema, eller Green Thumb för
            allt inklusive näring
          </p>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/my-plants")}
          >
            Avbryt
          </button>
          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? "Lägger till..." : "Lägg till"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddPlant;