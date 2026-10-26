# pawgoods

A pet accessories store. Static HTML, one config file, Stripe Payment Links.
No build step, no npm dependencies, no database.

## Run it

Open `index.html` directly in a browser. No server needed.

```sh
node margin.mjs        # economics check, exits non-zero if a product is unviable
```

## Files

| File | What it is |
|---|---|
| **`config.js`** | **Every brand string in the template.** The only file you edit for content. |
| **`cart.js`** | Cart store. `localStorage`, no server. Loaded by both pages. |
| **`cart.html`** | The cart page. |
| `products.js` | Your catalogue. The only file you edit for products. |
| `index.html` | Scaffolding only — no brand strings, no product markup. Renders from `config.js`. |
| `styles.css` | The design system. Tokens at the top, then rules. |
| `margin.mjs` | Reads `products.js`, checks every product is worth selling. |
| `mobile-preview.html` | Phone-frame preview of the mobile UX, with the decisions listed beside it. |
| `brand/` | The logo, its exported variants, favicon and icon set. Safe to delete if you supply your own. |

Order matters: `config.js` loads before `products.js`, and `products.js` before
the inline script.

## Making it yours

Everything brand-specific lives in `config.js`:

```js
brand: 'Pawgoods',
tagline: 'Pet accessories that survive the house.',
title: 'Pawgoods — pet accessories that survive the house',
announce: 'Free shipping on orders over $50.00',   // null hides the bar
nav: [{ label: 'Shop', href: '#grid', pill: true }, ...],
subnav: [{ label: 'New Arrivals', href: '#grid' }, ...],
account: { caption, links: [...] },
hero: { dateline, headline, emphasis, lead, cta, sideCards: [...] },
features: [{ icon, label, note }, ...],           // the four-up trust strip
sections: { products, categories, split, why },
footer: { note, columns: [...] },
```

Three behaviours worth knowing:

- **Sections are opt-out.** Delete `sections.why` or set `sections.split` to
  `null` and the section disappears entirely rather than rendering an empty
  shell. Nav links pointing at a missing or hidden section are removed
  automatically — that prune runs after the product pass, since a section's
  `hidden` flag is not final until the catalogue has decided it has anything to
  show.
- **`icon` must be one of `truck`, `refresh`, `shield`, `chat`.** Anything else
  falls back to a neutral glyph, so a typo cannot inject markup.
- **`__COUNT__` in footer copy** is replaced with the real product count, so
  "23 sample products" can't go stale when you add a product.

## Retheming

The palette is one block at the top of `styles.css`. These values are taken
from NextMerce's `tailwind.config.ts`, and its three shadows are reproduced
verbatim as `--shadow-1/2/3`:

```css
--blue:   #3c50e0;   /* primary: buttons, active filter, links */
--ink:    #1c274c;   /* headings, strong body */
--muted:  #606882;   /* secondary text */
--faint:  #8d93a5;   /* captions, decorative only */
--surface:#f7f9fc;   /* section washes, tiles, image backdrop */
--line:   #e5e7eb;   /* borders */
--red:    #f23030;   /* sale badge, cart count */
```

Media geometry is three more tokens, so you can go from square packaging to
portrait apparel without touching a rule:

```css
--ratio-card:  1 / 1;
--ratio-split: 1 / 1;
```

The reference uses Euclid Circular A, which is not freely available, so
`--font` names it first and falls back to the system geometric sans stack.

`prefers-contrast: more` raises `--muted`, `--faint` and `--line` to darker
values, since the body/meta text sits near the AA limit at 13px.

## Categories

8 categories, 23 products. Add a product with a new `category` value and it
appears in the filter automatically — the chips and their counts are built from
the data at runtime, so there is nothing to keep in sync by hand.

Feeding, Water, Grooming, Training, Walking, Toys, Sleep, Travel.

## Going live

1. Replace `cost` and `ship` in `products.js` with real supplier quotes.
2. Run `node margin.mjs`. Anything failing the $8 net floor or the $40 price
   floor needs repricing or dropping.
3. Create a Stripe account (US: 2.9% + $0.30, no monthly, no setup fee).
4. Create one Payment Link per product, paste each URL into that product's
   `stripeLink`. Buttons enable themselves.
5. Replace the hotlinked Unsplash images with your own product photography.
6. Register for sales tax when you're liable. Stripe Tax is 0.5% per transaction.

## Motion

Interaction feedback follows Apple-style principles where they apply:

- **Press feedback on pointer-down, not release.** Buttons, chips and quantity
  controls compress ~3% the instant they're touched and release on lift.
- **Only `transform` and `opacity` animate**, so motion stays on the compositor
  and never triggers layout.
- **Hover and press are gated to fine pointers.** On touch, `:active` sticks
  after the tap and a control reads as stuck down, so touch gets a brief colour
  tint instead.
- **The cart badge grows from its own centre** when the count changes, so the
  number reads as a response to the add.
- **`prefers-reduced-motion`** drops the scaling and keeps a short cross-fade —
  reduced motion means gentler feedback, not none.

Deliberately absent: no spring library, no gesture handling, no velocity handoff
or momentum projection. There are no drag interactions here to drive them, and
adding a dependency to a no-dependency template for a button label is not a
trade worth making. The translucent blurred header is also omitted — it needs a
semi-transparent background to be visible at all, reads muddy over warm paper, and
costs scroll performance for no functional gain.

Motion rules sit **above** the reduced-motion block in `styles.css`. Equal
specificity means source order wins, so anything that must be overridden has to
come later — otherwise `prefers-reduced-motion` silently does nothing.

## The cart

Client-side, no server. Items live in `localStorage` under `pawgoods.cart.v1`, so
the cart survives a page reload and works opened straight from `file://`.

**What that costs you, stated plainly:**

- The cart lives in one browser. Clearing site data, or opening the site on a
  different machine, loses it. There is no order state anywhere except Stripe.
- There is no inventory check. Two people can buy the same item.
- **A multi-item order is charged per item.** Payment Links are one product
  each, so there is no way to make one combined charge without a server. The
  cart says this out loud rather than pretending otherwise.
- Shipping and tax are not shown. Stripe calculates both at checkout.

Guards that are in place: quantity capped at `cart.maxQty` per line, stored
JSON is validated on read (corrupt or unknown product ids are dropped), and
`localStorage` failures fall back to memory so the page still works in private
mode.

### Why the cart travels in the URL

On `http(s)` every page shares one origin and `localStorage` just works. On
`file://` it depends on the browser: Chromium shares one origin across all local
files, but **Firefox gives each `file://` document its own storage**. A cart
added on `index.html` then appears empty on `cart.html`.

So every link between the two pages carries the cart in the URL fragment
(`cart.html#c=…`), and each page reads it on load before painting. The fragment
is never sent to a server, so nothing leaks on a hosted deployment. Verified by
clearing storage and loading the link: the cart still reconstructs.

**If you move to a real host, all of this becomes unnecessary** — set up
`checkoutEndpoint` and drop the fragment handoff once you serve over https.

### Getting one combined payment instead

Set `cart.checkoutEndpoint` in `config.js` to a deployed function. The cart
POSTs `{ items: [{ id, qty }] }` and expects `{ url }` back. A Cloudflare Worker
on the free tier is enough:

```js
export default {
  async fetch(req, env) {
    const { items } = await req.json();
    // Look up real prices server-side. Never trust prices from the browser.
    const line_items = items.map(({ id, qty }) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: CATALOGUE[id].name },
        unit_amount: CATALOGUE[id].priceInCents,
      },
      quantity: qty,
    }));

    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mode: 'payment',
        'line_items[0][price_data][currency]': 'usd',
        // ... or serialise line_items properly
      }),
    });

    const { url } = await session.json();
    return Response.json({ url });
  },
};
```

The secret key lives in the Worker's environment, never in a file the browser
loads. Look prices up from your own catalogue server-side — the prices in
`products.js` are a local file and are not authoritative.

## The economics, in short

Dropship margins are tighter than wholesale, so the model accounts for both
Stripe fees and the returns you eat:

```
net = price − (price × 2.9% + 0.30) − cost − ship − (6% × 9.30)
```

That last term is the returns drag: ~6% return rate on pet accessories, at
~$9.30 each (return shipping plus the fee Stripe keeps). At the current sample
prices this leaves $17-35 per order, 34-46%.

The floor is real: below ~$40 average order value the same drag drops you under
20%, and one bad month flips you negative. That is why `margin.mjs` fails any
product under $40, even if its raw percentage looks fine.

## Deploy

Cloudflare Pages, free tier. Build command: none. Output directory: the folder
root. It is all static files already.

All images are hotlinked from Unsplash, so the page needs a network connection
and renders nothing without it. Self-host the photography before going live.

## Layout

Direction comes from NextMerce's `nextjs-ecommerce-template` — the structure is
copied, the tokens are lifted from its `tailwind.config.ts`.

1. Announcement bar
2. Sticky two-row header — logo, category pill, search, account, cart; then a
   secondary nav strip
3. Hero — one large photo panel with a scrim, plus two stacked side cards
4. Trust strip — four items
5. Product grid — 2-up on phones, 3-up from 56rem, 4-up from 72rem, square tiles
6. Browse by category — circular photos in a horizontal snap-scroller that
   filter the grid
7. Image + text split
8. Why shop with us
9. Footer — brand, three link columns, base bar

Category filtering exists twice on purpose: chips in the grid section for
browsing, and the category tiles further down. Both write the same state. Search
filters across name, category and description. Nav links pointing at a section
that ended up empty are pruned after the product pass.

## On mobile

Open `mobile-preview.html` to see this laid out in a 390×844 frame with the
reasoning beside it. Its screens are the real pages in iframes rather than
redrawn mockups, so it cannot drift from what ships.

The desktop design was kept and a phone layout added on top of it, because the
two have different jobs rather than the phone being a smaller desktop.

- **The header scrolls away.** Three rows of pinned chrome is a quarter of a
  phone viewport for the entire scroll. The cart bar covers the persistent-cart
  need instead.
- **A bottom cart bar.** Count, running total and a route to the cart, in thumb
  reach. Hidden entirely while the cart is empty, and the footer reserves room
  only when it is showing, so there is no dead gap.
- **Chips scroll horizontally** with `scroll-snap-type`. Nine chips wrapped to
  four lines and pushed the products below two screens.
- **Price and Add to Cart stack** below 30rem, where a two-up card is narrower
  than the two side by side. Keeps the tap target identical across the grid.
- **Search takes its own row** under the logo; sharing one row with the logo
  and cart squeezed it to a stub.
- **Trust strip and footer columns go single-column**, because at two-up every
  heading wrapped onto two or three lines.
- `viewport-fit=cover` with `env(safe-area-inset-*)` on the announce bar, the
  header and the cart bar, so content clears the notch and home indicator.
- **Every `:hover` rule is inside `@media (hover: hover) and (pointer: fine)`.**
  Touch fakes hover on first tap and leaves it there, so an ungated `:hover`
  reads as a control stuck down. `:active` is deliberately *not* gated — it
  fires while the finger is down, which is the behaviour a native button has.
- `-webkit-tap-highlight-color: transparent` on the root, so the browser's grey
  flash does not fight the press feedback.
- Inputs are 16px, so iOS Safari does not zoom the page on focus and strand the
  layout. Zoom is never disabled.

## The logo

`brand/logo-symbol.svg` — a constructed paw: three capsule toes of equal stroke
weight with the outer pair shorter and lower, over a pad that is wider across
the top and tapers to a rounded point. It is inline in the header with
`fill="currentColor"`, so the same file serves the indigo tile, white on indigo
and print black.

`brand/` also holds the exported variants (black, white, mono, square, favicon,
app icon), a PNG icon set, `favicon.ico` and `site.webmanifest`, all referenced
from the `<head>` of both pages.

Concepts that were rejected, for the record: a keyring tag (read as a pill or a
battery) and a monogram P (its circular bowl is exactly what every geometric
sans already does, so it was not an ownable detail).

## Supplier criteria

Since you source the products yourself, screen for:

- US-based, ships in 2-5 days with tracking. Direct-from-China is 2-4 weeks
  with no tracking, which makes the 30-day return promise fiction.
- No minimum order quantity.
- Willing to dropship, or open to consignment.
- US return address you can send to.
- Hardware and accessories only. Avoid ingestibles, supplements, food, cosmetics,
  and anything making a health claim — that is FDA and FTC territory.

`node margin.mjs` also assumes a US domestic supplier. Direct-from-China shipping
is several times the $8-14 figures in the data and will fail the floor.
