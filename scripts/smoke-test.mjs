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
  await check('Homepage and three configured bot offers and bundle',async()=>{await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.locator('#pricing').innerText(),/300/);assert.match(await page.locator('#pricing').innerText(),/800/);assert.match(await page.locator('#pricing').innerText(),/62.5%/);assert.equal(await page.locator('#pricing button:disabled').count(),0);});
  await check('All three bots appear with separate product details',async()=>{
    assert.match(await page.locator('#performance-panel').innerText(),/556,400.62/);
    assert.equal(await page.locator('#pricing .product-details-link').count(),3);
    assert.equal(await page.locator('#pricing .pricing-card').count(),4);
    const cards=page.locator('#pricing .pricing-card');
    assert.match(await cards.nth(0).innerText(),/Agent Jin V1/);
    assert.match(await cards.nth(1).innerText(),/JinX ORB Scalper V2/);
    assert.match(await cards.nth(1).innerText(),/300/);
    assert.match(await cards.nth(1).innerText(),/62.5%/);
    assert.match(await cards.nth(2).innerText(),/JinX Zoro/);
    assert.match(await cards.nth(2).innerText(),/300/);
    assert.match(await cards.nth(3).innerText(),/600/);
    assert.match(await cards.nth(3).innerText(),/75% OFF/);
    assert.match(await cards.nth(3).innerText(),/1,800/);
    assert.equal(await page.locator('#pricing .offer-soon').count(),4);
    assert.match(await fs.readFile('out/sitemap.xml','utf8'),/jinx-orb-scalper-v2/);
    assert.equal(await page.locator('#strategy [role=tab]').count(),2);
    assert.doesNotMatch(await page.locator('body').innerText(),/MAX BLUE|MAX FLUID/);
    assert.doesNotMatch(await fs.readFile('out/sitemap.xml','utf8'),/max-blue|max-fluid/);
    for(const slug of ['max-blue','max-fluid']){
      await assert.rejects(fs.access('out/products/'+slug+'/index.html'));
      await assert.rejects(fs.access('out/images/products/'+slug+'.svg'));
    }
  });




  await check('Simulated chart replaces certificates and supports replay controls',async()=>{
    assert.equal(await page.locator('#proof .proof-card').count(),0);
    assert.match(await page.locator('#proof').innerText(),/SIMULATED DATA/);
    assert.doesNotMatch(await page.locator('#proof').textContent(), /Opening range|Example (entry|target|stop)|Interactive illustration|Move over the chart|Simulated chart for demonstration only/i);
    await page.getByRole('button',{name:'15m',exact:true}).click();
    assert.match(await page.locator('.market-readout').innerText(),/15m candles/);
    await page.getByRole('button',{name:'Reset chart replay',exact:true}).click();
    assert.equal(await page.locator('.market-candle').count(),36);
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
    for(const route of ['/products/agent-jin/','/products/jinx-orb-scalper-v2/','/products/jinx-zoro/','/contact/','/legal/risk/','/legal/privacy/','/legal/terms/']){
      for(const width of [390,1440]){await page.setViewportSize({width,height:950});const res=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(res.status(),200);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+route+' at '+width);}
    }
  });
  await page.goto(base,{waitUntil:'networkidle'});await page.setViewportSize({width:390,height:844});
  await check('Mobile navigation selection and Escape',async()=>{
    await page.getByRole('button',{name:'Open menu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');
    await page.locator('#main-nav').getByRole('link',{name:'Pricing',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
    await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
  });

  await check('All page image sources resolve; sitemap and robots',async()=>{
    const sources=await page.locator('img').evaluateAll(imgs=>[...new Set(imgs.map(i=>i.getAttribute('src')))]);
    for(const src of sources){const r=await page.request.get(base+src);assert.equal(r.status(),200,src);}
    assert.equal((await page.request.get(base+'/sitemap.xml')).status(),200);assert.equal((await page.request.get(base+'/robots.txt')).status(),200);
  });
  await check('Reduced motion preference is respected',async()=>{assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');});
  await page.setViewportSize({width:1440,height:1050});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'.local/desktop-final.png'});
  for(const id of ['performance','proof','reviews','strategy','pricing'])await page.locator('#'+id).screenshot({path:'.local/'+id+'-desktop.png',style:'.site-header,.skip-link{visibility:hidden!important}'});
  await page.setViewportSize({width:390,height:844});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'.local/mobile-final.png'});await page.locator('#proof').screenshot({path:'.local/proof-mobile.png'});
  await check('Client navigation opens product detail pages',async()=>{
    await page.locator('.product-details-link').first().click();
    await page.waitForURL('**/products/agent-jin/');assert.match(await page.locator('h1').innerText(),/Agent Jin V1/);
  });
  await check('Essential content remains visible with JavaScript disabled',async()=>{
    const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const doc=await plain.newPage();await doc.goto(base);
    assert.equal(await doc.locator('h1').isVisible(),true);
    for(const heading of await doc.locator('#pricing h2').all()) assert.equal(await heading.isVisible(),true);
    await plain.close();
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
