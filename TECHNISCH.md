# Victor – Technische Documentatie

## Stack
- Backend: Node.js + Express
- AI: Anthropic SDK (claude-sonnet-4-6)
- Frontend: puur HTML/CSS/JS (geen frameworks)
- Hosting: Vercel

## Projectstructuur
```
Victor-chatbot-v2/
├── server.js          # Express backend
├── public/
│   ├── index.html     # Frontend
│   └── victor.png     # Avatar
├── .env               # API-sleutel (niet in git)
├── .env.example       # Voorbeeld zonder sleutel
├── package.json
├── vercel.json        # Vercel routing
├── .gitignore
├── README.md
└── TECHNISCH.md
```

## Lokaal draaien
```bash
npm install
npm start
# → http://localhost:3001
```

## Omgevingsvariabelen
| Variabele | Waarde |
|---|---|
| ANTHROPIC_API_KEY | Sleutel van console.anthropic.com |
| PORT | 3001 (lokaal), niet nodig op Vercel |

## Gesprekslogica
- Eerste bericht: backend gebruikt SYSTEM_PROMPT_FIRST → alleen diagnosevraag
- Vervolgberichten: backend gebruikt SYSTEM_PROMPT_MAIN → direct antwoord + afsluitingsvraag
- Gesprekshistorie: maximaal laatste 6 berichten worden meegestuurd
- isFirstResponse: boolean die in de frontend wordt bijgehouden en meegestuurd

## Systeemprompts
Twee prompts in server.js:
- SYSTEM_PROMPT_FIRST: stuurt Victor om alleen een diagnosevraag te stellen
- SYSTEM_PROMPT_MAIN: stuurt Victor om direct en volledig te antwoorden

## Huisstijl Veritech
| Naam | HEX | Gebruik |
|---|---|---|
| Veritech Blue | #3D7DFF | Knoppen, links |
| Deep Navy | #1E2B58 | Header, titels |
| Action Yellow | #FFB800 | Highlights |
| Soft Grey | #F5F7FA | Berichtachtergrond |
| Charcoal | #2D3748 | Tekst |

## Kennismodules toevoegen (gepland)
Via URL-parameter ?module=nen3140 laadt de backend een specifiek kennisdocument en past de systeemprompt aan. Één codebase, meerdere modules.

## Deployment naar Vercel
Zie volgende stap in het project.

## iFrame integratie
Voor Moodle en Rise: CORS en X-Frame-Options worden ingesteld in server.js bij deployment.
