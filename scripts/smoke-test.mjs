import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from '@playwright/test';
const root=path.resolve('out');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.gif':'image/gif','.mp4':'video/mp4','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'); let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
    const stat=await fs.stat(file);if(stat.isDirectory())file=path.join(file,'index.html');
    const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
  }catch{res.writeHead(404).end('Not found');}
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const base='http://127.0.0.1:4173';
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const executablePath=process.env.BROWSER_PATH||(process.platform==='win32'?edge:undefined);
let browser;const checks=[];const errors=[];
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
try{
  browser=await chromium.launch({headless:true,executablePath});
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)console.log('HTTP '+r.status()+' '+r.url());});
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(base,{waitUntil:'networkidle'});
  await check('Homepage and configured v3 pricing',async()=>{await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.locator('#pricing').innerText(),/649/);assert.match(await page.locator('#pricing').innerText(),/800/);assert.match(await page.locator('#pricing').innerText(),/18.875%/);assert.equal(await page.locator('#pricing button:disabled').count(),0);});
  await check('Only Agent Jin remains across the site',async()=>{
    assert.match(await page.locator('#performance-panel').innerText(),/556,400.62/);
    assert.equal(await page.locator('#pricing .product-details-link').count(),1);
    assert.equal(await page.locator('#pricing .pricing-card').count(),1);
    assert.equal(await page.locator('#strategy [role=tab]').count(),2);
    assert.doesNotMatch(await page.locator('body').innerText(),/MAX BLUE|MAX FLUID/);
    assert.doesNotMatch(await fs.readFile('out/sitemap.xml','utf8'),/max-blue|max-fluid/);
    for(const slug of ['max-blue','max-fluid']){
      await assert.rejects(fs.access('out/products/'+slug+'/index.html'));
      await assert.rejects(fs.access('out/images/products/'+slug+'.svg'));
    }
  });
  await check('All nine public certificates; no source originals',async()=>{
    const files=await fs.readdir('public/images/certificates');
    assert.deepEqual(files.sort(),Array.from({length:9},(_,i)=>'proof-'+String(i+1).padStart(2,'0')+'.webp'));
    assert.equal(await page.locator('#proof .proof-open').count(),9);
    const manifest=JSON.parse(await fs.readFile('asset-manifest.json','utf8'));assert.equal(manifest.length,15);
  });
  await check('Proof carousel arrows and pagination',async()=>{
    const c=page.locator('#proof .carousel').first();await c.scrollIntoViewIfNeeded();
    await c.getByRole('button',{name:'Next slide',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#proof .dots button:nth-child(2)')?.getAttribute('aria-current')==='true');
    await c.getByRole('button',{name:'Go to slide 1',exact:true}).click();
  });
  await check('Eight certificates in top two rows; third row contains only product banner',async()=>{
    const rows=page.locator('#proof .proof-row');
    assert.deepEqual(await rows.evaluateAll(items=>items.map(row=>row.querySelectorAll('.proof-open').length)),[4,4,1]);
    assert.equal(await rows.nth(2).locator('.carousel-controls').count(),0);
    const trigger=page.getByRole('button',{name:'Enlarge AGENT JIN product showcase',exact:true});
    const img=trigger.locator('img');
    assert.match(await img.getAttribute('src'),/agent-jin-banner-animated\.svg$/);
    await img.evaluate(el=>el.decode());
    const fit=await img.evaluate(el=>({image:el.getBoundingClientRect().width/el.getBoundingClientRect().height,native:el.naturalWidth/el.naturalHeight}));
    assert.ok(Math.abs(fit.image-fit.native)<0.01,'Showcase fills its rectangle without letterboxing');
    await trigger.click();
    assert.match(await page.getByRole('dialog').innerText(),/Product showcase.*AGENT JIN v3.*9 \/ 9/);
    await page.keyboard.press('Escape');
  });
  await check('Lightbox keyboard, focus, escape and report enlargement',async()=>{
    const trigger=page.locator('#proof .proof-open').first();await trigger.click();
    const dialog=page.getByRole('dialog');await dialog.waitFor();assert.match(await dialog.innerText(),/1 \/ 9/);
    await page.keyboard.press('ArrowRight');assert.match(await dialog.innerText(),/2 \/ 9/);
    await page.keyboard.press('ArrowLeft');assert.match(await dialog.innerText(),/1 \/ 9/);
    await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
    await page.getByRole('button',{name:'Enlarge supplied Agent Jin historical report',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
  });
  await check('Accessible single-open FAQ',async()=>{
    const questions=page.locator('#faq summary');await questions.nth(0).click();assert.equal(await page.locator('#faq details[open]').count(),1);
    await questions.nth(1).click();assert.equal(await page.locator('#faq details[open]').count(),1);
    await questions.nth(1).focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#faq details[open]').count(),0);
  });
  await check('Responsive homepage at 375, 390, 768, 1024, 1440 and 1920 pixels',async()=>{
    for(const width of [375,390,768,1024,1440,1920]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>window.scrollTo(0,0));
      const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(size.scroll<=size.width+1,'Overflow at '+width+': '+JSON.stringify(size));
    }
  });
  await check('Every product, contact and legal page at mobile and desktop widths',async()=>{
    for(const route of ['/products/agent-jin/','/contact/','/legal/risk/','/legal/privacy/','/legal/terms/']){
      for(const width of [390,1440]){await page.setViewportSize({width,height:950});const res=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(res.status(),200);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+route+' at '+width);}
    }
  });
  await page.goto(base,{waitUntil:'networkidle'});await page.setViewportSize({width:390,height:844});
  await check('Mobile navigation selection and Escape',async()=>{
    await page.getByRole('button',{name:'Open menu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');
    await page.locator('#main-nav').getByRole('link',{name:'Pricing',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
    await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
  });
  await check('Mobile certificate swipe and touch lightbox navigation',async()=>{
    const viewport=page.locator('#proof .carousel-viewport').first();await viewport.scrollIntoViewIfNeeded();
    const box=await viewport.boundingBox();const cdp=await page.context().newCDPSession(page);
    const x=box.x+box.width*.8,y=box.y+box.height*.5;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*30,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await page.waitForFunction(()=>document.querySelector('#proof .dots button[aria-current=true]')?.getAttribute('aria-label')!=='Go to slide 1');
    await page.locator('#proof .dots button').first().click();
    await page.locator('#proof .proof-open').first().click();
    await page.locator('.lightbox-swipe').evaluate(el=>{
      const make=x=>new Touch({identifier:1,target:el,clientX:x,clientY:200});
      el.dispatchEvent(new TouchEvent('touchstart',{touches:[make(300)],bubbles:true}));
      el.dispatchEvent(new TouchEvent('touchend',{changedTouches:[make(100)],bubbles:true}));
    });
    assert.match(await page.getByRole('dialog').innerText(),/2 \/ 9/);await page.keyboard.press('Escape');await cdp.detach();
  });
  await check('All page image sources resolve; sitemap and robots',async()=>{
    const sources=await page.locator('img').evaluateAll(imgs=>[...new Set(imgs.map(i=>i.getAttribute('src')))]);
    for(const src of sources){const r=await page.request.get(base+src);assert.equal(r.status(),200,src);}
    assert.equal((await page.request.get(base+'/sitemap.xml')).status(),200);assert.equal((await page.request.get(base+'/robots.txt')).status(),200);
  });
  await check('Reduced motion preference is respected',async()=>{assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');});
  await page.setViewportSize({width:1440,height:1050});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'.local/desktop-final.png'});
  for(const row of await page.locator('#proof .proof-row').all()){await row.scrollIntoViewIfNeeded();await row.locator('img').first().evaluate(img=>img.decode());}
  for(const id of ['performance','proof','reviews','strategy','pricing'])await page.locator('#'+id).screenshot({path:'.local/'+id+'-desktop.png',style:'.site-header,.skip-link{visibility:hidden!important}'});
  await page.setViewportSize({width:390,height:844});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'.local/mobile-final.png'});await page.locator('#proof').screenshot({path:'.local/proof-mobile.png'});
  await check('Client navigation opens product detail pages',async()=>{
    await page.locator('.product-details-link').click();
    await page.waitForURL('**/products/agent-jin/');assert.match(await page.locator('h1').innerText(),/AGENT JIN/);
  });
  await check('Essential content remains visible with JavaScript disabled',async()=>{
    const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const doc=await plain.newPage();await doc.goto(base);
    assert.equal(await doc.locator('h1').isVisible(),true);
    assert.equal(await doc.locator('#pricing h2').isVisible(),true);
    await plain.close();
  });
  await check('Three stacked rows, top two autoplay every 5 seconds, pause and reduced motion',async()=>{
    await page.goto(base,{waitUntil:'networkidle'});
    assert.equal(await page.locator('#proof .proof-row').count(),3);
    const normal=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
    normal.on('pageerror',e=>errors.push(e.message));
    await normal.clock.install({time:new Date('2026-10-24T00:00:00Z')});
    await normal.clock.pauseAt(new Date('2026-10-24T00:00:01Z'));
    await normal.goto(base,{waitUntil:'load'});
    await normal.clock.runFor(100);
    const rowPositions=await normal.locator('.proof-row').evaluateAll(rows=>rows.map(el=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom})));
    assert.equal(rowPositions.length,3);
    assert.ok(rowPositions[0].bottom<rowPositions[1].top&&rowPositions[1].bottom<rowPositions[2].top);
    const selected=()=>normal.locator('#proof .dots button[aria-current=true]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
    await normal.clock.runFor(4800);
    assert.deepEqual(await selected(),Array(2).fill('Go to slide 1'));
    await normal.clock.runFor(300);
    assert.deepEqual(await selected(),Array(2).fill('Go to slide 2'));
    assert.equal(await normal.getByRole('tab',{name:'Sell demonstration',exact:true}).getAttribute('aria-selected'),'true');
    const first=normal.locator('#proof .carousel').first();
    await first.getByRole('button',{name:'Pause slideshow',exact:true}).click();
    await normal.locator('.brand').first().focus();await normal.mouse.move(0,0);
    await normal.clock.runFor(5500);
    assert.equal((await selected())[0],'Go to slide 2');
    await normal.close();
    assert.equal(await page.locator('.autoplay-toggle').count(),0);
  });
  await check('Montserrat, text-only jinxlab branding, hero placement and Telegram access',async()=>{
    await page.goto(base,{waitUntil:'networkidle'});
    assert.match(await page.locator('body').evaluate(el=>getComputedStyle(el).fontFamily),/^Montserrat/);
    assert.equal(await page.locator('.brand').first().innerText(),'jinxlab');
    assert.equal(await page.locator('.brand svg,.brand img').count(),0);
    assert.doesNotMatch(await page.locator('body').innerText(),/JINZFX MARKET|TradeX Labs/);
    for(const link of await page.getByRole('link',{name:'Get ORB Access',exact:true}).all()){
      const destination=new URL(await link.getAttribute('href'));
      assert.equal(destination.origin+destination.pathname,'https://t.me/jinzfx');
      assert.equal(destination.searchParams.get('text'),"Hi, I'd like access to ORB.");
    }
    const order=await page.locator('.hero').evaluate(hero=>['h1','.reference-video','.hero-description','.review-summary','.access-cta','.hero-chips'].map(selector=>hero.querySelector(selector).getBoundingClientRect().top));
    assert.ok(order.every((top,i)=>i===0||top>order[i-1]));
  });
  await check('Fourteen supplied reviews, show more and show fewer',async()=>{
    assert.equal(await page.locator('.review-card').count(),6);
    await page.getByRole('button',{name:'Show more reviews',exact:true}).click();
    assert.equal(await page.locator('.review-card').count(),14);
    assert.equal(await page.locator('.review-card time').count(),0);
    const ratings=await page.locator('.review-card .stars').evaluateAll(nodes=>nodes.map(el=>Number(el.getAttribute('aria-label').match(/([1-5]) out of 5 stars/)[1])));
    assert.ok(ratings.every(rating=>rating===5));
    assert.equal((ratings.reduce((sum,rating)=>sum+rating,0)/ratings.length).toFixed(1),'5.0');
    assert.match(await page.locator('#reviews .section-heading').innerText(),/Customer reviews supplied by jinxlab/);
    for(const summary of await page.locator('.review-summary').all()) assert.match(await summary.innerText(),/5.0.*14 customer reviews/s);
    await page.getByRole('button',{name:'Show fewer reviews',exact:true}).click();
    assert.equal(await page.locator('.review-card').count(),6);
  });
  await check('Hero video controls and looping buy/sell GIFs',async()=>{
    const hero=page.locator('.hero');
    const video=hero.locator('video');
    assert.match(await video.getAttribute('src'),/agent-jin-promo\.mp4$/);
    assert.match(await video.getAttribute('poster'),/agent-jin-promo-poster\.jpg$/);
    await video.evaluate(el=>el.readyState>=1?Promise.resolve():new Promise(resolve=>el.addEventListener('loadedmetadata',resolve,{once:true})));
    assert.ok(Math.abs(await video.evaluate(el=>el.duration)-99.366667)<0.1);
    assert.equal(await video.evaluate(el=>el.paused),true);
    await video.evaluate(async el=>{el.muted=true;await el.play();});
    await page.waitForFunction(()=>document.querySelector('.hero video').currentTime>0);
    await hero.getByRole('button',{name:'Play with sound',exact:true}).click();
    assert.equal(await video.evaluate(el=>el.muted),false);
    await hero.getByRole('button',{name:'Mute sound',exact:true}).click();
    assert.equal(await video.evaluate(el=>el.muted),true);
    await video.evaluate(el=>el.pause());
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.getByRole('tab',{name:'Sell demonstration',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#trade-demo-panel img').currentSrc.endsWith('sell-demo.gif'));
    assert.match(await page.locator('#trade-demo-panel img').evaluate(img=>img.currentSrc),/sell-demo.gif/);
    await page.locator('#trade-demo-panel img').evaluate(img=>img.decode());
    await page.getByRole('tab',{name:'Sell demonstration',exact:true}).press('Home');
    await page.waitForFunction(()=>document.querySelector('#trade-demo-panel img').currentSrc.endsWith('buy-demo.gif'));
    assert.match(await page.locator('#trade-demo-panel img').evaluate(img=>img.currentSrc),/buy-demo.gif/);
    assert.equal(await page.locator('#trade-demo-panel video').count(),0);
    assert.equal(await page.locator('#trade-demo-panel .sound-toggle').count(),0);
    for(const src of ['/images/demos/buy-demo.gif','/images/demos/sell-demo.gif'])assert.equal((await page.request.get(base+src)).status(),200);
    await page.locator('#strategy').screenshot({path:'.local/strategy-gif.png',style:'.site-header,.skip-link{visibility:hidden!important}'});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>document.querySelector('#trade-demo-panel img').currentSrc.endsWith('buy-poster.jpg'));
    for(const src of ['/videos/buy-demo.mp4','/videos/sell-demo.mp4'])assert.equal((await page.request.get(base+src)).status(),200);
  });
  await check('No browser JavaScript or console errors',async()=>assert.deepEqual(errors,[]));
  await fs.writeFile('.local/test-results.json',JSON.stringify({checks,widths:[375,390,768,1024,1440,1920],errors},null,2));
  console.log(checks.length+' checks passed.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
