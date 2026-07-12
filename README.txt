MAX MARKET Website

Folder path requested:
D:\MAX WEBSITE

Files:
- index.html
- style.css
- script.js
- README.txt

How to open:
Open index.html in any modern browser. No backend, database, build step, or payment gateway is required.

How to edit bots:
Open script.js and edit the bots array near the top of the file.
Each bot supports:
- name
- market
- risk
- price
- description
- features

To add another bot, copy one full object inside the bots array, paste it after the last bot, and update the text.

How to change social links:
Open script.js and edit these constants:
- TELEGRAM_USERNAME
- INSTAGRAM_URL
- YOUTUBE_URL

The Telegram bot buttons copy this message:
"Hi, I am interested in [BOT NAME]. Please send me full details and price."

Then they open:
https://t.me/max_traderz

Theme:
The dark/light mode toggle saves the visitor's choice in localStorage.

Notes:
- This website uses pure HTML, CSS, and JavaScript only.
- Bot cards are rendered dynamically from script.js.
- Search/filter works by bot name, market, risk, and description.
- The layout is responsive for mobile, tablet, and desktop.
