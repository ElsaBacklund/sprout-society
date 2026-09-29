import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import "./ContentPage.css";

interface CareInstructions {
  light: string;
  watering: string;
  soil: string;
  temperature: string;
  humidity: string;
  commonProblems?: string;
}

interface ContentPageData {
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

const levelNames: Record<string, string> = {
  grundpaket: "Seedling",
  plus: "Bloomer",
  fullstandigt: "Green Thumb",
};

function ContentPage() {
  const { id } = useParams();

  const [page, setPage] = useState<ContentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requiredLevel, setRequiredLevel] = useState("");

  useEffect(() => {
    const fetchContentPage = async () => {
      try {
        const response = await api.get(`/content/${id}`);

        setPage(response.data);
      } catch (error) {
        console.error("Kunde inte hämta innehållssidan:", error);

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 403 &&
          error.response?.data?.upgrade
        ) {
          setRequiredLevel(error.response.data.requiredLevel);
        } else {
          setError("Kunde inte hämta innehållssidan.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContentPage();
  }, [id]);

  if (loading) {
    return <p>Laddar...</p>;
  }

  if (requiredLevel) {
    return (
      <main className="content-page">
        <div className="upgrade-box">
          <h1>Den här sidan kräver en högre nivå</h1>

          <p>
            Du behöver uppgradera till{" "}
            <strong>{levelNames[requiredLevel]}</strong> för att komma åt
            den här växtguiden.
          </p>

          <Link to="/content">← Tillbaka till växter</Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="content-page">
        <p>{error}</p>

        <Link className="content-page-back" to="/content">
          ← Tillbaka till växter
        </Link>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="content-page">
        <p>Innehållssidan kunde inte hittas.</p>
      </main>
    );
  }

  return (
    <main className="content-page">
      <Link className="content-page-back" to="/content">
        ← Tillbaka till växter
      </Link>

      <article className="content-page-hero">
        <img
          className="content-page-image"
          src={page.imageUrl}
          alt={page.plantName}
        />

        <div className="content-page-info">
          <h1>{page.title}</h1>

          <div className="content-page-meta">
            <span className="content-page-tag">
              {page.plantName}
            </span>

            <span className="content-page-tag">
              {page.category}
            </span>

            <span className="content-page-tag">
              {page.difficulty}
            </span>

            <span className="content-page-tag">
              {levelNames[page.requiredLevel]}
            </span>
          </div>

          <p className="content-page-summary">
            {page.summary}
          </p>

          <section className="care-section">
            <h2>Skötselråd 🌱</h2>

            <div className="care-grid">
              <div className="care-card">
                <h3>Ljus</h3>
                <p>{page.careInstructions.light}</p>
              </div>

              <div className="care-card">
                <h3>Vattning</h3>
                <p>{page.careInstructions.watering}</p>
              </div>

              <div className="care-card">
                <h3>Jord</h3>
                <p>{page.careInstructions.soil}</p>
              </div>

              <div className="care-card">
                <h3>Temperatur</h3>
                <p>{page.careInstructions.temperature}</p>
              </div>

              <div className="care-card">
                <h3>Luftfuktighet</h3>
                <p>{page.careInstructions.humidity}</p>
              </div>

              {page.careInstructions.commonProblems && (
                <div className="care-card">
                  <h3>Vanliga problem</h3>
                  <p>{page.careInstructions.commonProblems}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

export default ContentPage;