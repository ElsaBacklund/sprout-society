import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import {
  clearSession,
  getStoredUser,
  isLoggedIn,
  updateStoredUser,
  type StoredUser,
} from "../services/auth";
import "./AccountPage.css";

interface Receipt {
  _id: string;
  level: "grundpaket" | "plus" | "fullstandigt";
  amount: number;
  transactionId: string;
  createdAt: string;
}

const LEVELS: {
  value: "grundpaket" | "plus" | "fullstandigt";
  name: string;
  price: number;
}[] = [
  { value: "grundpaket", name: "Seedling", price: 0 },
  { value: "plus", name: "Bloomer", price: 99 },
  { value: "fullstandigt", name: "Green Thumb", price: 199 },
];

function AccountPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [selectingLevel, setSelectingLevel] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchReceipts = async () => {
      setLoadingReceipts(true);

      try {
        const response = await api.get("/receipts");
        setReceipts(response.data.receipts);
      } catch (error) {
        console.error("Kunde inte hämta kvitton:", error);
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchReceipts();
  }, [navigate, refreshCount]);

  const handleSelectLevel = async (level: string) => {
    setSelectingLevel(level);
    setPaymentMessage(null);

    try {
      const response = await api.post("/payment/select-level", { level });

      const updatedUser: StoredUser = {
        ...(user as StoredUser),
        level: response.data.newLevel,
        levelName: response.data.newLevelName,
      };

      setUser(updatedUser);
      updateStoredUser(updatedUser);

      setPaymentMessage({
        type: "success",
        text: `Betalning genomförd! Du är nu ${response.data.newLevelName}.`,
      });

      setRefreshCount((count) => count + 1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setPaymentMessage({ type: "error", text: error.response.data.error });
      } else {
        setPaymentMessage({
          type: "error",
          text: "Något gick fel vid betalningen.",
        });
      }
    } finally {
      setSelectingLevel(null);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ingen server-session att avsluta, fortsätt logga ut lokalt ändå
    }

    clearSession();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <main className="account-page">
      <h1>Mitt konto</h1>
      <p className="account-subtitle">Hantera din medlemsnivå och se dina kvitton.</p>

      <section className="account-section">
        <h2>Kontouppgifter</h2>

        <div className="account-info-card">
          <div className="account-info-item">
            <strong>Namn</strong>
            <span>{user.name}</span>
          </div>

          <div className="account-info-item">
            <strong>E-post</strong>
            <span>{user.email}</span>
          </div>

          <div className="account-info-item">
            <strong>Nuvarande nivå</strong>
            <span>{user.levelName}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logga ut
        </button>
      </section>

      <section className="account-section">
        <h2>Välj medlemsnivå</h2>

        <div className="level-grid">
          {LEVELS.map((lvl) => {
            const isCurrent = user.level === lvl.value;

            return (
              <div
                key={lvl.value}
                className={`level-card${isCurrent ? " current" : ""}`}
              >
                <h3>{lvl.name}</h3>
                <span className="level-price">
                  {lvl.price === 0 ? "Gratis" : `${lvl.price} kr`}
                </span>

                {isCurrent ? (
                  <span className="level-current-badge">Din nuvarande nivå</span>
                ) : (
                  <button
                    className="level-select-button"
                    onClick={() => handleSelectLevel(lvl.value)}
                    disabled={selectingLevel !== null}
                  >
                    {selectingLevel === lvl.value ? "Behandlar..." : "Välj"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {paymentMessage && (
          <p className={`payment-message ${paymentMessage.type}`}>
            {paymentMessage.text}
          </p>
        )}
      </section>

      <section className="account-section">
        <h2>Kvitton</h2>

        {loadingReceipts ? (
          <p>Laddar kvitton...</p>
        ) : receipts.length === 0 ? (
          <p>Inga kvitton än.</p>
        ) : (
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Nivå</th>
                <th>Belopp</th>
                <th>Transaktions-ID</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.createdAt).toLocaleDateString("sv-SE")}</td>
                  <td>
                    {LEVELS.find((lvl) => lvl.value === r.level)?.name ?? r.level}
                  </td>
                  <td>{r.amount === 0 ? "Gratis" : `${r.amount} kr`}</td>
                  <td>{r.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default AccountPage;
