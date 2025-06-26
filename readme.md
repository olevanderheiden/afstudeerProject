# Audio Tour Project

Dit project gebruikt **WordPress** als backend (voor contentbeheer) en **React (Vite)** als frontend.

## Installaite instructies voor ontwikkeling, builden en offline draaien

- Open de terminal en voer het volgende commando uit: "npm install"
- maak een bestand aan inde hoofd/root map van het project met de naam " .env" kijk naar het bestand ".envExample" om te zien welke syntax er wordt verwacht.
- Voor lokaal draien voer het volgende commando uit: "npm run dev". Je krijgt een link waar mee je de locaal draiende versie kan bekijken.

## Mappen Structuur

```
├── public/                  # Statische bestanden (favicon, service worker, logo's)
│   ├── cropped-DT-Icon-Light-32x32.png
│   ├── DT-LogoSide-Primary-Dark.svg
│   └── service-worker.js    # Service worker voor caching van API data en verminderen van laadtijden
├── src/                     # Broncode van de React-applicatie
│   ├── App.jsx              # Hoofdcomponent, bevat de navigatie en hoofdinhoud
│   ├── App.css              # Stijlen voor de hoofdcomponent en navigatie
│   ├── main.jsx             # Entry point, mounts React-app op de pagina
│   ├── index.css            # Stijlen die door de hele applicatie worden toegepast
│   ├── assets/              # React componenten en assets
│   │   ├── AudioTourList.jsx        # Hoofdcomponent voor de audiotour-lijst
│   │   └── pageElements/           # Herbruikbare UI-componenten
│   │       ├── AudioTourCard.jsx       # Kaart voor individuele audiotour
│   │       ├── AudioTourSection.jsx    # Sectie met meerdere kaarten
│   │       └── LoadingBar.jsx          # Laadbalk component voor wanneer de applicatie data laadt
│   ├── styles/               # CSS modules voor component-specifieke stijlen
│   │   ├── AudioTourCard.module.css
│   │   ├── AudioTourList.module.css
│   │   ├── AudioTourSection.module.css
│   │   └── LoadingBar.module.css
│   └── utils/
│       └── apiCalls.js       # Functies voor het ophalen van data uit de WordPress API
├── index.html                # HTML bestand dat alle Javascript code laadt
├── vite.config.js            # Vite configuratiebestand
├── eslint.config.js          # ESLint configuratiebestand
├── package.json              # Project metadata en scripts
├── copy404.js                # Script om index.html te kopiëren naar 404.html voor GitHub Pages routing
├── .envExample               # Voorbeeld van de benodigde omgevingsvariabelen
├── .gitignore                # Toont bestanden en mappen die niet in GIT moeten komen zoals .env
└── README.md                 # Projectdocumentatie (dit bestand)
```

## Ontwikkeling

- **WordPress**: Draait op een server van mijn opdracht gever en is niet (meer) te vinden in dit project, check audio test verise voor hoe de word press bestanden er uit zagen.)
- **React FrontEnd build instructies**:
  - Ontwikkel build met `npm run dev`.
  - Build voor productie met `npm run host`. Dit zet het ook automatisch op github pages. LET OP! Om te zorgen dat de site werkt op github pages dient de "base" in vite.config.js gelijk te lopen met de naam die de repository heeft op github. Anders zal de website niet worden getoond. Dit geld ook voor eventuele sub domeinen waar dit project op geplaatst kan worden wanneer het naar een meer definieve plaatse overgebracht gaat worden.

## Opmerkingen

- De frontend haalt content op via de WordPress REST API.
- WordPress kan niet op GitHub Pages worden gehost; alleen de statische frontend kan dat. Om de Frontend te laten werken dient er een .env bestand aanwezig te zijn in de hoofd map van dit project. Kijk naar .envExample om te kijken welke syntax er wordt verwacht
