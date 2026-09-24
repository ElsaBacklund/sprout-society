import { useState } from "react";
import api from "../services/api";

function AdminContent() {
  const [title, setTitle] = useState("");
  const [plantName, setPlantName] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [requiredLevel, setRequiredLevel] = useState("grundpaket");

  const [light, setLight] = useState("");
  const [watering, setWatering] = useState("");
  const [soil, setSoil] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [commonProblems, setCommonProblems] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newContent = {
      title,
      plantName,
      category,
      difficulty,
      summary,
      imageUrl,
      requiredLevel,
      careInstructions: {
        light,
        watering,
        soil,
        temperature,
        humidity,
        commonProblems,
      },
    };

    try {
      const response = await api.post("/content", newContent);

      console.log("Skapad innehållssida:", response.data);

      alert("Innehållssidan skapades!");

      setTitle("");
      setPlantName("");
      setCategory("");
      setDifficulty("easy");
      setSummary("");
      setImageUrl("");
      setRequiredLevel("grundpaket");
      setLight("");
      setWatering("");
      setSoil("");
      setTemperature("");
      setHumidity("");
      setCommonProblems("");
    } catch (error) {
      console.error("Kunde inte skapa innehållssida:", error);
      alert("Något gick fel när innehållssidan skulle skapas.");
    }
  };

  return (
    <div>
      <h1>Skapa innehållssida</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="plantName">Växtnamn</label>
          <input
            id="plantName"
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Kategori</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="difficulty">Svårighetsgrad</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Lätt</option>
            <option value="medium">Medel</option>
            <option value="hard">Svår</option>
          </select>
        </div>

        <div>
          <label htmlFor="summary">Sammanfattning</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl">Bild-URL</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="requiredLevel">Krävd nivå</label>
          <select
            id="requiredLevel"
            value={requiredLevel}
            onChange={(e) => setRequiredLevel(e.target.value)}
          >
            <option value="grundpaket">Seedling</option>
            <option value="plus">Bloomer</option>
            <option value="fullstandigt">Green Thumb</option>
          </select>
        </div>

        <h2>Skötselråd</h2>

        <div>
          <label htmlFor="light">Ljus</label>
          <input
            id="light"
            type="text"
            value={light}
            onChange={(e) => setLight(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="watering">Vattning</label>
          <input
            id="watering"
            type="text"
            value={watering}
            onChange={(e) => setWatering(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="soil">Jord</label>
          <input
            id="soil"
            type="text"
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="temperature">Temperatur</label>
          <input
            id="temperature"
            type="text"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="humidity">Luftfuktighet</label>
          <input
            id="humidity"
            type="text"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="commonProblems">Vanliga problem</label>
          <textarea
            id="commonProblems"
            value={commonProblems}
            onChange={(e) => setCommonProblems(e.target.value)}
          />
        </div>

        <button type="submit">Skapa innehållssida</button>
      </form>
    </div>
  );
}

export default AdminContent;