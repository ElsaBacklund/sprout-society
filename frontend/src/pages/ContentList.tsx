import { useEffect, useState } from "react";
import api from "../services/api";

interface CareInstructions {
  light: string;
  watering: string;
  soil: string;
  temperature: string;
  humidity: string;
  commonProblems?: string;
}

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
  createdAt: string;
}

function ContentList() {
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContentPages = async () => {
      try {
        const response = await api.get("/content");

        setContentPages(response.data);
      } catch (error) {
        console.error("Kunde inte hämta innehållssidor:", error);
        setError("Kunde inte hämta innehållet.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentPages();
  }, []);

  if (loading) {
    return <p>Laddar innehåll...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Växter</h1>

      {contentPages.length === 0 ? (
        <p>Det finns inget innehåll ännu.</p>
      ) : (
        <div>
          {contentPages.map((page) => (
            <article key={page._id}>
              <img
                src={page.imageUrl}
                alt={page.plantName}
              />

              <h2>{page.title}</h2>

              <p>
                <strong>Växt:</strong> {page.plantName}
              </p>

              <p>
                <strong>Kategori:</strong> {page.category}
              </p>

              <p>
                <strong>Svårighetsgrad:</strong> {page.difficulty}
              </p>

              <p>{page.summary}</p>

              <p>
                <strong>Krävd nivå:</strong> {page.requiredLevel}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContentList;