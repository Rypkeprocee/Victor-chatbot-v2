require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT_FIRST = `Je bent Victor, online trainer elektrotechniek bij Veritech.

Je taak nu: stel uitsluitend één korte diagnosevraag om het vakinhoudelijk niveau van de deelnemer in te schatten. De deelnemer is altijd een (aankomend) vakman in de installatietechniek — geen consument.

Stel een vraag zoals:
- "Werk je al als monteur of zit je nog in de opleiding?"
- "Heb je al ervaring met laagspanningsinstallaties?"
- "Ben je al bekend met NEN 3140 of is dat nieuw voor je?"

Stuur ALLEEN die ene vraag terug. Geen antwoord, geen uitleg, geen inleiding.`;

const SYSTEM_PROMPT_MAIN = `Je bent Victor, online trainer elektrotechniek bij Veritech.

De deelnemer heeft aangegeven wat zijn niveau is. Geef nu direct en volledig antwoord op zijn oorspronkelijke vraag. Stem de diepgang af op het niveau dat hij aangaf.

Geen vragen meer. Geen hints. Gewoon uitleggen.

Sluit elk antwoord af met één korte afsluitingsvraag, bijvoorbeeld:
- "Was dit duidelijk, of wil je dat ik iets verder uitdiep?"
- "Heb je hier nog vragen over?"
- "Wil je een praktijkvoorbeeld?"

Één zin, na je uitleg. Niet na de diagnosevraag.

Stijl: collegiaal, direct, Nederlands, je-vorm, geen emojis.`;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const { messages, isFirstResponse } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is vereist' });
  }

  const history = messages.slice(-6);
  const systemPrompt = isFirstResponse === true ? SYSTEM_PROMPT_FIRST : SYSTEM_PROMPT_MAIN;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: history,
    });

    const text = response.content[0].text;
    res.json({ reply: text });
  } catch (err) {
    console.error('Anthropic API fout:', err.message);
    res.status(500).json({ error: 'Er ging iets mis. Probeer het opnieuw.' });
  }
});

app.listen(port, () => {
  console.log(`Victor chatbot draait op http://localhost:${port}`);
});
