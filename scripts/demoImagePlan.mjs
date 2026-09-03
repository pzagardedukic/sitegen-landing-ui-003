/*
 * What every demo image has to show, and the crop it ends up in.
 *
 * The slots and their aspect ratios come from DEMO-SLIKE.md, which was measured on the
 * rendered page rather than read off the data — the crop is decided by the layout, not by
 * the picture.
 *
 * Prompts share a fixed description of the room so the set reads as one studio rather than
 * as forty-three unrelated stock photos. That shared part is STUDIO; keep it in every prompt.
 */

const STUDIO =
  "a bright contemporary Pilates studio: warm off-white walls with arched niches lit by " +
  "concealed warm LED strips, pale grey low-pile carpet, large windows with sheer curtains, " +
  "black and pale-grey reformer machines with light wood footbars, a few green plants. " +
  "Natural daylight, soft shadows, calm neutral palette, photorealistic editorial interior " +
  "photography, 50mm lens, no text, no logos, no watermarks";

const PERSON =
  "photorealistic editorial portrait, natural daylight, calm neutral expression, " +
  "shallow depth of field, plain soft background, no text, no watermarks";

/** target is the aspect ratio the slot is drawn at; width is the output width in px. */
export const PLAN = [
  /* --- galerija: mozaik, potrebuje pestrost ------------------------------- */
  { name: "galerija-01", slot: "gallery", target: 0.98, width: 1200, prompt: `Wide view down a row of reformer machines in ${STUDIO}` },
  { name: "galerija-02", slot: "gallery", target: 1.17, width: 1400, prompt: `Close detail of reformer springs and the sliding carriage in ${STUDIO}` },
  { name: "galerija-03", slot: "gallery", target: 1.43, width: 1600, prompt: `An arched niche with a warm light strip and a plant beside it in ${STUDIO}` },
  { name: "galerija-04", slot: "gallery", target: 0.98, width: 1200, prompt: `A single reformer seen from the foot end, window light behind it, in ${STUDIO}` },
  { name: "galerija-05", slot: "gallery", target: 1.17, width: 1400, prompt: `Hands gripping the padded shoulder blocks of a reformer, close crop, in ${STUDIO}` },
  { name: "galerija-06", slot: "gallery", target: 1.43, width: 1600, prompt: `A mat area with small props — rings, soft balls, resistance bands — neatly arranged in ${STUDIO}` },
  { name: "galerija-07", slot: "gallery", target: 0.98, width: 1200, prompt: `A woman lying on a reformer mid-exercise, feet on the footbar, seen from the side, in ${STUDIO}` },
  { name: "galerija-08", slot: "gallery", target: 1.17, width: 1400, prompt: `Detail of the wooden footbar and leather straps of a reformer, shallow focus, in ${STUDIO}` },
  { name: "galerija-09", slot: "gallery", target: 1.43, width: 1600, prompt: `A small group of four people on reformers during a class, seen from behind, in ${STUDIO}` },
  { name: "galerija-10", slot: "gallery", target: 0.98, width: 1200, prompt: `The reception corner with a wooden counter, folded towels and a plant in ${STUDIO}` },
  { name: "galerija-11", slot: "gallery", target: 1.17, width: 1400, prompt: `Grip socks and a rolled towel on the carpet beside a reformer wheel in ${STUDIO}` },
  { name: "galerija-12", slot: "gallery", target: 1.43, width: 1600, prompt: `Late afternoon light falling across the empty studio floor in ${STUDIO}` },

  /* --- programi: kartica 0.89 -------------------------------------------- */
  { name: "program-reformer-zacetni", slot: "portfolio", target: 0.89, width: 1200, prompt: `An instructor adjusting a beginner's foot position on a reformer, both calm and focused, in ${STUDIO}` },
  { name: "program-reformer-nadaljevalni", slot: "portfolio", target: 0.89, width: 1200, prompt: `A woman in a strong plank position on a reformer carriage, jumpboard visible, in ${STUDIO}` },
  { name: "program-matt", slot: "portfolio", target: 0.89, width: 1200, prompt: `A morning mat Pilates group on floor mats with small props, warm early light, in ${STUDIO}` },
  { name: "program-pisarnisko-telo", slot: "portfolio", target: 0.89, width: 1200, prompt: `A person doing a seated shoulder and neck opening exercise with a resistance band in ${STUDIO}` },
  { name: "program-rehabilitacija", slot: "portfolio", target: 0.89, width: 1200, prompt: `A one-to-one rehabilitation session, instructor supporting a client's knee on a reformer, in ${STUDIO}` },
  { name: "program-nosecniski", slot: "portfolio", target: 0.89, width: 1200, prompt: `A pregnant woman exercising gently on a reformer with an instructor beside her in ${STUDIO}` },

  /* --- storitve: izrazito pokoncno 0.67, spodnja polovica pod besedilom ---- */
  { name: "storitev-analiza", slot: "services", target: 0.67, width: 1100, prompt: `Vertical composition. An instructor observing a client's standing posture, clipboard in hand, upper half of frame busy and lower half calm floor, in ${STUDIO}` },
  { name: "storitev-skupinske", slot: "services", target: 0.67, width: 1100, prompt: `Vertical composition. A row of reformers with a small group mid-class, upper half of frame busy and lower half calm floor, in ${STUDIO}` },
  { name: "storitev-individualno", slot: "services", target: 0.67, width: 1100, prompt: `Vertical composition. A one-to-one session, instructor kneeling beside the reformer, upper half of frame busy and lower half calm floor, in ${STUDIO}` },
  { name: "storitev-podjetja", slot: "services", target: 0.67, width: 1100, prompt: `Vertical composition. Office workers in casual sportswear stretching together in ${STUDIO}` },

  /* --- ekipa: portreti 0.82 ---------------------------------------------- */
  { name: "ekipa-ana", slot: "team", target: 0.82, width: 1000, prompt: `A woman in her late thirties, dark hair tied back, in dark sportswear, standing in a Pilates studio, ${PERSON}` },
  { name: "ekipa-luka", slot: "team", target: 0.82, width: 1000, prompt: `A man in his thirties, short hair, athletic build, in dark sportswear, standing in a Pilates studio, ${PERSON}` },
  { name: "ekipa-maja", slot: "team", target: 0.82, width: 1000, prompt: `A woman in her forties, shoulder-length light brown hair, in soft grey sportswear, standing in a Pilates studio, ${PERSON}` },
  { name: "ekipa-nejc", slot: "team", target: 0.82, width: 1000, prompt: `A man in his late twenties, dark curly hair, in a plain t-shirt, standing in a Pilates studio, ${PERSON}` },

  /* --- mnenja: obrazi 1:1 ------------------------------------------------- */
  { name: "mnenje-01", slot: "reviews", target: 1.0, width: 600, prompt: `Head and shoulders of a woman in her thirties, warm smile, ${PERSON}` },
  { name: "mnenje-02", slot: "reviews", target: 1.0, width: 600, prompt: `Head and shoulders of a man in his forties, friendly expression, ${PERSON}` },
  { name: "mnenje-03", slot: "reviews", target: 1.0, width: 600, prompt: `Head and shoulders of a woman in her early thirties, relaxed expression, ${PERSON}` },
  { name: "mnenje-04", slot: "reviews", target: 1.0, width: 600, prompt: `Head and shoulders of a woman in her fifties, confident expression, ${PERSON}` },

  /* --- o nas: karusel ----------------------------------------------------- */
  { name: "onas-analiza", slot: "about", target: 1.51, width: 1600, prompt: `An instructor and a new member talking beside a reformer, notes in hand, in ${STUDIO}` },
  { name: "onas-oprema", slot: "about", target: 1.51, width: 1600, prompt: `A row of reformers with colour-coded springs, clean and ready before a class, in ${STUDIO}` },
  { name: "onas-skupina", slot: "about", target: 0.87, width: 1200, prompt: `A class of six on reformers, instructor walking between them, in ${STUDIO}` },

  /* --- blog: lezece 1.76 -------------------------------------------------- */
  { name: "blog-bolecina", slot: "blog", target: 1.76, width: 1400, prompt: `A person resting on a reformer after a session, hand on their abdomen, in ${STUDIO}` },
  { name: "blog-medenica", slot: "blog", target: 1.76, width: 1400, prompt: `Close side view of a person lying on a mat with knees bent, instructor's hand indicating pelvis alignment, in ${STUDIO}` },
  { name: "blog-vzmeti", slot: "blog", target: 1.76, width: 1400, prompt: `Close view of colour-coded reformer springs, a hand changing one of them, in ${STUDIO}` },
  { name: "blog-pogostost", slot: "blog", target: 1.76, width: 1400, prompt: `A wall calendar beside folded towels and grip socks on a wooden bench in ${STUDIO}` },
  { name: "blog-poporodni", slot: "blog", target: 1.76, width: 1400, prompt: `A woman on a mat doing a gentle postnatal exercise, soft light, in ${STUDIO}` },

  /* --- dogodki: lezece 1.73 ----------------------------------------------- */
  { name: "dogodek-dihanje", slot: "events", target: 1.73, width: 1400, prompt: `A small workshop group sitting cross-legged on mats, hands on ribs, breathing exercise, in ${STUDIO}` },
  { name: "dogodek-tekaci", slot: "events", target: 1.73, width: 1400, prompt: `Running shoes lined up on the carpet beside a reformer, people stretching behind, in ${STUDIO}` },
  { name: "dogodek-poporodni", slot: "events", target: 1.73, width: 1400, prompt: `A talk in progress, a small group seated on mats listening to a speaker, in ${STUDIO}` },
  { name: "dogodek-odprti-dan", slot: "events", target: 1.73, width: 1400, prompt: `Visitors being shown a reformer by an instructor during an open day in ${STUDIO}` },
  { name: "dogodek-ergonomija", slot: "events", target: 1.73, width: 1400, prompt: `A desk chair and laptop set up beside mats for an ergonomics talk in ${STUDIO}` },
];

/** Where each generated file is written back into website.json. */
export const BINDINGS = {
  gallery: (w, files) => files.forEach((f, i) => { if (w.gallery.items[i]) w.gallery.items[i].file = f; }),
  portfolio: (w, files) => files.forEach((f, i) => { if (w.portfolio.items[i]) w.portfolio.items[i].images[0].file = f; }),
  services: (w, files) => files.forEach((f, i) => { if (w.services.items[i]) w.services.items[i].image.file = f; }),
  team: (w, files) => files.forEach((f, i) => { if (w.team.items[i]) w.team.items[i].image.file = f; }),
  reviews: (w, files) => files.forEach((f, i) => { if (w.reviews.items[i]) w.reviews.items[i].image.file = f; }),
  about: (w, files) => files.forEach((f, i) => { if (w.about.items[i]) w.about.items[i].image.file = f; }),
  blog: (w, files) => files.forEach((f, i) => { if (w.blog.items[i]) w.blog.items[i].image.file = f; }),
  events: (w, files) => files.forEach((f, i) => { if (w.events.items[i]) w.events.items[i].image.file = f; }),
};
