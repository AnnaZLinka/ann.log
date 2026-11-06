# Netlife mikroblogg

En liten mal for et personlig nettsted med egen RSS-feed. Feeden plukkes opp av
[feed.netlife.com](https://feed.netlife.com), så alt du poster her dukker opp der.

## Kom i gang

Du trenger [Node.js](https://nodejs.org) (versjon 22 eller nyere).

1. Lag en kopi av dette repoet (fork eller "Use this template" på GitHub) og last det ned.
2. Åpne en terminal i mappa og kjør:

   ```sh
   npm install
   cp .env.example .env
   npm run dev
   ```

3. Åpne [localhost:4321](http://localhost:4321) i nettleseren.

Fila `.env` inneholder `SITE_URL`, adressen nettstedet skal ligge på. Lokalt kan
den stå som den er. Når du publiserer må den peke på den ekte adressen, ellers
blir lenkene i RSS-feeden feil.

## Skrive innlegg

Hvert innlegg er en Markdown-fil i mappa `content/`. Lag en ny fil, for eksempel
`content/min-første-post.md`:

```md
---
title: min første post
publishedAt: 2026-11-06
---

Her skriver du hva du vil. **Fet tekst**, [lenker](https://example.com),
lister og bilder fungerer som vanlig Markdown.

![en gif](../src/assets/wink.gif)
```

Det du trenger å vite:

- **`title`** og **`publishedAt`** må være med øverst i fila.
- Innleggene vises nyeste først på forsiden og i feeden.
- Innlegg med dato fram i tid vises ikke før datoen er passert (og nettstedet er
  bygget på nytt). Greit for å forberede noe du vil publisere senere.
- Bilder og gifer legger du i `src/assets/` og lenker til med `../src/assets/filnavn`.
- Filnavnet blir en del av lenken til innlegget, så bruk små bokstaver og bindestrek.

## Endre utseende og sider

- `src/pages/index.astro` er forsiden.
- `src/layouts/Layout.astro` er rammen rundt alle sider (topp, bunn, RSS-knapp).
- `src/styles/global.css` er stilene. Prosjektet bruker [Tailwind](https://tailwindcss.com).
- Vil du ha en ny side? Lag en ny `.astro`-fil i `src/pages/`. `hemmelig.astro`
  blir for eksempel til `/hemmelig`.

## RSS-feeden

Feeden ligger på `/rss.xml` og lages automatisk fra innleggene. Tittel og
beskrivelse på feeden endrer du i `src/pages/rss.xml.js`. Det er denne adressen
du melder inn til feed.netlife.com.

## Publisere

`npm run build` lager en ferdig statisk versjon i `dist/`. Den kan legges ut hvor
som helst som serverer statiske filer, for eksempel Netlify, Vercel eller GitHub
Pages. Husk å sette `SITE_URL` som miljøvariabel der du publiserer.

Enklest er å dytte prosjektet til GitHub og koble repoet til for eksempel
[Vercel](https://vercel.com) eller [Netlify](https://netlify.com). Da bygges og
publiseres nettstedet automatisk hver gang du pusher en endring.

## Kommandoer

| Kommando          | Hva den gjør                      |
| ----------------- | --------------------------------- |
| `npm run dev`     | Starter lokal utviklingsserver    |
| `npm run build`   | Bygger nettstedet til `dist/`     |
| `npm run preview` | Viser det bygde nettstedet lokalt |

Lurer du på noe mer om Astro? Se [docs.astro.build](https://docs.astro.build).
