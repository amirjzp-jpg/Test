export type Product = {
  id: string;
  name: string;
  concentration: string;
  image: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
};

export const products: Product[] = [
  {
    id: "voile-i",
    name: "VOILE I",
    concentration: "Eau de Parfum",
    image: "/products/voile-i.jpg",
    notes: {
      top: "Bergamot, pink pepper",
      heart: "Dark amber, jasmine",
      base: "Cashmere musk, soft woods",
    },
  },
  {
    id: "voile-ii",
    name: "VOILE II",
    concentration: "Parfum Intense",
    image: "/products/voile-ii.jpg",
    notes: {
      top: "Black plum, cardamom",
      heart: "Oud, smoked vanilla",
      base: "Leather, dark amber",
    },
  },
  {
    id: "voile-absolute",
    name: "VOILE ABSOLUTE",
    concentration: "Extrait",
    image: "/products/voile-absolute.jpg",
    notes: {
      top: "Saffron, blood orange",
      heart: "Midnight rose, ambergris",
      base: "Leather, dark musk",
    },
  },
];

export const manifestoLines: string[] = [
  "Scent isn't seen. It's remembered.",
  "Some things reveal themselves slowly.",
  "Held in shadow, until it's time to wear it.",
  "Voile Noir is worn, not announced.",
];

export const ritualLine = "Warm the wrist. Let it settle. Wear the silence after.";

export const footerLine = "VOILE NOIR — crafted in shadow.";

export const tagline = "A veil of scent, worn like night.";
