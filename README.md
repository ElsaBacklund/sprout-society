# 🌱 Sprout Society

Sprout Society är en webbtjänst för växtskötsel. Användare kan läsa skötselguider för olika krukväxter, bygga sin egen växtsamling och hålla koll på vattning, solljus och näring. Tjänsten har tre medlemsnivåer som låser upp olika funktioner.

Skolprojekt i grupp, med en TypeScript-backend och MongoDB-databas.

## Funktioner

- Registrering och inloggning (JWT)
- Skötselguider för växter, skapade av admin-användare
- Personlig växtsamling med spårning av skötsel
- Medlemsnivåer: Seedling (gratis), Bloomer och Green Thumb
- Betalning (simulerad) och kvittohistorik
- Adminpanel för att hantera innehåll

## Teknik

**Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT för autentisering, bcryptjs för lösenordshashning

**Frontend**
- React + Vite
- TypeScript
- react-router-dom
- axios

## Mappstruktur

```
sprout-society/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   └── README.md
├── docs/
│   └── (ER-diagram)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── README.md
└── README.md
```

## Kom igång

### Förkrav

- Node.js (18 eller senare)
- Ett MongoDB Atlas-kluster (eller lokal MongoDB)

### Backend

```bash
cd backend
npm install
```

Skapa en `.env`-fil i `backend/`:

```
MONGODB_URI=din-mongodb-connection-string
JWT_SECRET=valfri-hemlig-sträng
PORT=4000
```

Starta servern:

```bash
npm run dev
```

### Frontend

I en ny terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend körs som standard på `http://localhost:5173` och pratar med backend på `http://localhost:4000`.

## Medlemsnivåer

| Nivå | Pris | Funktioner |
|---|---|---|
| Seedling | Gratis | Växtguider, egen samling, vattningsspårning |
| Bloomer | 99 kr | Allt i Seedling, plus solljusspårning |
| Green Thumb | 199 kr | Allt i Bloomer, plus näringsspårning |

## Gruppmedlemmar

| Person | Ansvar |
|---|---|
| Elsa | Autentisering, betalning, kvitton |
| Linn | Innehåll (växtguider) och adminpanel |
| Ilma | Extra funktion och deploy |

