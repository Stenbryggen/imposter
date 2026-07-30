# Imposter

Simpelt online "Imposter"-ordspil til flere spillere. Alle spillere undtagen imposteren
kender et hemmeligt ord. Spillerne skiftes til at give ét hint hver, hvorefter der stemmes
om hvem imposteren er. Imposteren kan stadig vinde ved at gætte ordet rigtigt, hvis afsløret.

## Kør lokalt

```bash
npm install
npm start
```

Serveren kører på http://localhost:3000. Åbn den adresse i flere browserfaner (eller fra
flere telefoner på samme WiFi via din computers lokale IP, fx http://192.168.1.x:3000) for
at simulere flere spillere.

Der skal mindst 3 spillere til at starte et spil.

## Deploy til Render

1. Push dette repo til GitHub.
2. Gå til [render.com](https://render.com) → **New** → **Web Service**.
3. Vælg dit GitHub-repo. Render finder automatisk `render.yaml` og udfylder:
   - Build command: `npm install`
   - Start command: `npm start`
4. Vælg den gratis plan og klik **Deploy**.
5. Når deployet er klar, får du en offentlig URL (fx `https://imposter-xxxx.onrender.com`) —
   del den, eller lad spillerne scanne QR-koden der vises i lobbyen efter du har oprettet et rum.

Bemærk: på Render's gratis plan går serveren i dvale efter inaktivitet, så det kan tage
et par sekunder at vågne op, når I starter et nyt spil efter en pause.

## Sådan spiller I

1. Én spiller opretter et rum og deler rumkoden/QR-koden.
2. De andre joiner med deres navn og rumkoden.
3. Værten starter spillet (kræver mindst 3 spillere).
4. Alle undtagen imposteren ser et hemmeligt ord; imposteren ser kun kategorien.
5. Spillerne skiftes til at sige ét hint-ord om ordet.
6. Alle stemmer på hvem de tror er imposteren.
7. Bliver imposteren afsløret, får de ét forsøg på at gætte ordet for stadig at vinde.
8. Værten kan starte en ny runde med de samme spillere.
