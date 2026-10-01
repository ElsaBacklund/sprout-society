import { Link } from "react-router-dom";
import { getStoredUser, isLoggedIn } from "../services/auth";
import "./HomePage.css";

const FEATURES = [
  {
    title: "Växtguider",
    text: "Bläddra bland skötselguider för olika krukväxter, med ljus, vattning, jord och vanliga problem.",
  },
  {
    title: "Din samling",
    text: "Lägg till dina egna växter och håll koll på när de senast vattnades, fick sol eller näring.",
  },
  {
    title: "Medlemsnivåer",
    text: "Seedling, Bloomer och Green Thumb låser upp fler funktioner ju högre nivå du väljer.",
  },
];

const LEVELS = [
  { name: "Seedling", price: "Gratis", text: "Grundläggande växtguider och en egen samling." },
  { name: "Bloomer", price: "99 kr", text: "Lägger till spårning av solljus för dina växter." },
  { name: "Green Thumb", price: "199 kr", text: "Allt i Bloomer, plus spårning av näring." },
];

function HomePage() {
  const loggedIn = isLoggedIn();
  const user = getStoredUser();

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>🌱 Sprout Society</h1>
        <p className="home-tagline">
          En samlingsplats för dig som vill odla smartare. Läs skötselguider,
          bygg din egna växtsamling och håll koll på skötseln, allt på ett
          ställe.
        </p>

        <div className="home-cta">
          {loggedIn ? (
            <>
              <Link className="home-cta-primary" to="/content">
                Utforska växter
              </Link>
              <Link className="home-cta-secondary" to="/my-plants">
                Min samling
              </Link>
            </>
          ) : (
            <>
              <Link className="home-cta-primary" to="/register">
                Skapa konto
              </Link>
              <Link className="home-cta-secondary" to="/login">
                Logga in
              </Link>
            </>
          )}
        </div>

        {loggedIn && user && (
          <p className="home-greeting">
            Välkommen tillbaka, {user.name}! Din nivå: {user.levelName}.
          </p>
        )}
      </section>

      <section className="home-section">
        <h2>Vad kan du göra här?</h2>
        <div className="home-feature-grid">
          {FEATURES.map((f) => (
            <div className="home-feature-card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Medlemsnivåer</h2>
        <div className="home-level-grid">
          {LEVELS.map((lvl) => (
            <div className="home-level-card" key={lvl.name}>
              <h3>{lvl.name}</h3>
              <span className="home-level-price">{lvl.price}</span>
              <p>{lvl.text}</p>
            </div>
          ))}
        </div>

        {!loggedIn && (
          <p className="home-level-note">
            Skapa ett konto för att välja nivå och komma igång.
          </p>
        )}
      </section>
    </main>
  );
}

export default HomePage;