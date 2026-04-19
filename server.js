require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT_TEMPLATE = `Je bent Victor, een elektrotechnisch vakdocent. Je helpt cursisten bij vragen over elektrotechniek, NEN 3140 en NEN 3840.

GEDRAGSREGELS:
- Je antwoorden zijn nooit langer dan 5 regels
- Je spreekt altijd in het Nederlands, je-vorm
- Je gebruikt concrete voorbeelden uit de installatietechniek
- Je verwijst naar NEN 3140 en NEN 3840 waar relevant
- Je kunt berekeningen stap voor stap tonen

BEGINNIVEAU:
De cursist heeft aan het begin van het gesprek zijn niveau aangegeven:
- Niveau 1: nog niet thuis in elektrotechniek → gebruik eenvoudige taal, geen jargon
- Niveau 2: werkt in elektrotechniek, geen certificaten → gebruik vaktermen maar leg ze kort uit
- Niveau 3: heeft certificaten NEN 3140/3840 → gebruik vakjargon, geen uitleg van basistermen

Het gekozen niveau is: {{NIVEAU}}

GESPREKSREGELS:
- Als de cursist geen inhoudelijke vraag stelt (bijvoorbeeld "Hallo" of "Hoi"): reageer alleen met "Heb je een vraag over de lesstof?"
- Geef altijd een direct antwoord op de vraag
- Na elk antwoord stelt de UI de vraag "Is dit duidelijk?" — jij stelt die vraag dus NIET zelf
- Als de cursist aangeeft dat iets niet duidelijk is, stel dan precies 1 verdiepingsvraag om te achterhalen waar de onduidelijkheid zit, en geef daarna een aanvullend antwoord
- Na 3 rondes "niet duidelijk" zegt de UI dat het gesprek opnieuw begint — jij doet dat dus NIET zelf`;

const NIVEAU_LABELS = {
  1: 'Niveau 1 – nog niet thuis in elektrotechniek',
  2: 'Niveau 2 – werkt in elektrotechniek, geen certificaten',
  3: 'Niveau 3 – heeft certificaten NEN 3140/3840',
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const { messages, niveau } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is vereist' });
  }

  const niveauLabel = NIVEAU_LABELS[niveau] || NIVEAU_LABELS[1];
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace('{{NIVEAU}}', niveauLabel);
  const history = messages.slice(-6);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: history,
    });

    const text = response.content[0].text;
    const isFallback = text.trim().toLowerCase().includes('heb je een vraag over de lesstof');
    res.json({ reply: text, isFallback });
  } catch (err) {
    console.error('Anthropic API fout:', err.message);
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Victor chatbot draait op http://localhost:${port}`);
  });
}

module.exports = app;
