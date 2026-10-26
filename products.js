// Single source of truth for products. Loaded by index.html as a classic
// <script> (works from file://, no server, no fetch, no build step) and
// required by margin.mjs for the economics check.
//
// cost and ship are PLACEHOLDERS — replace with real supplier quotes.
// A product with no stripeLink renders its buy button disabled.
//
// compareAt is DEMO-ONLY display dressing (struck price + Sale badge).
// The cart always charges price; margin.mjs ignores compareAt.
//
// image is an inline SVG placeholder, so the page renders offline with no
// network dependency. To use real photography, replace image with an https URL
// and the <img src> takes over with no other change.
//
// Written as a plain global assignment so the same file works in both a
// browser and Node without a bundler or a package.json.

globalThis.PAWGOODS_PRODUCTS = [
    {
        id: "slow-feeder",
        category: "Feeding",
        name: "Slow Feeder Bowl",
        price: 42.99,
        cost: 12,
        ship: 6,
        image: "assets/products/slowfeeder.webp",
        description: "A maze in the bottom, so a fast eater has to work for it. Turns a two-minute dinner into ten, and the rubber foot stops the bowl travelling across the floor.",
        stripeLink: "",
        compareAt: null
    },
    {
        id: "ceramic-bowl",
        category: "Feeding",
        name: "Stoneware Bowl",
        price: 44.99,
        cost: 13,
        ship: 6,
        image: "assets/products/ceramic-bowl.webp",
        description: "Heavy enough that a dog pushing into it does not move it. Dishwasher safe, no plastic taste, and a rolled rim that a wet muzzle slides off.",
        stripeLink: "",
        compareAt: null
    },
    {
        id: "slicker-brush",
        category: "Grooming",
        name: "Slicker Brush",
        price: 42.99,
        cost: 11,
        ship: 5.5,
        image: "assets/products/brush.webp",
        description: "Fine bent pins on a cushion that gives under pressure, so the coat lifts instead of the skin. The self-cleaning plate pushes the hair out in one sheet.",
        stripeLink: "",
        compareAt: 24.99
    },
    {
        id: "leather-collar",
        category: "Walking",
        name: "Leather Collar",
        price: 48.99,
        cost: 15,
        ship: 6,
        image: "assets/products/collar.webp",
        description: "Full-grain leather with a solid brass buckle and a keeper that stays put. Softens into the shape of the neck after a few weeks and does not fray like webbing.",
        stripeLink: "",
        compareAt: null
    },
    {
        id: "bolster-bed",
        category: "Sleep",
        name: "Bolster Bed",
        price: 79.99,
        cost: 26,
        ship: 14,
        image: "assets/products/bed.webp",
        description: "A raised rim to rest a chin on, with a base that lies flat. The cover unzips and goes in the machine, and the fill keeps its shape after a wash.",
        stripeLink: "",
        compareAt: 94.99
    },
    {
        id: "backpack-carrier",
        category: "Travel",
        name: "Backpack Carrier",
        price: 89.99,
        cost: 30,
        ship: 13,
        image: "assets/products/carrier.webp",
        description: "A framed pack that sits the dog upright and close to your back, with mesh panels on three sides and a short leash that clips inside.",
        stripeLink: "",
        compareAt: null
    }
];
