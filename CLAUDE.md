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

## Gesprekslogica

De frontend beheert `isFirstResponse` (boolean, reset bij "Nieuw gesprek") en stuurt dit mee in elke request. De backend kiest op basis daarvan één van twee systeemprompts:

- `SYSTEM_PROMPT_FIRST` (`isFirstResponse === true`) — Victor stelt alleen een diagnosevraag, geen antwoord
- `SYSTEM_PROMPT_MAIN` (`isFirstResponse === false`) — Victor geeft volledig antwoord + afsluitingsvraag

De frontend zet `isFirstResponse = false` na het eerste succesvolle antwoord. Gesprekshistorie: maximaal laatste 6 berichten worden meegestuurd.

## Deployment

- Hosting: Vercel (project `rypkeprocees-projects/victor-chatbot-v2`)
- Live URL: https://victor-chatbot-v2.vercel.app
- GitHub: git@github.com:Rypkeprocee/Victor-chatbot-v2.git (SSH via `~/.ssh/github_key`)
- `ANTHROPIC_API_KEY` moet als environment variable in Vercel production staan

## Huisstijl Veritech

| Naam | HEX |
|---|---|
| Veritech Blue | `#3D7DFF` |
| Deep Navy | `#1E2B58` |
| Action Yellow | `#FFB800` |
| Soft Grey | `#F5F7FA` |
| Charcoal | `#2D3748` |
