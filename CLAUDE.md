# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # installeer dependencies
npm start         # start lokaal op http://localhost:3001
npm run dev       # start met --watch (auto-restart bij wijzigingen)
```

Server stoppen en herstarten:
```bash
lsof -ti:3001 | xargs kill && npm start
```

Deployen naar Vercel productie:
```bash
vercel --prod
```

## Architectuur

Express-app met twee bestanden:

- **`server.js`** — enige backend. Eén POST endpoint `/api/chat`. Serveert ook de statische bestanden uit `public/` via `express.static`. Exporteert `app` voor Vercel serverless; `app.listen()` draait alleen lokaal via `require.main === module`.
- **`public/index.html`** — volledige frontend in één bestand (HTML + CSS + JS). Geen frameworks.

## Gespreksflow

1. Chatvenster start collapsed (alleen header zichtbaar)
2. Klik op header → venster klapt open, welkomstbericht verschijnt (hardcoded, geen API)
3. Cursist kiest niveau via drie knoppen (1/2/3) — wordt als `niveau` meegestuurd aan de API
4. Tekstveld verschijnt, cursist stelt een vraag
5. Na elk Victor-antwoord: "Ja, duidelijk" / "Nee, meer uitleg" knoppen
   - "Ja" → gesprek afgesloten, melding getoond
   - "Nee" → neeCount ophogen, API-call met verdiepingsvraag
   - Na 3x "Nee" → melding + `location.reload()` na 3 seconden (timer clearbaar via nieuwGesprek)
6. Clarity-knoppen verschijnen NIET als Victor's antwoord eindigt op `?` (open vraag)
7. "Nieuw gesprek"-knop reset alle state en toont welkomstbericht opnieuw

## API-contract

**Request:**
```json
{ "messages": [...], "niveau": 1 }
```
- `messages`: array van `{ role, content }`, maximaal laatste 6 worden gebruikt
- `niveau`: integer 1, 2 of 3 (valt terug op 1 bij ongeldige waarde)

**Response:**
```json
{ "reply": "...", "isFallback": false }
```
- `isFallback: true` als Victor reageert met "Heb je een vraag over de lesstof?" (geen clarity-knoppen tonen)

## Systeemprompt

Één template in `server.js` met `{{NIVEAU}}` placeholder die dynamisch wordt ingevuld. Regels: max 5 regels antwoord, geen markdown/bullets/vet, geen emoji, no-jargon op niveau 1.

## Deployment

- Hosting: Vercel (project `rypkeprocees-projects/victor-chatbot-v2`)
- Live URL: https://victor-chatbot-v2.vercel.app
- GitHub: git@github.com:Rypkeprocee/Victor-chatbot-v2.git (SSH via `~/.ssh/github_key`)
- `ANTHROPIC_API_KEY` moet als environment variable in Vercel **production** staan
- iFrame embedding toegestaan via `Content-Security-Policy: frame-ancestors *` header

## Moodle integratie

```html
<iframe src="https://victor-chatbot-v2.vercel.app" width="480" height="700" frameborder="0"></iframe>
```

## Huisstijl Veritech

| Naam | HEX |
|---|---|
| Veritech Blue | `#3D7DFF` |
| Deep Navy | `#1E2B58` |
| Action Yellow | `#FFB800` |
| Soft Grey | `#F5F7FA` |
| Charcoal | `#2D3748` |
