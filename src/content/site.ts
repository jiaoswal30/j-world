/**
 * ─────────────────────────────────────────────────────────────
 *  THE LISTENING ROOM — all words, links and images live here.
 *  Edit this file; the layout updates itself.
 *
 *  Markup inside strings:
 *    *italic*            → italic
 *    [TBC: note]         → visible placeholder. Search for "TBC" to find
 *                          everything that still needs real information.
 *  Images: set `src` to a file in /public (e.g. '/work/kaha-01.jpg').
 *  Leave `src` null to show the designed placeholder plate.
 * ─────────────────────────────────────────────────────────────
 */

export const palette = {
  ink: '#1C1512',
  paper: '#EFE7D6',
  oxblood: '#5E1A1F',
  celadon: '#A9BCA0',
  celadonDeep: '#4E6151',
  saffron: '#E0A43A',
  cobalt: '#2335C8',
  walnut: '#4A2E21',
};

/* ───────── Identity ───────── */

export const person = {
  name: 'Jia Oswal',
  city: 'Bengaluru',
  school: 'Mesa School of Business',
  // Leave empty to hide the button. Fill both before you submit.
  email: 'jiaoswal30@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jia-oswal-b69a9a2b2',
};

/* ───────── Prologue — the journey in ───────── */

export const journey = {
  heading: 'The portfolio of Jia Oswal · Vol. 01',
  word: "Jia's World",
  sub: "Things I've made, things I've questioned, and a few I haven't figured out yet.",
  captions: [
    'Somewhere on a small blue planet…',
    '…past the side of it where the cities stay lit,',
    '…down through the clouds,',
    'India. Karnataka. A little to the south.',
    'Bengaluru — and a record store that stays open late.',
  ],
};

export const exterior = {
  chalkboard: "Inside: things I've made, things I've questioned, and a few I haven't figured out yet.",
  chalkSign: '— J.',
  doorSign: ['Open', "come in, it's warm"],
};

export const room = {
  kicker: 'Now playing — Vol. 01',
  statement:
    "I'm Jia Oswal. I like the stretch between *I have an idea* and *here, try it.* This room is that stretch.",
  railCaption: 'Pick a record — or keep scrolling, it plays in order',
};

/* ───────── The records (also the tracklist) ───────── */

export type Art = 'person' | 'receipts' | 'work' | 'experiments' | 'last';

export type Track = {
  id: string; // section id
  code: string; // A1, A2…
  title: string;
  nav: string; // plain-language name for navigation
  art?: Art; // present = it's a record on the rail
  label: string; // vinyl label colour
  labelInk: string;
  ghost?: string; // translucent script word behind the section title
};

export const tracks: Track[] = [
  { id: 'about', ghost: 'person', code: 'A1', title: 'The Person', nav: 'About', art: 'person', label: palette.saffron, labelInk: palette.ink },
  { id: 'milestones', ghost: 'receipts', code: 'A2', title: 'The Receipts', nav: 'Milestones', art: 'receipts', label: palette.oxblood, labelInk: palette.paper },
  { id: 'work', ghost: 'built', code: 'B1', title: "Things I've Built", nav: 'Work', art: 'work', label: palette.cobalt, labelInk: palette.paper },
  { id: 'experiments', ghost: 'curious', code: 'B2', title: 'The Experiments', nav: 'Experiments', art: 'experiments', label: palette.celadon, labelInk: palette.ink },
  { id: 'gallery', ghost: 'edits', code: 'B3', title: 'The Crates', nav: 'Gallery', label: palette.paper, labelInk: palette.ink },
  { id: 'note', code: 'B4', title: "Things I'm Still Figuring Out", nav: 'Liner note', label: palette.paper, labelInk: palette.ink },
  { id: 'contact', code: 'B5', title: 'The Last Track', nav: 'Contact', art: 'last', label: palette.paper, labelInk: palette.oxblood },
];

/* ───────── A1 — The Person ───────── */

export const about = {
  kicker: 'Side A · Track 1',
  lede:
    "I'm an entrepreneurship student at Mesa School of Business in Bengaluru — which mostly means I've given myself permission to be curious about everything, and then held myself responsible for doing something about it.",
  body: [
    "Right now I'm living in the overlap of AI, design and technology. I like pulling things apart to see how they work — a brand, an app, a checkout flow, a campaign — and then building my own version to find out what I actually understood.",
    "I'm not going to pretend I've got it figured out. What I do have is a habit of starting, an eye for when something feels slightly off, and a growing respect for the unglamorous part: finishing, shipping, following through. I'm deliberately getting better at that last bit.",
  ],
  filedUnder: [
    'Entrepreneurship',
    'Artificial intelligence',
    'Creative technology',
    'Digital experiences',
    'Brand strategy',
    'Fashion & visual culture',
    'Design',
    'Ad campaigns',
    'Trading',
    'Things people actually use',
  ],
  filedNote: '← the last one matters most',
  portrait: { src: '/me/portrait-reading.jpg' as string | null, alt: 'Portrait of Jia Oswal' },
};

/* ───────── A2 — The Receipts ───────── */

export const receipts = {
  kicker: 'Side A · Track 2',
  intro: 'Evidence before adjectives. This track plays second on purpose.',
  receipt: {
    store: 'PONGS',
    role: 'Sales intern',
    period: 'May – Jul 2025',
    lines: [
      { label: 'Cold calls / day', value: '~50' },
      { label: 'Architect meetings', value: '15+' },
      { label: 'Converted', value: '10+' },
    ],
    context:
      'Cold calls turned into confirmed meetings; I then pitched the product range to architects in person, and more than ten of those meetings converted.',
  },
  numerals: [
    { value: '~50', label: 'cold calls a day', note: 'every day, not once' },
    { value: '15+', label: 'architect meetings', note: 'pitched in person' },
    { value: '10+', label: 'converted', note: 'people who said yes' },
  ],
  timeline: [
    { when: 'May – Dec 2024', what: 'Fits Spirit Kids', detail: 'Marketing & sub-coach intern' },
    { when: '2025 – 2029', what: 'Mesa School of Business', detail: 'BBA, Entrepreneurship · Bengaluru' },
    { when: 'May – Jul 2025', what: 'PONGS', detail: 'Sales intern · ~50 cold calls a day, 10+ conversions' },
    { when: 'Aug – Sep 2025', what: 'NeerRatna', detail: 'Founder · D2C natural-stone bracelets' },
    { when: 'Oct 2025', what: 'RapidFunds', detail: 'Founder · AI-assisted funding-approval SaaS' },
    { when: 'Nov 2025 – Jan 2026', what: 'Kaha', detail: 'Marketing intern · built kahadiamonds.com' },
    { when: 'Jan – Mar 2026', what: 'Hum Bawaal', detail: 'Founder & creative director · concept denim' },
    { when: 'Jun 2026', what: 'Jalsa', detail: 'An invitation app, designed and built with AI' },
  ],
  // Add verified awards here: { title: '', by: '', year: '' }. Empty = section hidden.
  awards: [] as { title: string; by: string; year: string }[],
};

/* ───────── B1 — Things I've Built ───────── */

/** Drawn-in-code artwork that can stand in for an image (moodboards, sketches). */
export type ArtKind = 'nazaar-board' | 'sketch-watcher' | 'sketch-storyboard';

export type Shot = { src: string | null; alt: string; ratio: string; caption: string; art?: ArtKind };

export type Project = {
  id: string;
  cat: string;
  name: string;
  tagline: string;
  cover: 'kaha' | 'humbawaal' | 'jalsa' | 'ai';
  role: string;
  year: string;
  tools: string[];
  link?: { label: string; href: string };
  opportunity: string;
  thinking: string[];
  executed: string[];
  outcomes: string;
  learned: string;
  images: Shot[];
};

const SCREEN = '40 / 21';

export const projects: Project[] = [
  {
    id: 'kaha',
    cat: 'TLR-B1-01',
    name: 'Kaha',
    tagline: "Some stories take a billion years. Yours doesn't have to wait.",
    cover: 'kaha',
    role: 'Marketing intern — brand, website & content',
    year: 'Nov 2025 – Jan 2026',
    tools: ['Web design & build', 'Short-form video', 'AI build tools'],
    link: { label: 'kahadiamonds.com', href: 'https://kahadiamonds.com' },
    opportunity:
      "Kaha makes lab-grown diamonds in Jayanagar, Bengaluru. Jewellery is one of the hardest things to sell through a screen — you can't feel the weight, the camera flattens the fire, and *lab-grown* still has to earn a trust a mined stone gets for free. The site had to do the job of a showroom, an explanation and an invitation, all at once.",
    thinking: [
      "Name the doubt out loud. *Grown, Not Mined* sits in the main navigation — not buried in an FAQ — because it's the first question in every buyer's head.",
      "Sell the visit, not the SKU. The call to action is *Begin your story*: an appointment that is 'not a sales visit' but an hour with a loupe, a cup of something warm, and a diamond that grew for you.",
      'Speak in stories. *Kahani* — Hindi for story — is a whole section. The brand talks like a person from Bengaluru, not a catalogue.',
      'Restraint reads as expensive. Deep aubergine, one high-contrast serif, wide letterspacing and slow reveals; the photography carries the sparkle.',
    ],
    executed: [
      'Designed and built kahadiamonds.com: The World of Kaha · Grown, Not Mined · Kahani · Visit',
      'An appointment-led conversion path: every page ends at *Begin your story*, with WhatsApp one tap away',
      'Short-form videos for Kaha\'s Instagram',
      'An internal ERP app for showroom staff: GPS check-in, leave management, and automatic blocking of clashing leave requests',
    ],
    outcomes: "Live at kahadiamonds.com. I'm not claiming commercial numbers I can't show.",
    learned: 'Kaha taught me that a brand is a story before it\'s a product — every page, video and headline had to earn the next one.',
    images: [
      { src: '/work/kaha-home.jpg', alt: 'Kaha website home: Some stories take a billion years', ratio: SCREEN, caption: 'Home — the opening line' },
      { src: '/work/kaha-campaign.jpg', alt: 'Kaha campaign photograph, model wearing lab-grown diamonds', ratio: '1028 / 1530', caption: 'Campaign — light is the product' },
      { src: '/work/kaha-craft.jpg', alt: 'Kaha craft page: See it become your story', ratio: SCREEN, caption: 'Craft — the appointment, not the sale' },
    ],
  },
  {
    id: 'humbawaal',
    cat: 'TLR-B1-02',
    name: 'Hum Bawaal',
    tagline: 'Concept denim. Room 01: NAZAAR — denim that stares back.',
    cover: 'humbawaal',
    role: 'Founder & creative director',
    year: 'Jan – Mar 2026',
    tools: ['Concept design', 'Supplier research', 'Web (built from scratch)'],
    link: { label: 'humbawaal.com', href: 'https://humbawaal.com' },
    opportunity:
      "Denim is the most crowded rack in fashion — everyone competes on fit, fade and price, so everyone sounds the same. *Bawaal* means a commotion, and Hum Bawaal doesn't sell collections: it opens *rooms*. Room 01 is NAZAAR. In India, *nazar* is the look that lands on you before you've said a word — the stare on the street, the aunty's verdict, the evil eye your grandmother tied a black thread against. Most fashion teaches you how to be looked at. NAZAAR flips it: the eye is stitched onto the denim, so the garment looks back.",
    thinking: [
      "Stare back. The evil eye isn't a warning here, it's armour — hand-embroidered onto pockets and seams so the wearer is watching too. *To be seen is to be felt.*",
      'Drops are rooms, not collections. You don\'t scroll Hum Bawaal; you walk into Room 01, and the site is built that way — Drop Room, Manifesto, Journal, Community, Insider.',
      "Scarcity with a reason, not hype: seven pieces, fifty units each. Every eye is stitched by hand, so it can't be infinite.",
      'Loud, made slowly. Raw hems, painted pockets, uneven thread — the rebellion is in the craft, not the volume. The line we built it on: *Designed to be seen. Built to stay.*',
    ],
    executed: [
      '20+ original denim design concepts merging Indian storytelling, embroidery and bold streetwear',
      'Room 01: NAZAAR — the concept, the manifesto and the drop structure (Drop 001 · 7 pieces · 50 units per piece)',
      'Textile-technique research and supplier conversations',
      'Campaign moodboard: hand-embroidered eyes, stitched portraits, painted back pockets',
      'Brand identity: the HUM बवाल patch — denim, frayed edges, embroidered roses',
      'humbawaal.com, built from scratch: Drop Room, Manifesto, Journal, Community and Insider',
    ],
    outcomes: 'We closed the brand before NAZAAR launched — so no sales numbers here, just the work and the thinking.',
    learned: 'My first business built from scratch taught me ownership: deciding what matters most this week, carrying every responsibility myself, and putting the work out in public.',
    images: [
      { src: '/work/humbawaal-patch.jpg', alt: 'Hum Bawaal patch: HUM बवाल on denim with embroidered roses', ratio: '1280 / 853', caption: 'Identity — the patch' },
      { src: '/work/humbawaal-home.jpg', alt: 'Hum Bawaal website: Room 01 NAZAAR', ratio: SCREEN, caption: 'Room 01 — NAZAAR' },
      { src: '/work/humbawaal-concept.jpg', alt: 'NAZAAR concept: designed to be seen, built to stay', ratio: SCREEN, caption: 'The concept, in our words' },
      { src: '/work/nazaar-moodboard.jpg', alt: 'NAZAAR campaign moodboard of embroidered eyes on denim', ratio: '1125 / 2000', caption: 'Original campaign moodboard' },
      { src: null, art: 'nazaar-board', alt: 'NAZAAR rebel-cut moodboard', ratio: '4 / 5', caption: 'Rebel cut — stare back' },
      { src: null, art: 'sketch-watcher', alt: 'Process sketch of the NAZAAR back pocket', ratio: '3 / 4', caption: 'Process sketch — pc. 03, the watcher' },
    ],
  },
  {
    id: 'jalsa',
    cat: 'TLR-B1-03',
    name: 'Jalsa',
    tagline: "An invitation press for the people you'd actually show up for.",
    cover: 'jalsa',
    role: 'Concept, design & build',
    year: 'Jun 2026',
    tools: ['Claude Code', 'Supabase (Postgres + RLS)', 'Edge Functions', 'GitHub Pages'],
    link: { label: 'jiaoswal30.github.io/Jalsa', href: 'https://jiaoswal30.github.io/Jalsa/' },
    opportunity:
      "Invitations today are either a WhatsApp forward nobody reads or a template that looks like everyone else's. Meanwhile Indian print has a century of better ideas — letterpress, Sivakasi matchbox labels, cinema hoardings, riso, telegrams. *Jalsa* (जलसा, a celebration) turns a one-line text into an invitation people actually want to open.",
    thinking: [
      "Brief — one line, the way you'd text it. No forms to fill before the fun starts.",
      'Proofs — six editions borrowed from Indian print: Letterpress, Sivakasi, Talkies, Riso, Telegram, Snapshot, each with its own inks.',
      'Studio — a one-off design, drawn by Claude, so no two invitations look the same.',
      'Send — a link that opens like an envelope. Register — replies arrive live, and shared costs settle over UPI.',
    ],
    executed: [
      'A mobile-first web app built with Claude Code: describe a plan in one line, get three designed invitations, share a link, track RSVPs',
      'Backend on Supabase (Postgres with row-level security) and an Edge Function that calls Claude to draw custom posters, rendered in a sandbox',
      'Secured the public AI endpoint: origin allow-list, per-IP rate limiting and input caps',
      'The brand and six invitation styles from Indian print; guests RSVP in one tap, no sign-up',
    ],
    outcomes: 'Live as a working demo. Best on a phone.',
    learned: 'Getting an AI to design posters that don\'t look alike taught me that the output is only as good as the direction — precise, specific, and opinionated.',
    images: [
      { src: '/work/jalsa-upcoming.jpg', alt: 'Jalsa app: upcoming occasions with a riso invitation', ratio: SCREEN, caption: 'Upcoming — your circle' },
      { src: '/work/jalsa-editions.jpg', alt: 'Jalsa: choosing an edition and ink for a new invitation', ratio: SCREEN, caption: 'Six editions from Indian print' },
    ],
  },
  {
    id: 'ai',
    cat: 'TLR-B1-04',
    name: 'AI & Digital Experiments',
    tagline: 'Learning to build by building.',
    cover: 'ai',
    role: 'Builder — design, frontend, backend, deployment',
    year: 'Ongoing',
    tools: ['Claude Code', 'Cursor', 'Lovable', 'Supabase', 'Vercel', 'Automations', 'HTML · CSS · Python (learning)'],
    opportunity:
      "AI made it easy to generate an app. It didn't make it easy to make a good one. Most AI-built products look and feel identical. I'm interested in the gap between *it works* and *it's worth using*.",
    thinking: [
      'Use AI for speed, keep judgement for yourself. The bottleneck has moved from writing code to knowing what to ask for — and noticing when the answer is generic.',
      'Learn the stack underneath. Frontend, backend, data, deploys — enough to know what is actually happening.',
      'Design is the differentiator now that building is cheap.',
    ],
    executed: [
      'Jalsa — an AI invitation app with a Supabase backend',
      'RapidFunds — an AI-assisted funding-approval SaaS MVP built with Lovable and Cursor: org onboarding, role-based access, approval hierarchies, email digests',
      'An internal ERP app for Kaha\'s showroom staff',
      'Automations to remove repetitive work',
    ],
    outcomes: 'Jalsa live as a demo, RapidFunds as a working MVP, and an internal tool built for a real showroom.',
    learned: 'Building with AI taught me the tools are fast, but taste and clear instructions are what make the result worth using.',
    images: [],
  },
];

/** The loose-singles bin. Add real things only. */
export const looseSingles: { name: string; note: string; href?: string; year: string }[] = [
  {
    name: 'RapidFunds',
    note: 'Founder. An AI-assisted SaaS for internal funding requests and approvals — MVP built with Lovable and Cursor.',
    year: 'Oct 2025',
  },
  {
    name: 'NeerRatna',
    note: 'Founder, with a 4-person team. D2C certified natural-stone bracelets, sold through stall activations and Instagram.',
    year: 'Aug – Sep 2025',
  },
];

/* ───────── B2 — The Experiments ───────── */

export type Experiment = {
  filed: string;
  question: string;
  note: string;
  status: 'rabbit hole' | 'sketching' | 'learning' | 'obsessed' | 'try it';
  live?: boolean;
};

export const experiments: Experiment[] = [
  {
    filed: 'Interactive websites',
    question: 'What happens if you let people touch the thing?',
    note: 'Grab the record. Throw it. Physics beats instructions.',
    status: 'try it',
    live: true,
  },
  {
    filed: 'The learning path',
    question: 'What does it take to build a site that lands on Awwwards?',
    note: 'Now: HTML, CSS and Python. Next: GSAP, Three.js and shaders — for web experiences worth staying on.',
    status: 'learning',
  },
  {
    filed: 'Ad campaigns',
    question: 'Why does one ad get remembered and another skipped in a second?',
    note: 'Studying hooks, formats and the first half-second before the thumb moves.',
    status: 'rabbit hole',
  },
  {
    filed: 'Trading',
    question: 'What can markets teach you about risk, patience and being wrong?',
    note: 'Learning to trade — mostly learning to sit with uncertainty.',
    status: 'learning',
  },
  {
    filed: 'Three.js · creative coding',
    question: 'Can a website feel like an object instead of a page?',
    note: 'Weight, light, friction — the stuff screens usually leave out.',
    status: 'rabbit hole',
  },
  {
    filed: 'AI applications',
    question: "What does an AI product look like when it isn't a chat box?",
    note: 'Most of them are the same text field wearing a different colour.',
    status: 'sketching',
  },
  {
    filed: 'Growth',
    question: 'How does a product become a habit instead of a download?',
    note: 'The second week matters more than the first day.',
    status: 'obsessed',
  },
  {
    filed: 'Motion design',
    question: 'When does animation explain something — and when is it just showing off?',
    note: 'Rule I try to keep: if it moves, it should mean something.',
    status: 'learning',
  },
  {
    filed: 'Brand strategy',
    question: 'Why do some brands get a community and others just get customers?',
    note: 'Suspicion: people join a point of view, not a product.',
    status: 'rabbit hole',
  },
  {
    filed: 'Typography',
    question: 'How much personality can a typeface carry before it stops being readable?',
    note: 'This site is partly me testing that.',
    status: 'learning',
  },
  {
    filed: 'Visual storytelling',
    question: 'Can you tell a whole brand story without a single paragraph?',
    note: 'Album covers have been doing it for seventy years.',
    status: 'sketching',
  },
];

/* ───────── B3 — The Crates (gallery) ───────── */

export type Plate = {
  src: string | null;
  art?: ArtKind; // drawn-in-code artwork instead of a photo
  alt: string;
  ratio: string; // real images keep their own proportions; this sizes the slot
  title: string;
  caption: string;
  tone: 'oxblood' | 'celadon' | 'cobalt' | 'saffron' | 'paper' | 'denim' | 'ice';
};

export const gallery: Plate[] = [
  { src: '/work/kaha-campaign.jpg', alt: 'Kaha campaign photograph', ratio: '1028 / 1530', title: 'Kaha', caption: 'campaign — light is the product', tone: 'ice' },
  { src: '/work/humbawaal-patch.jpg', alt: 'Hum Bawaal embroidered patch', ratio: '1280 / 853', title: 'Hum Bawaal', caption: 'identity — the patch', tone: 'denim' },
  { src: null, art: 'nazaar-board', alt: 'NAZAAR rebel-cut moodboard', ratio: '4 / 5', title: 'NAZAAR', caption: 'moodboard — stare back', tone: 'oxblood' },
  { src: '/work/kaha-home.jpg', alt: 'Kaha website home', ratio: SCREEN, title: 'Kaha — web', caption: 'website direction', tone: 'paper' },
  { src: null, art: 'sketch-watcher', alt: 'Sketch of the NAZAAR back pocket', ratio: '3 / 4', title: 'Sketches', caption: 'pc. 03 — the watcher', tone: 'celadon' },
  { src: '/work/jalsa-editions.jpg', alt: 'Jalsa invitation editions', ratio: SCREEN, title: 'Jalsa', caption: 'six editions from indian print', tone: 'cobalt' },
  { src: '/work/nazaar-moodboard.jpg', alt: 'Original NAZAAR campaign moodboard', ratio: '1125 / 2000', title: 'NAZAAR', caption: 'campaign — eyes on denim', tone: 'oxblood' },
  { src: '/work/humbawaal-concept.jpg', alt: 'Hum Bawaal NAZAAR concept page', ratio: SCREEN, title: 'Room 01', caption: 'designed to be seen', tone: 'paper' },
  { src: null, art: 'sketch-storyboard', alt: "Storyboard for Jia's World", ratio: '4 / 3', title: 'This room', caption: 'storyboard — earth to the store', tone: 'paper' },
  { src: '/work/jalsa-upcoming.jpg', alt: 'Jalsa upcoming occasions', ratio: SCREEN, title: 'Jalsa', caption: 'upcoming — your circle', tone: 'cobalt' },
];

/* ───────── B4 — The liner note (long-form) ───────── */

export const note = {
  title: "Things I'm still figuring out.",
  intro: 'Found tucked inside the sleeve. Five short thoughts, in no particular order of certainty.',
  parts: [
    {
      head: 'On building',
      body: "I like building things because it's the fastest way to find out I was wrong. An idea in my head is always perfect. The same idea on a screen immediately has a spacing problem, a button nobody understands, and a reason it maybe shouldn't exist. That isn't discouraging — it's information. Most of what I know, I learned from something I made that didn't work the first time.",
      margin: 'still true',
    },
    {
      head: 'On creativity and execution',
      body: "There's a version of creativity that is mostly taste: knowing what's good, being able to point at it. I respect it, but I don't think it's enough. An idea that never ships is a mood board. And there's a version of execution that's all checklists, which ships things nobody remembers. The interesting work is in the overlap — caring how something feels *and* caring whether it got done by Thursday.",
      pull: 'An idea that never ships is a mood board.',
    },
    {
      head: 'On AI',
      body: "I'm interested in AI less as a topic and more as a change in who gets to make things. Not long ago, building something like this room would have needed a team I didn't have. Now the bottleneck isn't the code — it's judgement: knowing what to ask for, noticing when the answer is generic, and having the nerve to throw it away and ask again. That's a skill. I'm trying to get good at it.",
    },
    {
      head: 'On design, beyond how it looks',
      body: "Design isn't the colour of the button. It's whether someone understands what to do, trusts you enough to do it, and wants to come back. That's why I think design and growth sit closer together than they look: a confusing onboarding screen is a design problem and a retention problem at the same time.",
    },
    {
      head: 'On getting better',
      body: "The honest list: consistency, finishing, and saying no to the fifth new idea while the first one is still half-built. I'm better at starting than ending. I'm working on it the only way I know — by picking things with deadlines, making them public, and letting the result show whether I followed through. This site is one of those.",
      margin: "this one's for me",
    },
  ],
  signoff: '— J.O., Bengaluru',
};

/* ───────── B5 — The Last Track ───────── */

export const lastTrack = {
  kicker: 'Side B · Track 5',
  statement: 'Growth is where taste has to answer to numbers. That is the room I want to work in.',
  body: [
    "I'm drawn to growth because it's the one place a creative idea doesn't get to hide. You can make something beautiful, and the funnel will tell you — politely — whether anyone cared.",
    'What I want to understand: how a product turns into a habit, how a brand turns an audience into a community, and how distribution quietly decides which good products win.',
    "Wispr Flow is an interesting place to learn that. Getting someone to talk to their computer instead of typing isn't a feature problem — it's a habit problem, a trust problem and a storytelling problem. I'd like to work on all three.",
  ],
  bring: ['Curiosity', 'Initiative', 'A bias for running the experiment instead of debating it', 'The habit of making the thing, so we argue about something real'],
  notBringing: 'The pretence that I already know everything. I would rather learn it on the job, with numbers attached.',
  credits: [
    { role: 'Concept, direction & words', who: 'Jia Oswal' },
    { role: 'Directed out loud', who: 'Dictated with Wispr Flow' },
    { role: 'Built with', who: 'React, GSAP & a lot of iterations' },
    { role: 'Recorded at', who: 'Bengaluru, 2026' },
    { role: 'Earth imagery', who: 'NASA Blue Marble & Black Marble (public domain)' },
    { role: 'India map', who: '@svg-maps/india, CC BY 4.0' },
  ],
};
