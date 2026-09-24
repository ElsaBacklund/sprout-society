import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

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
    <div>
      <h1>Den här sidan kräver en högre nivå</h1>

      <p>
        Du behöver uppgradera till <strong>{levelNames[requiredLevel]}</strong> för att
        komma åt den här växtguiden.
      </p>

      <Link to="/content">← Tillbaka till växter</Link>
    </div>
  );
}

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/content">Tillbaka till växter</Link>
      </div>
    );
  }

  if (!page) {
    return <p>Innehållssidan kunde inte hittas.</p>;
  }

  return (
    <div>
      <Link to="/content">← Tillbaka till växter</Link>

      <h1>{page.title}</h1>

      <img
        src={page.imageUrl}
        alt={page.plantName}
      />

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

      <h2>Skötselråd</h2>

      <h3>Ljus</h3>
      <p>{page.careInstructions.light}</p>

      <h3>Vattning</h3>
      <p>{page.careInstructions.watering}</p>

      <h3>Jord</h3>
      <p>{page.careInstructions.soil}</p>

      <h3>Temperatur</h3>
      <p>{page.careInstructions.temperature}</p>

      <h3>Luftfuktighet</h3>
      <p>{page.careInstructions.humidity}</p>

      {page.careInstructions.commonProblems && (
        <>
          <h3>Vanliga problem</h3>
          <p>{page.careInstructions.commonProblems}</p>
        </>
      )}
    </div>
  );
}

const levelNames: Record<string, string> = {
  grundpaket: "Seedling",
  plus: "Bloomer",
  fullstandigt: "Green Thumb",
};

export default ContentPage;