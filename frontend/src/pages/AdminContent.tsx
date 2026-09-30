import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import api from "../services/api";
import "./AdminContent.css";

// Skötselinstruktionerna, samma struktur som i backendens careInstructions-schema
interface CareInstructions {
  light: string;
  watering: string;
  soil: string;
  temperature: string;
  humidity: string;
  commonProblems: string;
}

// Hur en innehållssida ser ut när den kommer tillbaka från backend
interface ContentPage {
  _id: string;
  title: string;
  plantName: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
  imageUrl: string;
  careInstructions: CareInstructions;
  requiredLevel: "grundpaket" | "plus" | "fullstandigt";
}

// Formulärdatan innan den skickats till backend
interface ContentFormData {
  title: string;
  plantName: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
  imageUrl: string;
  careInstructions: CareInstructions;
  requiredLevel: "grundpaket" | "plus" | "fullstandigt";
}

// Tomt formulär, används både vid start och för att rensa formuläret efter submit/avbryt
const emptyForm: ContentFormData = {
  title: "",
  plantName: "",
  category: "",
  difficulty: "easy",
  summary: "",
  imageUrl: "",
  careInstructions: {
    light: "",
    watering: "",
    soil: "",
    temperature: "",
    humidity: "",
    commonProblems: "",
  },
  requiredLevel: "grundpaket",
};

function AdminContent() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [formData, setFormData] = useState<ContentFormData>(emptyForm);
  // editingId håller koll på om vi redigerar en befintlig sida (annars null = skapar ny)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Hämtar alla innehållssidor från backend
  const fetchPages = useCallback(async () => {
    try {
      const response = await api.get("/content");
      setPages(response.data);
    } catch (err) {
      console.error("Kunde inte hämta innehåll:", err);
      setError("Kunde inte hämta innehållet.");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  let active = true;

  async function loadPages() {
    try {
      const response = await api.get("/content");
      if (active) setPages(response.data);
    } catch (err) {
      console.error("Kunde inte hämta innehåll:", err);
      if (active) setError("Kunde inte hämta innehållet.");
    } finally {
      if (active) setLoading(false);
    }
  }

  void loadPages();

  return () => {
    active = false;
  };
}, []);

  // Hanterar ändringar i alla formulärfält
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name in formData.careInstructions) {
      setFormData((current) => ({
        ...current,
        careInstructions: {
          ...current.careInstructions,
          [name]: value,
        },
      }));
    } else {
      setFormData((current) => ({
        ...current,
        [name]: value,
      }));
    }
  };

  // Skickar formuläret, antingen skapa (POST) eller uppdatera (PUT) beroende på editingId
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      if (editingId) {
        await api.put(`/content/${editingId}`, formData);
        setMessage("Innehållssidan har uppdaterats! 🌱");
      } else {
        await api.post("/content", formData);
        setMessage("Innehållssidan har skapats! 🌱");
      }

      // Rensa formuläret och hämta senaste listan från backend
      setFormData(emptyForm);
      setEditingId(null);
      await fetchPages();
    } catch (err) {
      console.error("Kunde inte spara innehåll:", err);
      setError("Kunde inte spara innehållet.");
    }
  };

  // Fyller formuläret med en befintlig sidas data, så admin kan redigera den
  const handleEdit = (page: ContentPage) => {
    setEditingId(page._id);

    setFormData({
      title: page.title,
      plantName: page.plantName,
      category: page.category,
      difficulty: page.difficulty,
      summary: page.summary,
      imageUrl: page.imageUrl,
      careInstructions: {
        light: page.careInstructions.light,
        watering: page.careInstructions.watering,
        soil: page.careInstructions.soil,
        temperature: page.careInstructions.temperature,
        humidity: page.careInstructions.humidity,
        // ?? "" ifall commonProblems inte satts (den är valfri i backend-schemat)
        commonProblems: page.careInstructions.commonProblems ?? "",
      },
      requiredLevel: page.requiredLevel,
    });

    // Scrolla upp till formuläret så admin ser vad de redigerar
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Tar bort en innehållssida, efter bekräftelse
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort denna innehållssida?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await api.delete(`/content/${id}`);

      // Ta bort sidan direkt ur state, utan att behöva hämta om hela listan
      setPages((current) => current.filter((page) => page._id !== id));

      // Om man tog bort sidan man höll på att redigera, återställ formuläret
      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }

      setMessage("Innehållssidan har tagits bort.");
    } catch (err) {
      console.error("Kunde inte ta bort innehåll:", err);
      setError("Kunde inte ta bort innehållet.");
    }
  };

  // Avbryter redigering och återställer formuläret till tomt läge
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
    setError("");
  };

  if (loading) {
    return (
      <main className="admin-content">
        <p>Laddar...</p>
      </main>
    );
  }

  return (
    <main className="admin-content">
      <div className="admin-content-header">
        <h1>Admin – Innehåll</h1>
        <p>Skapa och hantera växtguider.</p>
      </div>

      {message && <p className="admin-message">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      <section className="admin-form-section">
        <h2>{editingId ? "Redigera växtguide" : "Skapa ny växtguide"}</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Titel
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Växtnamn
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Kategori
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Svårighetsgrad
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="easy">Lätt</option>
              <option value="medium">Medel</option>
              <option value="hard">Svår</option>
            </select>
          </label>

          <label>
            Sammanfattning
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Bild-URL
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </label>

          <div className="admin-care-section">
            <h3>Skötselråd</h3>

            <label>
              Ljus
              <textarea
                name="light"
                value={formData.careInstructions.light}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Vattning
              <textarea
                name="watering"
                value={formData.careInstructions.watering}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Jord
              <textarea
                name="soil"
                value={formData.careInstructions.soil}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Temperatur
              <textarea
                name="temperature"
                value={formData.careInstructions.temperature}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Luftfuktighet
              <textarea
                name="humidity"
                value={formData.careInstructions.humidity}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Vanliga problem
              <textarea
                name="commonProblems"
                value={formData.careInstructions.commonProblems}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Krävd nivå
            <select
              name="requiredLevel"
              value={formData.requiredLevel}
              onChange={handleChange}
            >
              <option value="grundpaket">Seedling</option>
              <option value="plus">Bloomer</option>
              <option value="fullstandigt">Green Thumb</option>
            </select>
          </label>

          <div className="admin-form-actions">
            <button type="submit">
              {editingId ? "Spara ändringar" : "Skapa växtguide"}
            </button>

            {editingId && (
              <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                Avbryt
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list-section">
        <h2>Befintliga växtguider</h2>

        {pages.length === 0 ? (
          <p>Det finns inga växtguider ännu.</p>
        ) : (
          <div className="admin-list">
            {pages.map((page) => (
              <article className="admin-list-item" key={page._id}>
                <div>
                  <h3>{page.title}</h3>
                  <p>
                    {page.plantName} · {page.requiredLevel}
                  </p>
                </div>

                <div className="admin-item-actions">
                  <button type="button" onClick={() => handleEdit(page)}>
                    Redigera
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(page._id)}
                  >
                    Ta bort
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminContent;