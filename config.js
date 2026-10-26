// Template configuration. This is the ONLY file you edit to make this store
// yours. Everything brand-specific lives here — nothing is hardcoded in
// index.html or styles.css.
//
// Load order matters: config.js must come before products.js.

globalThis.PAWGOODS_CONFIG = {
  // ------------------------------------------------------------- identity
  brand: 'Pawgoods',
  tagline: 'Pet accessories that survive the house.',
  // <title> and meta description. keep the brand name in both.
  title: 'Pawgoods — pet accessories that survive the house',
  description: 'A short list of pet accessories, picked for the part that matters: whether it is still working after a year with a dog in the house.',

  // Demo sale mode: every card shows the circular Sale badge + struck price.
  // compareAt in products.js is display-only; the cart charges price.
  demoSale: true,

  // ---------------------------------------------------------- announcement
  // Null = no banner bar, like the demo (no top strip).
  announce: 'Demo store — checkout is switched off and the prices are examples.',

  // ------------------------------------------------------------ navigation
  // Centered category nav like the demo (Shop All, Decor, Office...).
  // `pill` is ignored now — all items render as plain uppercase links.
  nav: [
    { label: 'Shop All', href: '#grid' },
    { label: 'Feeding', href: '#grid' },
    { label: 'Walking', href: '#grid' },
    { label: 'Toys', href: '#grid' },
    { label: 'Sleep', href: '#grid' },
  ],

  // Utility links right (demo: Story, Contact, Track Order, Help). Hidden
  // until the header template renders them; kept for the footer.
  subnav: [],

  // ------------------------------------------------------------ header icons
  // The account label is two lines in the reference: a small caps caption and a
  // row of links. Kept as data so it stays out of the markup.
  account: { caption: 'Account', links: ['Sign In', 'Register'] },

  // ------------------------------------------------------------------ hero
  hero: {
    kicker: 'Feeding · Walking · Grooming · Toys · Sleep · Travel',
    headline: 'Gear that survives',
    emphasis: 'your dog.',
    lead: 'Twenty-three chew-tested essentials that look good in your living room and hold up to real life with a dog.',
    cta: 'Shop the collection',
    ctaHref: '#grid',
  },

  // -------------------------------------------------------------- trust bar
  // The four-up strip under the hero. icon is a key into the icon set in
  // index.html; unknown keys fall back to a neutral dot.
  features: [
    { icon: 'truck', label: 'Free Shipping', note: 'For all orders over $50' },
    { icon: 'refresh', label: '1 & 1 Returns', note: 'Cancellation after 1 day' },
    { icon: 'shield', label: '100% Secure Payments', note: 'Guaranteed secure payments' },
    { icon: 'chat', label: '24/7 Support', note: 'Anytime & anywhere' },
  ],

  // -------------------------------------------------------------- sections
  sections: {
    products: {
      eyebrow: 'Featured products',
      heading: 'New Arrivals',
      // Label for the filter group, read by screen readers.
      filterLabel: 'Filter by category',
      // Right-hand button beside the heading.
      cta: 'View All',
    },
    categories: {
      eyebrow: 'Shop by category',
      heading: 'Browse by Category',
    },
    split: {
      eyebrow: 'New arrivals',
      dateline: 'The test',
      heading: 'Brand new, chew-proof picks',
      body: 'Stainless, not glass. Wide bases, not tipping points. Every item here is one we would buy for our own house and not think about again.',
      cta: 'Shop the collection',
      // Replaced by a photo from the first product if image is null.
      image: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=800&h=800&fit=crop&q=70&fm=jpg',
    },
    why: {
      eyebrow: 'Best products',
      heading: 'Why choose us',
      items: [
        { heading: 'Fast Delivery', body: 'Two to five days with real tracking. Nothing here arrives on a slow boat.' },
        { heading: 'Free Shipping', body: 'Free over $50, flat $8–$14 below. No surprises at checkout.' },
        { heading: 'Secure Checkout', body: 'Every order is covered. If it breaks in normal use, we replace it.' },
        { heading: 'Easy Returns', body: 'Thirty days, postage covered. No restocking fee, no argument.' },
      ],
    },
  },

  reviews: {
    eyebrow: 'Reviews',
    heading: 'Dogs approve',
    items: [
      { quote: 'The harness survived a mud season, a lake summer, and one very determined squirrel chase. Still looks new.', name: 'Maria Oliver' },
      { quote: 'Ordered Tuesday, walking Friday. The feeder has not tipped once, which my last three all did.', name: 'Mark Justin' },
      { quote: 'Bought the bed for an old dog who destroys everything. Six months in, no holes. I checked twice.', name: 'Jamie Stock' },
    ],
  },

  // ---------------------------------------------------------------- footer
  footer: {
    note: 'Demo store · photography via Unsplash',
    // Each column is a heading plus a list of strings.
    columns: [
      { heading: 'Customer Care', items: ['About Us', 'Contact Us', 'Return Policy'] },
      { heading: 'Shipping & Returns', items: ['Free over $50', 'Flat $8–$14 below', '2–5 business days'] },
      { heading: 'About this demo', items: ['__COUNT__ sample products', 'Cart works, checkout not connected', 'Prices are invented'] },
    ],
  },

  // ------------------------------------------------------------------ cart
  cart: {
    // Leave null for the no-server path: each cart line links to its own
    // Stripe Payment Link, so a multi-item order is charged per item.
    //
    // Set this to a deployed endpoint to get ONE combined Stripe Checkout
    // Session for the whole cart instead. The endpoint receives
    // { items: [{ id, qty }] } and must return { url }. It holds the Stripe
    // secret key server-side — never put a key in this file or any other file
    // served to the browser. See README for a Cloudflare Worker example.
    checkoutEndpoint: null,

    // Cap on quantity per line. Also enforced in cart.js.
    maxQty: 10,
  },

  // ---------------------------------------------------------------- images
  // Ratios are set in styles.css as --ratio-card and --ratio-cat, since those
  // are geometry rather than content.
};