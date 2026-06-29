// One place to change business details. Everything on the site reads from here.
export const site = {
  name: "Ramey's Welding Services LLC",
  shortName: "Ramey's Welding",
  domain: "rameywelding.com",
  url: "https://rameywelding.com",

  phone: "662-213-7301",
  phoneHref: "tel:+16622137301",
  email: "business@rameywelding.com",
  emailHref: "mailto:business@rameywelding.com",

  cityState: "Fulton, MS",
  hours: "Mon–Fri, hours vary · Weekends available on request",

  // Trust signals
  credentials: "Licensed & insured",
  licenseDetail: "Structural and pipe certified",

  // Service-area towns (used in copy + LocalBusiness schema)
  areas: [
    "Fulton", "Tupelo", "Amory", "Nettleton", "Smithville", "Mantachie",
    "Belden", "Saltillo", "Pontotoc", "Booneville", "Oxford", "Columbus",
    "Starkville", "West Point",
  ],

  // Used for <meta> defaults
  description:
    "Welding, custom fabrication, and dirt work in Fulton, MS and across Northeast Mississippi. MIG, TIG & stick welding, plasma cutting, mobile welding, excavation, core drilling, and trenching. Licensed and insured. Call for a quote.",

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
  ],
};

export type Site = typeof site;
