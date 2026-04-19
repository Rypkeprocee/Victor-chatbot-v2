# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                              # installeer dependencies
npm start                                # start lokaal op http://localhost:3001
npm run dev                              # start met --watch
lsof -ti:3001 | xargs kill && npm start  # herstart
vercel --prod                            # deploy naar productie
```

## Architectuur

Twee bestanden vormen de hele app:

- **`server.js`** — Express backend. Één POST endpoint `/api/chat`. Serveert statische bestanden uit `public/` via `express.static`. Exporteert `app` voor Vercel serverless; `app.listen()` draait alleen lokaal (`require.main === module`).
- **`public/index.html`** — Volledige frontend in één bestand. Geen frameworks, geen buildstap.

## Gespreksflow (belangrijk voor wijzigingen)

1. Header collapsed → klik → venster klapt open + hardcoded welkomstbericht (geen API-call)
2. Cursist kiest niveau (1/2/3) via knoppen → tekstveld verschijnt
3. Vraag verstuurd → `niveau` + `messages` naar `/api/chat`
4. Na antwoord: "Ja, duidelijk" / "Nee, meer uitleg" knoppen — tenzij antwoord eindigt op `?` of `isFallback === true`
5. Na 3× "Nee": auto-reload na 3 seconden (timer opgeslagen in `reloadTimer`, clearbaar via "Nieuw gesprek")

## API-contract

**Request:** `{ messages: [{role, content}], niveau: 1|2|3 }`
**Response:** `{ reply: string, isFallback: boolean }`

- `messages`: maximaal laatste 6 worden gebruikt server-side
- `niveau`: valt terug op 1 bij ongeldige waarde
- `isFallback`: true als Victor reageert met "Heb je een vraag over de lesstof?"

## Systeemprompt

Één template (`SYSTEM_PROMPT_TEMPLATE`) in `server.js` met `{{NIVEAU}}` placeholder. Gedragsregels: max 5 regels, geen markdown/bullets/vet/emoji, directe stijl. Niveau bepaalt taalgebruik (1 = geen jargon, 3 = volledig vakjargon).

## Deployment

- Live: https://victor-chatbot-v2.vercel.app
- GitHub: `git@github.com:Rypkeprocee/Victor-chatbot-v2.git` (SSH via `~/.ssh/github_key`)
- `ANTHROPIC_API_KEY` moet in Vercel **production** environment staan
- iFrame embedding toegestaan via `Content-Security-Policy: frame-ancestors *` (gezet in `server.js`)

## Huisstijl Veritech

`#3D7DFF` (blue) · `#1E2B58` (navy, header) · `#FFB800` (yellow, avatar) · `#F5F7FA` (grey, bubbles) · `#2D3748` (charcoal, tekst)
