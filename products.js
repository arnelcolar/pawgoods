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
        id: "feeder",
        category: "Feeding",
        name: "Auto Feeder",
        price: 69.99,
        cost: 28,
        ship: 12,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Holds two days of food and dispenses on a schedule you set. Portion slots stop the 2am double-feeding, and the sealed hopper keeps ants and humidity out. Runs on batteries, so a power cut does not skip dinner.",
        stripeLink: "",
        compareAt: 83.99
    },
    {
        id: "puzzle-feeder",
        category: "Feeding",
        name: "Puzzle Feeder",
        price: 44.99,
        cost: 15,
        ship: 8,
        image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Turns a bowl of kibble into a 15-minute job. Four difficulty covers let you raise the bar as a dog gets better at it. Backs onto a non-slip base, so it does not get shoved across the kitchen floor mid-meal.",
        stripeLink: "",
        compareAt: 53.99
    },
    {
        id: "elevated-feeder",
        category: "Feeding",
        name: "Elevated Feeder",
        price: 64.99,
        cost: 27,
        ship: 13,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Raises the bowl to chest height, which helps with neck posture and keeps food off the floor. The frame is powder-coated steel, so it does not rack when a 70lb dog leans on it.",
        stripeLink: "",
        compareAt: 77.99
    },
    {
        id: "fountain",
        category: "Water",
        name: "Stainless Steel Fountain",
        price: 44.99,
        cost: 16,
        ship: 9,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A 3L stainless fountain that filters as it pours. Quiet pump, no cable to trip over, and a wide catch tray that dogs can drink from without knocking it over. Dishwasher-safe parts, so cleaning takes about a minute.",
        stripeLink: "",
        compareAt: 53.99
    },
    {
        id: "travel-bowl",
        category: "Water",
        name: "Travel Water Bowl",
        price: 42.99,
        cost: 13,
        ship: 8,
        image: "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Collapses flat into nothing, then springs back to shape. Holds 500ml, which is about right for a walk or a car ride. Clip it to the lead and it is not in your pocket.",
        stripeLink: "",
        compareAt: 51.99
    },
    {
        id: "filter-pitcher",
        category: "Water",
        name: "Filter Pitcher",
        price: 48.99,
        cost: 18,
        ship: 10,
        image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Fills a 1.5L reservoir with carbon-filtered water on a schedule you set. Removes the daily jug-chugging ritual. Clear tank, so you can see the level without lifting the lid.",
        stripeLink: "",
        compareAt: 58.99
    },
    {
        id: "vacuum",
        category: "Grooming",
        name: "Grooming Vacuum",
        price: 54.99,
        cost: 21,
        ship: 10,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Vanes loose hair while it vacuums, so one pass does what a brush and a lint roller do separately. Low suction, meant for everyday coats rather than heavy double shedding. Comes with a quiet setting for animals who startle at noise.",
        stripeLink: "",
        compareAt: 65.99
    },
    {
        id: "deshedding-brush",
        category: "Grooming",
        name: "Deshedding Brush",
        price: 42.99,
        cost: 14,
        ship: 8,
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A metal pin brush that pulls the loose undercoat instead of pushing it around. Retractable pins, so you can work a sensitive belly without poking. Self-cleaning button clears the hair in one press.",
        stripeLink: "",
        compareAt: 51.99
    },
    {
        id: "nail-grinder",
        category: "Grooming",
        name: "Nail Grinder",
        price: 46.99,
        cost: 17,
        ship: 9,
        image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A quiet grinder with a dust port, so clippings go in the bin rather than across the floor. Three speed settings for nails that have never been touched. Includes a light, because nobody wants to find a black nail in a dark room.",
        stripeLink: "",
        compareAt: 56.99
    },
    {
        id: "dispenser",
        category: "Training",
        name: "Treat Dispenser",
        price: 42.99,
        cost: 15,
        ship: 8,
        image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "One-handed training aid that turns treats into a click instead of a grab. Pockets the spare treats where sticky fingers cannot reach them, which is the whole point during a recall drill. Fits treats up to the size of a pea.",
        stripeLink: "",
        compareAt: 51.99
    },
    {
        id: "clicker-set",
        category: "Training",
        name: "Clicker and Lure Set",
        price: 44.99,
        cost: 15,
        ship: 8,
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A quiet mechanical clicker and a food lure stick, the two tools that do most of the early work. The clicker has no battery, so it cannot die mid-session. Carry pouch included.",
        stripeLink: "",
        compareAt: 53.99
    },
    {
        id: "long-line",
        category: "Training",
        name: "Long Line Leash",
        price: 46.99,
        cost: 16,
        ship: 9,
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Twenty feet of soft rope with a padded handle, for recall work in a field without giving up control. Swivels at both ends so it does not twist into a knot. Floats, so it will not drag in water.",
        stripeLink: "",
        compareAt: 56.99
    },
    {
        id: "harness",
        category: "Walking",
        name: "Padded Harness",
        price: 58.99,
        cost: 22,
        ship: 11,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Chest and neck straps that adjust on both sides, so it fits a range of builds without guesswork. Reflective trim for night walks. The buckle is a single-action clip, which matters when a dog is pulling.",
        stripeLink: "",
        compareAt: 70.99
    },
    {
        id: "bungee-leash",
        category: "Walking",
        name: "Bungee Leash",
        price: 49.99,
        cost: 18,
        ship: 10,
        image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Absorbs the pull so walking feels like walking rather than a tug-of-war. Spring section is steel-sheathed, so it does not stretch sideways over time. Hands-free loop folds flat for the car.",
        stripeLink: "",
        compareAt: 59.99
    },
    {
        id: "reflective-collar",
        category: "Walking",
        name: "Reflective Collar",
        price: 42.99,
        cost: 14,
        ship: 8,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Reflective all the way round, not just one strip, so a dog reads as visible from the side too. Fits a range of neck sizes with a four-position adjustment. Soft lining so it will not rub a short coat raw.",
        stripeLink: "",
        compareAt: 51.99
    },
    {
        id: "rope-tug",
        category: "Toys",
        name: "Rope Tug",
        price: 42.99,
        cost: 14,
        ship: 8,
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Cotton rope with knots at each end for a grip that does not slip. Washed at 30 degrees, so it survives being dragged through mud and then the washing machine. Not indestructible, and we would not pretend otherwise.",
        stripeLink: "",
        compareAt: 51.99
    },
    {
        id: "ball-thrower",
        category: "Toys",
        name: "Ball Thrower",
        price: 44.99,
        cost: 16,
        ship: 9,
        image: "https://images.unsplash.com/photo-1444212477490-ca407925329e?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Throws further than your arm and takes the strain out of the throw. Adjustable tension, so a puppy and an adult can both launch it properly. Hard rubber, which is kinder to teeth than tennis felt.",
        stripeLink: "",
        compareAt: 53.99
    },
    {
        id: "treat-ball",
        category: "Toys",
        name: "Puzzle Treat Ball",
        price: 46.99,
        cost: 17,
        ship: 9,
        image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A treat-dispensing ball with three openings at different difficulties. Keeps a dog busy for twenty minutes, which is a long time on a wet afternoon. Floats, so it works in the water too.",
        stripeLink: "",
        compareAt: 56.99
    },
    {
        id: "bolster-bed",
        category: "Sleep",
        name: "Bolster Bed",
        price: 79.99,
        cost: 34,
        ship: 14,
        image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A bolster your dog can actually lean against, with a cover that unzips and goes in the wash. Foam holds its shape after the dog gets up, so it does not flatten into a puddle by week three.",
        stripeLink: "",
        compareAt: 95.99
    },
    {
        id: "washable-mat",
        category: "Sleep",
        name: "Washable Mat",
        price: 54.99,
        cost: 22,
        ship: 11,
        image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A padded mat for crate floors, so the metal grate stops being the thing they refuse to lie on. Non-slip backing grips the crate without needing tape. Machine washable.",
        stripeLink: "",
        compareAt: 65.99
    },
    {
        id: "seat-cover",
        category: "Travel",
        name: "Car Seat Cover",
        price: 52.99,
        cost: 20,
        ship: 11,
        image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A quilted cover with a non-slip backing and headrest straps, so it stays put under hard braking. Wipe-clean surface. Two seats or one, depending on the size you pick.",
        stripeLink: "",
        compareAt: 63.99
    },
    {
        id: "backpack-carrier",
        category: "Travel",
        name: "Backpack Carrier",
        price: 89.99,
        cost: 38,
        ship: 14,
        image: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "Ventilated mesh panels on all sides, so a dog stays cool and visible rather than shut in a fabric bag. The base is a rigid shelf, not a hanging sling, so it does not swing under its own weight.",
        stripeLink: "",
        compareAt: 107.99
    },
    {
        id: "slow-feeder",
        category: "Feeding",
        name: "Slow Feeder Bowl",
        price: 42.99,
        cost: 14,
        ship: 8,
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=700&h=933&fit=crop&q=70&fm=jpg",
        description: "A maze pattern that turns a two-minute gulp into ten. Wide, heavy base stops it sliding when a dog shoulders it. BPA-free and dishwasher safe.",
        stripeLink: "",
        compareAt: 51.99
    }
];
