import h1 from "@/assets/hostel-1.jpg";
import h2 from "@/assets/hostel-2.jpg";
import h3 from "@/assets/hostel-3.jpg";
import h4 from "@/assets/hostel-4.jpg";
import h5 from "@/assets/hostel-5.jpg";

export type Availability = "available" | "few" | "full";
export type RoomType = "single" | "shared" | "self-contained";

export interface Review {
  id: string;
  author: string;
  program: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Hostel {
  id: string;
  name: string;
  tagline: string;
  area: string;
  distanceKm: number;
  pricePerSemester: number;
  deposit: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  availability: Availability;
  roomTypes: RoomType[];
  amenities: string[];
  photos: string[];
  description: string;
  owner: { name: string; responseRate: number };
  reviews: Review[];
}

export const HOSTELS: Hostel[] = [
  {
    id: "amamoma-court",
    name: "Amamoma Court",
    tagline: "Quiet study-focused hostel, 6 min walk to Science",
    area: "Amamoma",
    distanceKm: 0.6,
    pricePerSemester: 3200,
    deposit: 500,
    rating: 4.8,
    reviewsCount: 142,
    verified: true,
    availability: "few",
    roomTypes: ["single", "shared"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Study Area", "Backup Power"],
    photos: [h1, h2, h5, h3],
    description:
      "A calm, well-managed hostel popular with serious students. Backup power keeps Wi-Fi on through ECG outages, and the on-site study lounge stays open until midnight.",
    owner: { name: "Mr. Kweku Annan", responseRate: 96 },
    reviews: [
      { id: "r1", author: "Akua M.", program: "BSc Nursing, L300", rating: 5, comment: "Lights never went off during exams. Security at the gate is real.", date: "Mar 2025" },
      { id: "r2", author: "Yaw B.", program: "BA Economics, L200", rating: 4, comment: "Water is constant. Wi-Fi gets slow in the evenings but works.", date: "Feb 2025" },
    ],
  },
  {
    id: "kwaprow-heights",
    name: "Kwaprow Heights",
    tagline: "Self-contained studios with kitchenette",
    area: "Kwaprow",
    distanceKm: 1.2,
    pricePerSemester: 4800,
    deposit: 800,
    rating: 4.6,
    reviewsCount: 89,
    verified: true,
    availability: "available",
    roomTypes: ["self-contained"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "AC", "Backup Power"],
    photos: [h5, h4, h2, h1],
    description: "Modern self-contained units with private bathroom, kitchenette and AC. Best for L300+ students who want privacy.",
    owner: { name: "Adwoa Mensimah", responseRate: 99 },
    reviews: [
      { id: "r1", author: "Kojo A.", program: "MBChB, L400", rating: 5, comment: "Worth every cedi. The AC saved me during heat season.", date: "Apr 2025" },
    ],
  },
  {
    id: "apewosika-lodge",
    name: "Apewosika Lodge",
    tagline: "Most affordable shared rooms near Old Site",
    area: "Apewosika",
    distanceKm: 0.9,
    pricePerSemester: 1800,
    deposit: 300,
    rating: 4.2,
    reviewsCount: 213,
    verified: true,
    availability: "available",
    roomTypes: ["shared"],
    amenities: ["Wi-Fi", "Security", "Study Area"],
    photos: [h3, h1, h2],
    description: "Budget-friendly shared rooms (2 per room). Tight community, walking distance to Old Site lecture halls.",
    owner: { name: "Mama Esi", responseRate: 88 },
    reviews: [
      { id: "r1", author: "Fafa K.", program: "BSc Agric, L100", rating: 4, comment: "Affordable and my roommate is cool. Water sometimes stops.", date: "Jan 2025" },
    ],
  },
  {
    id: "valco-view",
    name: "Valco View Residence",
    tagline: "Resort-style hostel with pool & gym",
    area: "Science",
    distanceKm: 1.8,
    pricePerSemester: 6500,
    deposit: 1200,
    rating: 4.9,
    reviewsCount: 57,
    verified: true,
    availability: "full",
    roomTypes: ["single", "self-contained"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "AC", "Pool", "Gym", "Backup Power"],
    photos: [h4, h5, h2, h1],
    description: "Premium hostel with pool, gym and on-site cafe. Shuttle to campus every hour.",
    owner: { name: "Valco Properties Ltd.", responseRate: 100 },
    reviews: [
      { id: "r1", author: "Nana A.", program: "BSc Petroleum Eng, L300", rating: 5, comment: "Honestly feels like a hotel. The shuttle is reliable.", date: "Mar 2025" },
    ],
  },
  {
    id: "ola-court",
    name: "OLA Student Court",
    tagline: "Female-only hostel, walking distance to OLA",
    area: "OLA",
    distanceKm: 0.4,
    pricePerSemester: 2900,
    deposit: 400,
    rating: 4.5,
    reviewsCount: 168,
    verified: false,
    availability: "few",
    roomTypes: ["single", "shared"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Study Area"],
    photos: [h2, h1, h3],
    description: "Female-only hostel run by sisters from the OLA campus. Strict security and curfew at 11pm.",
    owner: { name: "Sister Akosua", responseRate: 92 },
    reviews: [],
  },
];

export const AMENITIES = ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "Study Area", "AC", "Backup Power", "Pool", "Gym"];

export function getHostel(id: string) {
  return HOSTELS.find((h) => h.id === id);
}

export function formatGHS(amount: number) {
  return `GHS ${amount.toLocaleString("en-GH")}`;
}

export const AVAILABILITY_META: Record<Availability, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-success/15 text-success" },
  few: { label: "Few rooms left", className: "bg-warning/20 text-warning-foreground" },
  full: { label: "Fully booked", className: "bg-destructive/15 text-destructive" },
};
