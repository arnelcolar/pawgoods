/* Site verification, run with:  node check.mjs
   Needs Playwright + a Chrome build on disk; both are expected in a dev clone.
   Fails (non-zero) if layout, interactions, the cart or the fragment handoff break. */
import { chromium } from '/var/mnt/microsd/Downloads/furniture-app/node_modules/playwright/index.mjs';
const B = '/var/home/statucviud/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell';
const DIR = 'file:///var/mnt/microsd/Downloads/pawgoods/';
const b = await chromium.launch({ executablePath: B });
let fail = 0;
const bad = (m) => { fail++; console.log('  FAIL ' + m); };

/* Desktop: no overflow, every section renders, logo mark is the mascot, no console errors. */
for (const w of [320, 390, 768, 1024, 1280, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(DIR + 'index.html');
  await p.waitForSelector('.card:not([hidden])');
  await p.waitForTimeout(250);
  const r = await p.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    cards: document.querySelectorAll('.card:not([hidden])').length,
    tiles: document.querySelectorAll('.cat-tile').length,
    filters: document.querySelectorAll('.filter').length,
    trust: document.querySelectorAll('.trust-item').length,
    side: document.querySelectorAll('.side-card:not([hidden])').length,
    nav: document.querySelectorAll('.main-nav li').length,
    sub: document.querySelectorAll('.sub-nav li').length,
    brand: document.querySelector('.logo-text').textContent,
    mascot: !!document.querySelector('.logo-mark .mascot'),
    emBlock: getComputedStyle(document.querySelector('.hero h1 em')).display,
  }));
  if (r.overflow > 0) bad(`${w}px: overflow ${r.overflow}px`);
  if (r.cards !== 23) bad(`${w}px: ${r.cards} cards`);
  if (r.tiles !== 8) bad(`${w}px: ${r.tiles} tiles`);
  if (r.filters !== 9) bad(`${w}px: ${r.filters} filters`);
  if (r.trust !== 4) bad(`${w}px: ${r.trust} trust items`);
  if (r.side !== 2) bad(`${w}px: ${r.side} side cards`);
  if (r.nav !== 3) bad(`${w}px: ${r.nav} nav`);
  if (r.sub !== 3) bad(`${w}px: ${r.sub} subnav`);
  if (r.brand !== 'Pawgoods') bad(`${w}px: brand "${r.brand}"`);
  if (!r.mascot) bad(`${w}px: mascot missing`);
  if (r.emBlock !== 'block') bad(`${w}px: emphasis not on its own line`);
  if (errs.length) bad(`${w}px console: ${errs.join(' | ')}`);
  await p.close();
}
console.log('desktop layout ok');

/* Search, filter, tiles, empty state, the counter, the cart bucket. */
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(DIR + 'index.html');
  await p.waitForSelector('.card:not([hidden])');
  const n = () => p.locator('.card:not([hidden])').count();
  await p.locator('.filter', { hasText: 'Feeding' }).click(); await p.waitForTimeout(120);
  if (await n() !== 4) bad('Feeding filter');
  await p.locator('.filter', { hasText: 'All' }).first().click();
  await p.fill('#q', 'fountain'); await p.waitForTimeout(150);
  if (await n() !== 1) bad('search');
  await p.fill('#q', '');
  await p.locator('.cat-tile', { hasText: 'Walking' }).click(); await p.waitForTimeout(200);
  if (await n() !== 3) bad('Walking tile');
  await p.fill('#q', 'zzzzz'); await p.waitForTimeout(150);
  if (await p.locator('#empty').isHidden()) bad('empty state');
  await p.locator('#reset').click(); await p.waitForTimeout(120);
  if (await n() !== 23) bad('reset');
  await p.locator('.card .buy').nth(0).click();
  await p.locator('.card .buy').nth(3).click();
  await p.waitForTimeout(200);
  if (await p.locator('[data-cart-count]').first().textContent() !== '2') bad('badge');
  await p.locator('.cart-link').click();
  await p.waitForSelector('.cart-line');
  if (await p.locator('.cart-line').count() !== 2) bad('cart lines');
  await p.locator('[data-act="inc"]').first().click(); await p.waitForTimeout(150);
  if (await p.locator('.qty-val').first().textContent() !== '2') bad('qty inc');
  await p.locator('[data-act="remove"]').first().click(); await p.waitForTimeout(150);
  if (await p.locator('.cart-line').count() !== 1) bad('remove');
  await p.locator('#clear').click(); await p.waitForTimeout(150);
  if (await p.locator('#empty-state').isHidden()) bad('empty after clear');
  if (errs.length) bad('page errors: ' + errs.join(' | '));
  await p.close();
  console.log('interactions ok');
}

/* The mascot boop must not navigate, and is safe inside the logo anchor. */
{
  const p = await b.newPage({ viewport: { width: 390, height: 300 } });
  await p.goto(DIR + 'index.html');
  await p.waitForTimeout(700);
  const before = p.url();
  await p.locator('.mascot').click();
  await p.waitForTimeout(200);
  if (p.url() !== before) bad('mascot boop navigated away');
  await p.close();
  console.log('mascot click swallowed ok');
}

/* Mobile chrome: header not pinned, chips scroll, cart bar appears, 16px input. */
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(DIR + 'index.html');
  await p.waitForSelector('.card:not([hidden])');
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    headPosition: getComputedStyle(document.querySelector('.site-head')).position,
    chipsScrollable: document.querySelector('.filter-row').scrollWidth > document.querySelector('.filter-row').clientWidth + 1,
    chipWrap: getComputedStyle(document.querySelector('.filter-row')).flexWrap,
    filterH: Math.round(document.querySelector('.filter').getBoundingClientRect().height),
    inputFont: parseFloat(getComputedStyle(document.querySelector('.search input')).fontSize),
    barHidden: document.getElementById('cart-bar').hidden,
  }));
  if (r.overflow > 0) bad(`mobile overflow ${r.overflow}px`);
  if (r.headPosition !== 'static') bad('header still sticky on mobile');
  if (!r.chipsScrollable || r.chipWrap !== 'nowrap') bad('chips not a single-line scroller');
  if (r.filterH < 44) bad(`chip tap target ${r.filterH}px`);
  if (r.inputFont < 16) bad(`input font ${r.inputFont}px`);
  if (!r.barHidden) bad('cart bar visible with empty cart');
  await p.locator('.card .buy').nth(0).tap();
  await p.locator('.card .buy').nth(3).tap();
  await p.waitForTimeout(300);
  const bar = await p.evaluate(() => ({
    hidden: document.getElementById('cart-bar').hidden,
    sum: document.getElementById('cart-bar-sum').textContent,
    count: document.querySelector('.cart-bar-count [data-cart-count]')?.textContent,
    href: document.getElementById('cart-bar').getAttribute('href'),
    onScreen: (() => { const r = document.getElementById('cart-bar').getBoundingClientRect(); return r.top < window.innerHeight && r.bottom <= window.innerHeight + 1; })(),
  }));
  if (bar.hidden) bad('cart bar hidden after add');
  if (!bar.sum.startsWith('$')) bad('cart bar no total');
  if (bar.count !== '2') bad(`cart bar count ${bar.count}`);
  if (!bar.onScreen) bad('cart bar not fully on screen');
  if ((bar.href.match(/#c=/g) || []).length !== 1) bad('cart href stamped wrong');
  if (errs.length) bad('mobile page errors: ' + errs.join(' | '));
  await p.close();
  console.log('mobile ok');
}

/* Firefox path: the cart must come back from the URL fragment alone. */
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await p.goto(DIR + 'index.html');
  await p.waitForSelector('.card:not([hidden])');
  await p.locator('.card .buy').nth(0).tap();
  await p.locator('.card .buy').nth(4).tap();
  await p.locator('.card .buy').nth(4).tap();
  await p.waitForTimeout(200);
  const href = await p.evaluate(() => document.getElementById('cart-bar').getAttribute('href'));
  if ((href.match(/#c=/g) || []).length !== 1) bad('fragment stamped ' + (href.match(/#c=/g) || []).length);
  await p.evaluate(() => localStorage.clear());
  await p.goto(DIR + href);
  await p.waitForSelector('.cart-line', { timeout: 5000 }).catch(() => {});
  const rows = await p.locator('.cart-line').count();
  const qtys = await p.locator('.qty-val').allTextContents();
  if (rows !== 2) bad(`handoff: ${rows} lines`);
  if (!qtys.includes('1') || !qtys.includes('2')) bad('handoff qty ' + qtys);
  if (await p.evaluate(() => location.hash) !== '') bad('fragment not cleared');
  await p.close();
  console.log('fragment handoff ok');
}

await b.close();
console.log(fail ? `\n${fail} FAILURE(S)` : '\nall checks passed');
process.exit(fail ? 1 : 0);
