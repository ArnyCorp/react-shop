import type { Product } from "./schemas";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p-01",
    name: "Linen Lounge Chair",
    description: "Low-slung silhouette with kiln-dried oak and stone-washed linen.",
    price: 640,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    category: "Seating",
  },
  {
    id: "p-02",
    name: "Ceramic Pour-Over Set",
    description: "Hand-thrown stoneware dripper with a satin glaze and matching carafe.",
    price: 86,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    category: "Kitchen",
  },
  {
    id: "p-03",
    name: "Wool Day Throw",
    description: "Undyed merino blanket with a loose basket weave and whipstitch edge.",
    price: 128,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
  },
  {
    id: "p-04",
    name: "Brass Desk Lamp",
    description: "Adjustable arm lamp with a warm opal shade and weighted base.",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    category: "Lighting",
  },
];

export const formatPrice = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

export const DEFAULT_API_URL = "http://localhost:3001";
