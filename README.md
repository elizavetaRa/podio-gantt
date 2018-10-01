# Podio-Gantt

1. Clone or copy this repository
2. `npm install`
3. Set your Client-Id and Client-Secret for podio-access in config.js (those you get by https://podio.com/settings/api )
4. `npm run dev`
5. Go to `http://localhost:3000`
6. You will get an overview of all of your apps. To be displayed as Gantt-chart an app must have at least properties as:
  - "Deadline"
  - "Tage" (german for duration)
  Additionally Links between the Items in the App can be displayed by set property "Verbindung".


