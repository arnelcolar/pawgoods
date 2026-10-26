// Economics check for pawgoods. Run: node margin.mjs
//
// Prices a product the way Stripe actually charges for it, then subtracts the
// returns drag that dropship sellers eat. Exits non-zero if anything falls
// under the net floor, so this can gate a deploy.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// products.js is a classic script so index.html can load it from file://.
// Requiring it here gives Node the same data without a second copy.
const require = createRequire(import.meta.url);
require('./products.js');
const { PAWGOODS_PRODUCTS: products } = globalThis;

const STRIPE_PCT = 0.029;
const STRIPE_FIXED = 0.30;
const RETURN_RATE = 0.06; // ~6% on pet accessories
const RETURN_COST = 9.30; // return shipping you eat + Stripe keeps its fee
const NET_FLOOR = 8.00; // below this, one bad month flips you negative

const money = (n) => n.toFixed(2).padStart(8);

export function fees(price) {
  return price * STRIPE_PCT + STRIPE_FIXED;
}

export function returnDrag() {
  return RETURN_RATE * RETURN_COST;
}

export function net(price, cost, ship) {
  return price - fees(price) - cost - ship - returnDrag();
}

function assert() {
  // Guard the model itself, not just the data. A fee bug that zeroes out
  // costs would otherwise make every thin product look fine.
  if (fees(100) < 3) throw new Error('Stripe fee not applied');
  if (returnDrag() < 0.5) throw new Error('return drag not applied');
  // $100 with zero COGS and zero shipping should lose exactly fees + drag = $3.76
  const bare = net(100, 0, 0);
  if (Math.abs(bare - 96.24) > 0.01) throw new Error(`fees not deducted from net: ${bare}`);
  if (fees(0) !== STRIPE_FIXED) throw new Error('fixed fee wrong');

  // A $25 product must look worse than a $45 one, or the price signal is broken.
  if (net(45, 16, 9) <= net(25, 12, 8)) throw new Error('higher price should net more');

  return true;
}

function main() {
  assert();

  if (!Array.isArray(products) || products.length === 0) throw new Error('no products loaded');
  const failures = [];
  const unlinked = [];
  const byCategory = new Map();
  const nets = [];

  console.log('name'.padEnd(26), 'price'.padStart(8), 'cost'.padStart(7), 'ship'.padStart(7), 'fees'.padStart(7), 'net'.padStart(8), 'margin'.padStart(8));
  console.log('-'.repeat(73));

  for (const p of products) {
    const n = net(p.price, p.cost, p.ship);
    const pct = n / p.price;
    if (n < NET_FLOOR) failures.push(`${p.name} nets ${money(n).trim()} (below ${money(NET_FLOOR).trim()} floor)`);
    if (p.price < 40) failures.push(`${p.name} is under the $40 AOV floor`);
    if (!p.category) failures.push(`${p.name} has no category`);
    if (!p.stripeLink) unlinked.push(p.name);
    nets.push(n);

    if (!byCategory.has(p.category)) byCategory.set(p.category, { count: 0, net: 0 });
    const c = byCategory.get(p.category);
    c.count++;
    c.net += n;

    console.log(
      p.name.padEnd(26),
      money(p.price),
      money(p.cost),
      money(p.ship),
      money(fees(p.price)),
      money(n),
      `${(pct * 100).toFixed(1)}%`.padStart(7),
    );
  }

  console.log('-'.repeat(73));
  console.log(`Stripe ${(STRIPE_PCT * 100).toFixed(1)}% + ${money(STRIPE_FIXED).trim()} · returns ${(RETURN_RATE * 100).toFixed(0)}% = ${money(returnDrag()).trim()} drag · floor ${money(NET_FLOOR).trim()}`);

  console.log(`\n${products.length} products across ${byCategory.size} categories · net $${Math.min(...nets).toFixed(2)}-$${Math.max(...nets).toFixed(2)}\n`);
  for (const [name, c] of [...byCategory].sort((a, b) => b[1].count - a[1].count)) {
    console.log(`  ${name.padEnd(12)} ${String(c.count).padStart(2)} products   avg net $${(c.net / c.count).toFixed(2)}`);
  }

  // The cart works without Stripe: "Add to Cart" is always live and only the
  // checkout button is gated, so this is a warning rather than a blocker.
  if (unlinked.length) console.log(`\n${unlinked.length} product(s) have no stripeLink — the cart works, checkout stays disabled`);

  if (failures.length) {
    console.error('\nFAIL');
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log('\nPASS — all products clear the floor');
}

if (typeof process !== 'undefined' && process.argv?.[1] === fileURLToPath(import.meta.url)) main();