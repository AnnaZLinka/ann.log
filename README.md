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

## Skrive innlegg

Hvert innlegg er en Markdown-fil i mappa `content/`. Lag en ny fil, for eksempel
`content/min-første-post.md`:

```md
---
title: min første post
pubDate: 2026-11-06
---

Her skriver du hva du vil. **Fet tekst**, [lenker](https://example.com),
lister og bilder fungerer som vanlig Markdown.

![en gif](../src/assets/wink.gif)
```

## Det du trenger å vite:

- **`title`** og **`pubDate`** må være med øverst i fila.
- Innleggene vises nyeste først på forsiden og i feeden.
- Bilder legger du i `src/assets/` og lenker til med `../src/assets/filnavn`.
- Bruk Markdown-syntaksen `![beskrivelse](../src/assets/filnavn)`, ikke `<img>`-tagger.
  Da blir bildene komprimert automatisk og fungerer både på nettstedet og i RSS-lesere.
- Bygget stopper hvis et bilde er over 4000 px bredt/høyt eller
  over 10 MB, så skaler ned slike før du legger dem inn.
- Innleggene vises også i RSS-lesere. Feeden fjerner skript og annet enn vanlig
  tekst, lenker og bilder.
- Filnavnet blir en del av lenken til innlegget, så bruk små bokstaver og bindestrek.

## RSS-feeden

Feeden ligger på `/rss.xml` og lages automatisk fra innleggene. Tittel og
beskrivelse på feeden endrer du i `src/pages/rss.xml.js`. Det er denne adressen
du melder inn til feed.netlife.com.

## Publisere

`npm run build` lager en ferdig statisk versjon i `dist/`. Den kan legges ut hvor
som helst som serverer statiske filer, for eksempel Netlify, Vercel eller GitHub
Pages. Uansett hvor du publiserer må `SITE_URL` settes som miljøvariabel i
byggeinnstillingene til tjenesten (for eksempel `https://mittnavn.vercel.app`).
Det er adressen nettstedet ligger på, og lenkene i RSS-feeden bygges fra den.
Mangler den, stopper bygget. Lokalt holder det at `.env` finnes, slik
`npm install`-steget over viser.

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
