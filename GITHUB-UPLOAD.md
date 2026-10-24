# Upload jinxlab to GitHub

1. Extract this ZIP.
2. Open your GitHub repository and choose Add file > Upload files.
3. Upload the extracted contents, including src/, public/, scripts/, package.json,
   package-lock.json, the configuration files, and .gitignore.
4. Commit the files. Upload the contents, not the ZIP itself.

The archive contains the current website source and all public assets, including
Agent-Jin-Promo.mp4, the 9-second sell GIF, certificates, and the floating banner.
Support email: jinzfx7@gmail.com. Telegram: https://t.me/jinzfx.

Run locally:
    npm ci
    npm run dev

Production build:
    npm run build
The static website is generated in out/. GitHub stores the source; deployment
requires a hosting build or a separate GitHub Pages workflow.

Not included: node_modules/, .next/, out/, .git/, .local/, .env files, credentials,
private source certificates, or the ChatGPT Sites hosting binding (.openai/).
Set src/data/site-config.ts to your final domain when deploying to a new URL.
