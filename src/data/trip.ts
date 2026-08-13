export type PlaceKind =
  | "food"
  | "sauna"
  | "bar"
  | "stay"
  | "nature"
  | "transport";

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  address?: string;
  lat: number;
  lng: number;
  url?: string;
  /** Ordered — the first one is the cover */
  images?: string[];
  blurb?: string;
};

export type EventItem = {
  id: string;
  /** 24h "HH.MM" as written in programmet */
  start?: string;
  end?: string;
  title: string;
  place?: string;
  kind: PlaceKind | "rest";
  /** Kort beskrivelse — vises altid */
  lead?: string;
  /** Detaljer — foldes ud */
  notes?: string[];
  /** Gåtur fra et andet sted, som skrevet i programmet */
  walk?: { from: string; minutes: number };
  /** Hvem har ansvaret */
  owner?: { who: string; task: string; done: boolean };
  /** Fremhævet i "dagens ankre" */
  anchor?: boolean;
  /** Egne billeder, når stedets egne ikke rammer begivenheden */
  images?: string[];
  /** Håndskrevet note i marginen ved billedet */
  scribble?: string;
  /** Vises som boardingkort i stedet for en almindelig række */
  flight?: Flight;
};

export type Flight = {
  fromCode: string;
  fromCity: string;
  depart: string;
  toCode: string;
  toCity: string;
  arrive: string;
  /** Stod ikke i programmet — regnet ud fra flyvetiden */
  arriveEstimated?: boolean;
  duration: string;
};

export type Day = {
  id: string;
  /** ISO-dato, lokal Helsinki-tid */
  date: string;
  weekday: string;
  short: string;
  title: string;
  subtitle: string;
  hero: string;
  events: EventItem[];
};

export const PLACES: Record<string, Place> = {
  cph: {
    id: "cph",
    name: "Københavns Lufthavn",
    kind: "transport",
    address: "Lufthavnsboulevarden 6, 2770 Kastrup",
    lat: 55.6291,
    lng: 12.6478,
  },
  hel: {
    id: "hel",
    name: "Helsinki-Vantaa (HEL)",
    kind: "transport",
    address: "Terminal 2, 01530 Vantaa",
    lat: 60.3172,
    lng: 24.9633,
  },
  onigiri: {
    id: "onigiri",
    name: "Onigiri Musubi",
    kind: "food",
    address: "Pursimiehenkatu 2 C, 00150 Helsinki",
    lat: 60.160529,
    lng: 24.941343,
    url: "https://www.onigirimusubi.fi/",
    images: ["/places/onigiri.jpg"],
    blurb:
      "Bittelille japansk risbolle-bar i Punavuori. Åbner 10, og det plejer at være udsolgt ved 14-tiden — så vi skal ikke komme for sent.",
  },
  loyly: {
    id: "loyly",
    name: "Löyly",
    kind: "sauna",
    address: "Hernesaarenranta 4, 00150 Helsinki",
    lat: 60.152177,
    lng: 24.930444,
    url: "https://www.loylyhelsinki.fi/",
    images: [
      "/places/loyly.jpg",
      "/places/loyly-2.jpg",
    ],
    blurb:
      "Arkitekttegnet trædække ud i Østersøen med både almindelig sauna og røgsauna, og en stige direkte i havet.",
  },
  forenom: {
    id: "forenom",
    name: "Forenom Serviced Apartments",
    kind: "stay",
    address: "Lastenkodinkuja 1, 00180 Helsinki",
    lat: 60.166251,
    lng: 24.925586,
    url: "https://www.forenom.com/",
    images: ["/places/forenom.jpg"],
    blurb: "Vores base i Kamppi, to gader fra Kampin metroasema.",
  },
  liberty: {
    id: "liberty",
    name: "Liberty or Death",
    kind: "bar",
    address: "Erottajankatu 5, 00130 Helsinki",
    lat: 60.164728,
    lng: 24.944213,
    url: "https://libertyordeath.fi/",
    images: ["/places/liberty.jpg"],
    blurb:
      "Mørk cocktailbar i Design District med månedligt skiftende kort. Åbner 16.",
  },
  nolita: {
    id: "nolita",
    name: "Bistro Nolita",
    kind: "food",
    address: "Kankurinkatu 6, 00150 Helsinki",
    lat: 60.159413,
    lng: 24.936676,
    url: "https://nolita.fi/en/",
    images: ["/places/nolita.jpg"],
    blurb:
      "Kvarterbistro i Punavuori. Råvarestyret sæsonmad, gode vine og eget surdejsbageri.",
  },
  ahven: {
    id: "ahven",
    name: "Punavuoren Ahven",
    kind: "bar",
    address: "Punavuorenkatu 12, 00150 Helsinki",
    lat: 60.160968,
    lng: 24.937722,
    blurb:
      "Lun kvarterbeværtning med stor øl-, cider- og whiskyreol. To minutters gang fra Nolita.",
  },
  levain: {
    id: "levain",
    name: "Levain Töölö",
    kind: "food",
    address: "Runeberginkatu 29, 00100 Helsinki",
    lat: 60.172742,
    lng: 24.923303,
    url: "https://www.levain.fi/",
    images: ["/places/levain.jpg"],
    blurb:
      "Bageri og eatery. Morgenmaden inden vi tager i nationalparken — vi skal være ude af døren 10.00.",
  },
  kuusijarvi: {
    id: "kuusijarvi",
    name: "Kuusijärvi",
    kind: "nature",
    address: "Kuusijärventie 3, 01260 Vantaa",
    lat: 60.312112,
    lng: 25.114841,
    url: "https://www.visitvantaa.fi/en/kuusijarvi/",
    images: [
      "/places/kuusijarvi.jpg",
      "/places/savusauna.jpg",
    ],
    blurb:
      "Skovsø i udkanten af Sipoonkorpi, med café, offentlig røgsauna og trapper direkte i vandet. Start og slut på vandringen.",
  },
  sipoonkorpi: {
    id: "sipoonkorpi",
    name: "Sipoonkorpi Nationalpark",
    kind: "nature",
    address: "Bisajärvi, Vantaa",
    lat: 60.306393,
    lng: 25.145651,
    images: [
      "/places/sipoonkorpi.jpg",
      "/places/sipoonkorpi-2.jpg",
    ],
    blurb:
      "Granskov, klippeknolde og småsøer en halv time uden for byen. Bisajärvi er vendepunktet.",
  },
  finnjavel: {
    id: "finnjavel",
    name: "Finnjävel Salonki",
    kind: "food",
    address: "Ainonkatu 3, 00100 Helsinki",
    lat: 60.171944,
    lng: 24.93147,
    url: "https://finnjavel.fi/",
    images: [
      "/places/finnjavel.png",
      "/places/finnjavel-2.jpg",
      "/places/finnjavel-3.jpg",
    ],
    blurb:
      "Turens dyreste og fineste måltid. Finsk køkken taget alvorligt — vi tager vinmenuen til.",
  },
  allas: {
    id: "allas",
    name: "Allas Sea Pool",
    kind: "sauna",
    address: "Katajanokanlaituri 2 a, 00160 Helsinki",
    lat: 60.167119,
    lng: 24.958063,
    url: "https://allasseapool.fi/",
    images: [
      "/places/allas.jpg",
      "/places/allas-3.jpg",
      "/places/allas-2.jpg",
    ],
    blurb:
      "Badeanstalt i havnen ved Kauppatori: opvarmet bassin, havvandsbassin og saunaer med udsigt til færgerne.",
  },
  bardot: {
    id: "bardot",
    name: "Bardot",
    kind: "food",
    address: "Kluuvikatu 1, 00100 Helsinki",
    lat: 60.168144,
    lng: 24.947721,
    url: "https://www.bardot.fi/bardot/english/",
    images: ["/places/bardot.jpg"],
    blurb:
      "Fransk bistro midt i byen fra Hans Välimäki. Mad, vin og cocktails — nævnt i Michelin-guiden.",
  },
  lazyfox: {
    id: "lazyfox",
    name: "Lazy Fox Kamppi",
    kind: "food",
    address: "Albertinkatu 36, 00180 Helsinki",
    lat: 60.164718,
    lng: 24.932478,
    url: "https://lazyfox.fi/",
    images: [
      "/places/lazyfox.jpg",
      "/places/lazyfox-2.jpg",
      "/places/lazyfox-3.jpg",
    ],
    blurb:
      "All-day breakfast lige om hjørnet fra lejligheden. Sidste måltid inden vi skal hjem.",
  },
};

export const DAYS: Day[] = [
  {
    id: "torsdag",
    date: "2026-08-20",
    weekday: "Torsdag",
    short: "Tor",
    title: "Ankomst, Löyly og Nolita",
    subtitle: "Fly, risboller, sauna ved havet og en lang aften i Punavuori.",
    hero: "/places/loyly.jpg",
    events: [
      {
        id: "t-moede",
        start: "07.30",
        title: "Mødetid i lufthavnen",
        place: "cph",
        kind: "transport",
        anchor: true,
        lead: "Vi mødes i CPH — vær der til tiden, der er ingen bagage at hente.",
        notes: [
          "1 stk. håndbagage + 1 personlig genstand, der skal kunne ligge under sædet.",
          "Ingen indtjekket bagage.",
        ],
      },
      {
        id: "t-afgang",
        start: "08.20",
        end: "11.20",
        title: "Afgang fra København",
        place: "cph",
        kind: "transport",
        anchor: true,
        lead: "Finsk tid er en time foran dansk, så de tre timer på uret er to timer i luften.",
        flight: {
          fromCode: "CPH",
          fromCity: "København",
          depart: "08.20",
          toCode: "HEL",
          toCity: "Helsinki",
          arrive: "11.20",
          duration: "2t 0m",
        },
      },
      {
        id: "t-taxa",
        title: "Taxa ind til byen",
        kind: "transport",
        lead: "Cirka 30 minutter fra lufthavnen til Punavuori.",
      },
      {
        id: "t-frokost",
        start: "13.00",
        title: "Frokost på Onigiri Musubi",
        place: "onigiri",
        kind: "food",
        anchor: true,
      },
      {
        id: "t-loyly",
        start: "14.00",
        end: "16.00",
        title: "Löyly sauna",
        place: "loyly",
        kind: "sauna",
        anchor: true,
        lead: "To timer i sauna og Østersøen. Vi opbevarer vores bagage her.",
        scribble: "første dyp",
        notes: ["Husk badebukser og håndklæde i håndbagagen — de skal bruges før vi tjekker ind."],
      },
      {
        id: "t-checkin",
        start: "16.00",
        title: "Indtjekning i lejlighederne",
        place: "forenom",
        kind: "stay",
        anchor: true,
        lead: "Vi har tre værelser: 2 + 2 + 1.",
        notes: [
          "Vi køber øl og snacks til nydelse på værelserne.",
          "Der er tid til en lur.",
          "W og Mic ser det nyeste fra W's YouTube.",
        ],
      },
      {
        id: "t-predrinks",
        title: "Predrinks på Liberty or Death",
        place: "liberty",
        kind: "bar",
        walk: { from: "forenom", minutes: 20 },
      },
      {
        id: "t-middag",
        start: "19.30",
        title: "Middag på Bistro Nolita",
        place: "nolita",
        kind: "food",
        anchor: true,
        walk: { from: "liberty", minutes: 12 },
      },
      {
        id: "t-bar",
        title: "Bar efter middagen: Punavuoren Ahven",
        place: "ahven",
        kind: "bar",
      },
      {
        id: "t-aften",
        title: "Resten af aftenen",
        kind: "bar",
        lead: "Herefter er programmet åbent.",
        owner: { who: "Hyben", task: "finder aftenens videre program", done: false },
      },
    ],
  },
  {
    id: "fredag",
    date: "2026-08-21",
    weekday: "Fredag",
    short: "Fre",
    title: "Nationalpark, røgsauna og Finnjävel",
    subtitle: "Turens længste dag: 7–9 km i skoven, røgsauna og aftenens store måltid.",
    hero: "/places/sipoonkorpi.jpg",
    events: [
      {
        id: "f-morgenmad",
        start: "08.30",
        end: "09.45",
        title: "Morgenmad på Levain",
        place: "levain",
        kind: "food",
        anchor: true,
        walk: { from: "forenom", minutes: 13 },
      },
      {
        id: "f-afgang",
        start: "10.00",
        title: "Afgang til Sipoonkorpi",
        place: "forenom",
        kind: "transport",
        anchor: true,
        lead: "Vi kører fra lejligheden præcis 10.00.",
        notes: ["Transport til og fra Kuusijärvi er sat til 400 kr. i budgettet."],
      },
      {
        id: "f-vandring",
        title: "Vandring i Sipoonkorpi Nationalpark",
        place: "sipoonkorpi",
        kind: "nature",
        anchor: true,
        lead: "7–9 km: Kuusijärvi → Bisajärvi → Kuusijärvi.",
        scribble: "her bliver vi trætte",
        notes: ["Vandresko og tøj I kan gå i. Der er ikke noget at købe undervejs."],
      },
      {
        id: "f-frokost",
        start: "13.15",
        end: "14.15",
        title: "Frokost ved Café Kuusijärvi",
        place: "kuusijarvi",
        kind: "food",
      },
      {
        id: "f-sauna",
        start: "14.30",
        end: "16.30",
        title: "Kuusijärvi røgsauna og søbad",
        place: "kuusijarvi",
        kind: "sauna",
        anchor: true,
        images: ["/places/savusauna.jpg", "/places/kuusijarvi.jpg"],
        lead: "Rigtig røgsauna — opvarmet i timevis og luftet ud, ingen skorsten.",
        owner: { who: "Werther", task: "har styr på sauna og hvad røgsauna indebærer", done: true },
      },
      {
        id: "f-hjem",
        start: "16.30",
        end: "17.35",
        title: "Hjemtur til lejligheden",
        place: "forenom",
        kind: "transport",
      },
      {
        id: "f-slap",
        title: "Snacks og øl i lejligheden",
        place: "forenom",
        kind: "rest",
        lead: "Vi slapper af og har det lækkert inden aftenen.",
      },
      {
        id: "f-middag",
        start: "19.30",
        title: "Middag på Finnjävel Salonki",
        place: "finnjavel",
        kind: "food",
        anchor: true,
        lead: "Med vinmenu. Budgettets største enkeltpost: 6.000 kr.",
        scribble: "nyd den nu",
        walk: { from: "forenom", minutes: 13 },
      },
      {
        id: "f-aften",
        title: "Resten af aftenen",
        kind: "bar",
        lead: "Karaoke står der i budgettet.",
        owner: { who: "Koks", task: "finder aftenens videre program", done: true },
      },
    ],
  },
  {
    id: "lordag",
    date: "2026-08-22",
    weekday: "Lørdag",
    short: "Lør",
    title: "Allas, Bardot og byliv",
    subtitle: "Havbad om morgenen, ingenting om eftermiddagen, fransk bistro om aftenen.",
    hero: "/places/allas.jpg",
    events: [
      {
        id: "l-allas",
        start: "09.30",
        title: "Morgenmad og Allas Sea Pool",
        place: "allas",
        kind: "sauna",
        anchor: true,
        lead: "Vi har godt af at få luft.",
        walk: { from: "forenom", minutes: 30 },
      },
      {
        id: "l-frokost",
        title: "Frokost og kaffe",
        kind: "food",
        lead: "Noget let på vejen hjem fra Allas.",
        owner: { who: "Kenned", task: "finder noget let på vejen hjem", done: false },
      },
      {
        id: "l-byliv",
        title: "Byliv",
        kind: "rest",
        lead: "Vi har god tid. Planen er at slentre rundt i byen, få kaffe og øl og nyde den.",
      },
      {
        id: "l-afslapning",
        title: "Afslapning i lejligheden",
        place: "forenom",
        kind: "rest",
        lead: "Vi køber snacks med hjem og nyder dem inden vi skal ud og spise.",
      },
      {
        id: "l-middag",
        start: "19.30",
        title: "Middag på Bardot",
        place: "bardot",
        kind: "food",
        anchor: true,
        walk: { from: "forenom", minutes: 20 },
      },
      {
        id: "l-aften",
        title: "Resten af aftenen",
        kind: "bar",
        lead: "Karaoke står der også i budgettet for i aften.",
        owner: { who: "Koks", task: "finder aftenens videre program", done: true },
      },
    ],
  },
  {
    id: "sondag",
    date: "2026-08-23",
    weekday: "Søndag",
    short: "Søn",
    title: "Morgenmad og hjemrejse",
    subtitle: "Én sidste morgenmad, et sidste bad, og så hjem.",
    hero: "/places/lazyfox.jpg",
    events: [
      {
        id: "s-udtjek",
        start: "10.00",
        title: "Udtjekning",
        place: "forenom",
        kind: "stay",
        anchor: true,
      },
      {
        id: "s-morgenmad",
        start: "10.15",
        title: "Morgenmad på Lazy Fox",
        place: "lazyfox",
        kind: "food",
        anchor: true,
        scribble: "sidste måltid",
        walk: { from: "forenom", minutes: 8 },
      },
      {
        id: "s-allas",
        title: "Allas Sea Pool eller gåtur i byen",
        place: "allas",
        kind: "sauna",
        lead: "Sidste chance for et bad, ellers bare en tur rundt i byen.",
        walk: { from: "lazyfox", minutes: 20 },
      },
      {
        id: "s-lufthavn",
        start: "14.00",
        title: "Afgang til lufthavnen",
        place: "hel",
        kind: "transport",
        anchor: true,
      },
      {
        id: "s-hjem",
        start: "15.35",
        title: "Afgang fra Helsinki",
        place: "hel",
        kind: "transport",
        anchor: true,
        flight: {
          fromCode: "HEL",
          fromCity: "Helsinki",
          depart: "15.35",
          toCode: "CPH",
          toCity: "København",
          arrive: "16.35",
          arriveEstimated: true,
          duration: "2t 0m",
        },
        notes: [
          "1 stk. håndbagage + 1 personlig genstand, der skal kunne ligge under sædet.",
          "Ingen indtjekket bagage.",
        ],
      },
    ],
  },
];

export type BudgetLine = { label: string; amount: number };
export type BudgetGroup = { label: string; lines: BudgetLine[] };

export const BUDGET: BudgetGroup[] = [
  {
    label: "Fast",
    lines: [
      { label: "Flybilletter", amount: 9078 },
      { label: "Bolig", amount: 4577.62 },
    ],
  },
  {
    label: "Torsdag",
    lines: [
      { label: "Onigiri Musubi (frokost)", amount: 640 },
      { label: "Löyly sauna", amount: 960 },
      { label: "Øl/snacks i lejligheden", amount: 240 },
      { label: "Drinks på Liberty or Death", amount: 400 },
      { label: "Nolita (middag + vin)", amount: 2150 },
      { label: "Drink efter middag", amount: 480 },
    ],
  },
  {
    label: "Fredag",
    lines: [
      { label: "Levain morgenmad", amount: 720 },
      { label: "Transport til/fra Kuusijärvi", amount: 400 },
      { label: "Frokost ved Kuusijärvi", amount: 480 },
      { label: "Kuusijärvi Smoke Sauna", amount: 640 },
      { label: "Øl/snacks i lejligheden", amount: 240 },
      { label: "Finnjävel Salonki + vinmenu", amount: 6000 },
      { label: "Karaoke + drinks", amount: 800 },
    ],
  },
  {
    label: "Lørdag",
    lines: [
      { label: "Swim & Breakfast (Allas)", amount: 1000 },
      { label: "Frokost", amount: 960 },
      { label: "Bistro Bardot (middag + vin)", amount: 2500 },
      { label: "Drinks/karaoke", amount: 800 },
    ],
  },
  {
    label: "Søndag",
    lines: [
      { label: "Morgenmad (Lazy Fox/Levain)", amount: 640 },
      { label: "Allas Sea Pool", amount: 560 },
      { label: "Let frokost", amount: 560 },
      { label: "Transport/diverse", amount: 300 },
    ],
  },
];

/** Gengivet som det står i dokumentet — også de to steder hvor regnestykket
 *  ikke går op. Se BUDGET_NOTE. */
export const FUNDING = [
  { label: "Oprindelig fælleskasse", amount: 35000, sub: false },
  { label: "Reserveret til W", amount: -3000, sub: false },
  { label: "Til rådighed fra fælleskassen", amount: 31000, sub: true },
  { label: "Egenbetaling (4 × 1.500 kr.)", amount: 6000, sub: false },
  { label: "Samlet rådighedsbeløb", amount: 37000, sub: true },
];

export const BUDGET_TOTAL = BUDGET.flatMap((g) => g.lines).reduce(
  (a, b) => a + b.amount,
  0,
);

/** Som anført i dokumentet */
export const STATED_AVAILABLE = 37000;
export const STATED_BUFFER = 2874.38;

export const BUDGET_NOTE =
  "To steder går regnestykket i dokumentet ikke op, begge gange med 1.000 kr.: 35.000 − 3.000 giver 32.000 og ikke 31.000, og 37.000 − 35.125,62 giver 1.874,38 i buffer og ikke 2.874,38. Værd at få rettet inden vi rejser.";

export const PER_MAND = [
  { label: "Fra kassen", amount: 7000 },
  { label: "Egenbetaling til Koks inden turen", amount: 1500 },
  { label: "I alt pr. mand", amount: 8500, sub: true },
];

export const PACKING = [
  { item: "Badebukser", why: "Löyly, Kuusijärvi og Allas — tre bade på fire dage" },
  { item: "Håndklæde", why: "Samme tre steder. Der er ikke altid udlejning" },
  { item: "Vandresko", why: "7–9 km i Sipoonkorpi fredag" },
  { item: "Tøj I kan vandre i", why: "Skoven, ikke byen" },
  { item: "Kun håndbagage", why: "1 kuffert i kabinen + 1 taske under sædet. Ingen indtjekning" },
];

export const CREW = [
  { who: "Hyben", task: "Torsdag aften efter Punavuoren Ahven", done: false },
  { who: "Werther", task: "Sauna og røgsauna ved Kuusijärvi", done: true },
  { who: "Koks", task: "Fredag aften og lørdag aften", done: true },
  { who: "Kenned", task: "Lørdag frokost på vejen hjem fra Allas", done: false },
];

/** The first event in the programme that visits each place. Used to show a
 *  place's photo, description and website once rather than on every repeat. */
export const FIRST_VISIT: Record<string, string> = (() => {
  const seen: Record<string, string> = {};
  for (const day of DAYS) {
    for (const e of day.events) {
      if (e.place && !(e.place in seen)) seen[e.place] = e.id;
    }
  }
  return seen;
})();

/** Who can be picked as the uploader of a photo. */
export const CREW_NAMES = ["Jacob", "Martin", "Kenneth", "Michael"];

/** Where an event sits in the trip, for labelling photos in the gallery. */
export const EVENT_LOOKUP: Record<
  string,
  { dayId: string; dayIndex: number; weekday: string; date: number; title: string }
> = (() => {
  const map: Record<
    string,
    { dayId: string; dayIndex: number; weekday: string; date: number; title: string }
  > = {};
  DAYS.forEach((day, dayIndex) => {
    for (const e of day.events) {
      map[e.id] = {
        dayId: day.id,
        dayIndex,
        weekday: day.weekday,
        date: Number(day.date.slice(8, 10)),
        title: e.title,
      };
    }
  });
  return map;
})();
