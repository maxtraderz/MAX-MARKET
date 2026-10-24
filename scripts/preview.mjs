import { chromium } from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
await page.screenshot({path:'.local/desktop-first.png'});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'.local/mobile-first.png'});
await browser.close();
