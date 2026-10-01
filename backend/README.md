# Sprout Society – Backend

## Kom igång

```bash
npm install
cp .env.example .env   # fyll i MONGO_URI och JWT_SECRET
npm run dev
```

Servern startar på `http://localhost:4000`. Alla endpoints ligger under `/api`.

## Struktur

```
src/
  config/
    db.ts                      Databasanslutning
    tiers.ts                   TIER_FEATURES – vad varje nivå låser upp (maxPlants, spår m.m.)
  models/                      Mongoose-scheman (User, Level, Receipt, ContentPage, UserPlant)
  middleware/auth.ts           requireAuth + requireAdmin, används av alla routes som kräver inloggning
  controllers/                 Logik per feature
  routes/                      Endpoints, samlas i routes/index.ts
  utils/                       Hjälpfunktioner, t.ex. jwt.ts (signToken)
  server.ts                    Startar Express-appen
```

## Färdigt

- **Auth** (Elsa): registrering, inloggning, utloggning (JWT)
- **Betalning & kvitton** (Elsa): val av nivå, simulerat betalsteg, kvittohistorik
- **Innehåll & admin** (Linn): skötselguider, nivåstyrd åtkomst, admin kan skapa/redigera/ta bort
- **Växtsamling** (Ilma): personlig samling av växter med veckoschema för vattning/sol/näring, gränser per nivå

---

## API-kontrakt

Alla svar är JSON. Skyddade endpoints kräver header:
`Authorization: Bearer <token>`

### Auth

| Metod | Endpoint | Body | Kräver token | Beskrivning |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | Nej | Skapar konto, returnerar `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | Nej | Loggar in, returnerar `{ token, user }` |
| POST | `/api/auth/logout` | – | Ja | Bekräftar utloggning (token tas bort av klienten) |

`user`-objektet: `{ id, name, email, level, levelName, isAdmin }`
`level` (internt värde, används i databas/API): `"grundpaket"`, `"plus"`, `"fullstandigt"`
`levelName` (visas för användaren, tema Sprout Society): `"Seedling"`, `"Bloomer"`, `"Green Thumb"`

### Betalning / nivåval

| Metod | Endpoint | Body | Kräver token | Beskrivning |
|---|---|---|---|---|
| POST | `/api/payment/select-level` | `{ level }` | Ja | Simulerar betalning, uppdaterar användarens nivå, skapar kvitto |

Svar: `{ message, newLevel, newLevelName, receipt }`

### Kvitton

| Metod | Endpoint | Body | Kräver token | Beskrivning |
|---|---|---|---|---|
| GET | `/api/receipts` | – | Ja | Lista över inloggad användares kvitton, senaste först |

### Innehåll

| Metod | Endpoint | Body | Kräver token | Beskrivning |
|---|---|---|---|---|
| GET | `/api/content` | – | Ja | Lista innehållssidor. Admin ser alla, övriga ser bara sidor deras nivå räcker till |
| GET | `/api/content/:id` | – | Ja | Hämta en sida. Om nivån är för låg: `403` + `{ message, requiredLevel, upgrade: true }` |
| POST | `/api/content` | `{ title, plantName, category, difficulty, summary, imageUrl, careInstructions, requiredLevel }` | Ja (admin) | Skapa ny innehållssida |
| PUT | `/api/content/:id` | Samma fält som ovan (valfria) | Ja (admin) | Uppdatera en sida |
| DELETE | `/api/content/:id` | – | Ja (admin) | Ta bort en sida |

### Växtsamling

| Metod | Endpoint | Body | Kräver token | Beskrivning |
|---|---|---|---|---|
| GET | `/api/plants` | – | Ja | Hämta inloggad användares växter, med veckoschema per spår samt `tier`-info (antal/gräns) |
| POST | `/api/plants` | `{ contentPageId, nickname?, watering: { intervalDays }, sunlight?, nutrition? }` | Ja | Lägg till en växt. `403` om max antal växter för nivån är nått |
| POST | `/api/plants/:id/mark-done` | `{ track: "watering" \| "sunlight" \| "nutrition" }` | Ja | Markera ett spår som gjort idag. `403` om spåret är låst för nivån |
| DELETE | `/api/plants/:id` | – | Ja | Ta bort en växt ur samlingen |

Vilka spår (`sunlight`/`nutrition`) som är upplåsta och hur många växter som får plats styrs av `TIER_FEATURES` i `config/tiers.ts`, beroende på användarens nivå.

---

## Datamodeller (sammanfattning)

**User**: `name, email, passwordHash, level, isAdmin, createdAt`
**Receipt**: `user (ref), level, amount, transactionId, createdAt`
**ContentPage**: `title, plantName, category, difficulty, summary, imageUrl, careInstructions { light, watering, soil, temperature, humidity, commonProblems? }, requiredLevel, createdBy (ref), createdAt`
**UserPlant**: `user (ref), contentPage (ref), nickname?, addedAt, watering { intervalDays, lastDoneAt? }, sunlight?, nutrition?`
**Level**: enum `grundpaket | plus | fullstandigt`, inte en egen collection

## Testa med curl

```bash
# Registrera
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Testsson","email":"test@test.se","password":"hemligt123"}'

# Logga in
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.se","password":"hemligt123"}'

# Välj nivå (byt ut <TOKEN>)
curl -X POST http://localhost:4000/api/payment/select-level \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"level":"plus"}'

# Hämta kvitton
curl http://localhost:4000/api/receipts \
  -H "Authorization: Bearer <TOKEN>"

# Lägg till en växt i samlingen (byt ut <TOKEN> och <CONTENT_PAGE_ID>)
curl -X POST http://localhost:4000/api/plants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"contentPageId":"<CONTENT_PAGE_ID>","watering":{"intervalDays":7}}'

# Hämta min växtsamling
curl http://localhost:4000/api/plants \
  -H "Authorization: Bearer <TOKEN>"
```
