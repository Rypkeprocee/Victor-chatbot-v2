# Victor – Technische Documentatie

## Stack
- Backend: Node.js + Express
- AI: Anthropic SDK (claude-sonnet-4-6)
- Frontend: puur HTML/CSS/JS (geen frameworks)
- Hosting: Vercel

## Projectstructuur
```
Victor-chatbot-v2/
├── server.js          # Express backend + systeemprompt
├── public/
│   ├── index.html     # Volledige frontend (HTML + CSS + JS)
│   └── victor.png     # Avatar (fallback: gouden V)
├── .env               # API-sleutel (niet in git)
├── .env.example       # Voorbeeld zonder sleutel
├── package.json
├── vercel.json        # Vercel routing
├── .gitignore
├── README.md
├── TECHNISCH.md
└── CLAUDE.md
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

### Niveaukeuze
Bij het openen kiest de cursist één van drie niveaus. Dit bepaalt de `{{NIVEAU}}`-placeholder in de systeemprompt:
- Niveau 1 → eenvoudige taal, geen jargon
- Niveau 2 → vaktermen kort uitgelegd
- Niveau 3 → volledig vakjargon

### Clarity-flow
Na elk antwoord verschijnen "Ja, duidelijk" / "Nee, meer uitleg" knoppen — tenzij:
- Victor's antwoord eindigt op `?` (open vraag)
- Het een fallback-reactie is ("Heb je een vraag over de lesstof?")

Bij "Nee": `neeCount` ophogen, "Nee, ik begrijp het nog niet helemaal." naar API sturen. Bij de derde "Nee": pagina herladen na 3 seconden (timer te cancellen via "Nieuw gesprek").

### Gesprekshistorie
Maximaal laatste 6 berichten worden meegestuurd. `neeCount` reset bij elke nieuwe vraag van de cursist.

## Veiligheid
- `express.json({ limit: '20kb' })` — voorkomt oversized payloads
- `niveau` gevalideerd (alleen 1, 2 of 3 geaccepteerd)
- Foutmeldingen naar client zijn generiek (details alleen in server logs)
- `Content-Security-Policy: frame-ancestors *` — staat iFrame embedding toe

## Systeemprompts
Één template in `server.js` (`SYSTEM_PROMPT_TEMPLATE`) met `{{NIVEAU}}` placeholder. Gedragsregels: max 5 regels, geen markdown/bullets/vet/emoji, directe stijl.

## Deployment naar Vercel
```bash
vercel --prod
```

Environment variable instellen:
```bash
vercel env add ANTHROPIC_API_KEY production --value SLEUTEL --yes
vercel --prod
```

## iFrame integratie (Moodle / Rise)
```html
<iframe src="https://victor-chatbot-v2.vercel.app" width="480" height="700" frameborder="0"></iframe>
```

## Huisstijl Veritech
| Naam | HEX | Gebruik |
|---|---|---|
| Veritech Blue | `#3D7DFF` | Knoppen, links, focus |
| Deep Navy | `#1E2B58` | Header |
| Action Yellow | `#FFB800` | Avatar border, highlights |
| Soft Grey | `#F5F7FA` | Berichtachtergrond assistent |
| Charcoal | `#2D3748` | Tekst |

## Gepland: kennismodules
Via URL-parameter `?module=nen3140` laadt de backend een specifiek kennisdocument en past de systeemprompt aan. Één codebase, meerdere modules.
