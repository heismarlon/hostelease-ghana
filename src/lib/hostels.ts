import img7686 from "@/assets/uploads/IMG_7686.jpeg.asset.json";
import img7684 from "@/assets/uploads/IMG_7684.jpeg.asset.json";
import img7683 from "@/assets/uploads/IMG_7683.jpeg.asset.json";
import img7682 from "@/assets/uploads/IMG_7682.jpeg.asset.json";
import img7681 from "@/assets/uploads/IMG_7681.jpeg.asset.json";
import img7675 from "@/assets/uploads/IMG_7675.jpeg.asset.json";
import img7676 from "@/assets/uploads/IMG_7676.jpeg.asset.json";
import img7673 from "@/assets/uploads/IMG_7673.jpeg.asset.json";
import img7671 from "@/assets/uploads/IMG_7671.jpeg.asset.json";
import img7678 from "@/assets/uploads/IMG_7678.jpeg.asset.json";
import img7687 from "@/assets/uploads/IMG_7687.jpeg.asset.json";
import img7682b from "@/assets/uploads/IMG_7682b.jpeg.asset.json";
import img7672 from "@/assets/uploads/IMG_7672.jpeg.asset.json";
import img7679 from "@/assets/uploads/IMG_7679.jpeg.asset.json";

const exteriorNight2 = img7687.url; // illuminated balcony block at night
const roomTwinChecker = img7682b.url; // twin checker beds with AC + desk
const roomBunk = img7672.url; // bunk beds room
const roomMoody = img7679.url; // dark moody single with painting

const exterior1 = img7686.url; // beige balconies exterior
const exterior2 = img7684.url; // night atrium
const exterior3 = img7676.url; // orange block exterior
const roomTwin1 = img7683.url; // dorm twin beds with desks
const roomTwin2 = img7682.url; // checkered twin room with AC
const roomTwin3 = img7678.url; // grey concrete twin room
const roomSingle1 = img7681.url; // single dark bed posters
const roomSingle2 = img7675.url; // small single bed white
const roomSelf1 = img7673.url; // self-contained with TV + fridge
const roomSelf2 = img7671.url; // studio with sofa & TV

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
  waterLogged?: boolean;
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
    photos: [exterior1, roomTwin2, roomSingle2, exterior3],
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
    photos: [roomSelf1, roomSelf2, exterior3, exterior1],
    description: "Modern self-contained units with private bathroom, kitchenette, fridge, TV and AC. Best for L300+ students who want privacy.",
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
    photos: [roomSingle2, roomTwin2, exterior3],
    description: "Budget-friendly shared rooms (2 per room). Tight community, walking distance to Old Site lecture halls. Note: the surrounding street is a known water-logged area during heavy rains.",
    waterLogged: true,
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
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "AC", "Backup Power"],
    photos: [exterior2, roomSelf1, roomTwin3, exterior1],
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
    photos: [roomSingle2, roomTwin2, exterior1],
    description: "Female-only hostel run by sisters from the OLA campus. Strict security and curfew at 11pm.",
    owner: { name: "Sister Akosua", responseRate: 92 },
    reviews: [],
  },
  {
    id: "ayensu-residence",
    name: "Ayensu Residence",
    tagline: "Brand-new twin rooms with AC, perfect for roommates",
    area: "Science",
    distanceKm: 1.1,
    pricePerSemester: 3800,
    deposit: 600,
    rating: 4.7,
    reviewsCount: 64,
    verified: true,
    availability: "available",
    roomTypes: ["shared"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "AC", "Backup Power", "Study Area"],
    photos: [roomTwin3, exterior2, roomTwin2],
    description: "Newly built block with spacious twin rooms, built-in shelves, AC and a private balcony per unit. Great for pairs of friends rooming together.",
    owner: { name: "Mr. Selorm Dogbe", responseRate: 97 },
    reviews: [
      { id: "r1", author: "Esi P.", program: "BSc Biochem, L200", rating: 5, comment: "Room is brand new. AC works perfectly through the heat.", date: "May 2025" },
    ],
  },
  {
    id: "cape-coast-vista",
    name: "Cape Coast Vista",
    tagline: "Premium dorms with city views and study desks",
    area: "Kakumdo",
    distanceKm: 2.1,
    pricePerSemester: 5200,
    deposit: 900,
    rating: 4.8,
    reviewsCount: 41,
    verified: true,
    availability: "few",
    roomTypes: ["shared", "single"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "AC", "Kitchen", "Backup Power", "Study Area"],
    photos: [roomTwin1, exterior2, roomSelf2],
    description: "High-rise residence with panoramic Cape Coast views, in-room study desks, fast fibre Wi-Fi, and a 24-hour reception. Shuttle to UCC main gate every 30 minutes.",
    owner: { name: "Vista Living Ltd.", responseRate: 98 },
    reviews: [
      { id: "r1", author: "Kwabena O.", program: "BSc Computer Science, L300", rating: 5, comment: "The view and the Wi-Fi are unmatched. Best place to grind code.", date: "Apr 2025" },
    ],
  },
  {
    id: "abura-budget-hall",
    name: "Abura Budget Hall",
    tagline: "Simple single rooms under GHS 2k",
    area: "Abura",
    distanceKm: 2.4,
    pricePerSemester: 1500,
    deposit: 250,
    rating: 4.0,
    reviewsCount: 95,
    verified: false,
    availability: "available",
    roomTypes: ["single"],
    amenities: ["Wi-Fi", "Security"],
    photos: [roomSingle2, exterior3],
    description: "No-frills single rooms for students on a strict budget. Communal kitchen and shared bathrooms. Trotro to campus is GHS 3. Note: located in a water-logged area — expect puddles after heavy rains.",
    waterLogged: true,
    owner: { name: "Mr. Atta Mensah", responseRate: 78 },
    reviews: [
      { id: "r1", author: "Joojo T.", program: "BA Sociology, L100", rating: 4, comment: "Cheapest I could find. Honest landlord, basic but clean.", date: "Feb 2025" },
    ],
  },
  {
    id: "north-campus-suites",
    name: "North Campus Suites",
    tagline: "Modern self-contained studios beside North Campus",
    area: "North Campus",
    distanceKm: 0.3,
    pricePerSemester: 5500,
    deposit: 1000,
    rating: 4.9,
    reviewsCount: 78,
    verified: true,
    availability: "few",
    roomTypes: ["self-contained"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "AC", "Backup Power"],
    photos: [roomSelf2, roomSelf1, exterior2],
    description: "Walk-to-class studios with private bath, kitchenette, smart TV and 24/7 power backup. Most convenient location for North Campus faculties.",
    owner: { name: "North Campus Holdings", responseRate: 99 },
    reviews: [
      { id: "r1", author: "Ama K.", program: "LLB, L300", rating: 5, comment: "Roll out of bed and I'm in class. Worth the price.", date: "Mar 2025" },
    ],
  },
  {
    id: "creative-corner",
    name: "Creative Corner Hostel",
    tagline: "Cosy singles for artsy students near OLA",
    area: "OLA",
    distanceKm: 0.7,
    pricePerSemester: 2400,
    deposit: 350,
    rating: 4.4,
    reviewsCount: 52,
    verified: true,
    availability: "available",
    roomTypes: ["single"],
    amenities: ["Wi-Fi", "Security", "Study Area", "24/7 Water"],
    photos: [roomSingle1, roomSingle2, exterior1],
    description: "Small, character-filled singles popular with arts, theatre and design students. Big windows, quiet block, friendly community.",
    owner: { name: "Auntie Naa", responseRate: 94 },
    reviews: [
      { id: "r1", author: "Selasi D.", program: "BFA Painting, L200", rating: 5, comment: "Finally a room with personality. Light is amazing for sketching.", date: "Jan 2025" },
    ],
  },
  {
    id: "elmina-glass-house",
    name: "Elmina Glass House",
    tagline: "Striking glass-atrium block with bright balconies",
    area: "Kwaprow",
    distanceKm: 1.5,
    pricePerSemester: 4600,
    deposit: 700,
    rating: 4.7,
    reviewsCount: 38,
    verified: true,
    availability: "available",
    roomTypes: ["self-contained", "single"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "AC", "Backup Power", "Kitchen"],
    photos: [exteriorNight2, roomTwinChecker, roomMoody],
    description: "Modern three-storey residence with a full-height glass atrium, private balconies on every unit, and warm landscape lighting. Built in 2024 with quiet inverter ACs and fibre Wi-Fi.",
    owner: { name: "Elmina Living", responseRate: 98 },
    reviews: [
      { id: "r1", author: "Nhyira A.", program: "BSc Architecture, L300", rating: 5, comment: "Building is beautiful at night. Balcony is my favourite study spot.", date: "May 2025" },
    ],
  },
  {
    id: "savanna-twin-lodge",
    name: "Savanna Twin Lodge",
    tagline: "Roomy twin shares with AC, desk and shelves",
    area: "Amamoma",
    distanceKm: 0.8,
    pricePerSemester: 2700,
    deposit: 400,
    rating: 4.3,
    reviewsCount: 71,
    verified: true,
    availability: "available",
    roomTypes: ["shared"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "AC", "Study Area"],
    photos: [roomTwinChecker, roomBunk, exterior1],
    description: "Spacious twin rooms with a shared study desk, wardrobe space and ceiling fan plus split AC. Tidy bathrooms shared between two rooms.",
    owner: { name: "Mrs. Akorfa Yeboah", responseRate: 93 },
    reviews: [
      { id: "r1", author: "Kobby A.", program: "BSc Statistics, L200", rating: 4, comment: "Big enough that you don't feel on top of your roommate. AC is a lifesaver.", date: "Apr 2025" },
    ],
  },
  {
    id: "saltpond-bunk-house",
    name: "Saltpond Bunk House",
    tagline: "Friendly 4-bed bunk dorms — cheapest near OLA",
    area: "OLA",
    distanceKm: 1.0,
    pricePerSemester: 1300,
    deposit: 200,
    rating: 4.1,
    reviewsCount: 124,
    verified: false,
    availability: "few",
    roomTypes: ["shared"],
    amenities: ["Wi-Fi", "Security", "24/7 Water"],
    photos: [roomBunk, exterior3, roomTwinChecker],
    description: "Four-bunk dorm rooms with personal lockers and curtains. Great for fresh L100 students looking to make friends fast. Sits in a water-logged area — the front yard floods briefly during peak rainy season.",
    waterLogged: true,
    owner: { name: "Bro. Kojo", responseRate: 85 },
    reviews: [
      { id: "r1", author: "Adwoa S.", program: "BA English, L100", rating: 4, comment: "Made all my closest friends in this room. Curtains give some privacy.", date: "Feb 2025" },
    ],
  },
  {
    id: "iron-roof-studios",
    name: "Iron Roof Studios",
    tagline: "Moody industrial singles for focused students",
    area: "Science",
    distanceKm: 1.4,
    pricePerSemester: 3100,
    deposit: 500,
    rating: 4.6,
    reviewsCount: 47,
    verified: true,
    availability: "few",
    roomTypes: ["single"],
    amenities: ["Wi-Fi", "24/7 Water", "Security", "AC", "Backup Power"],
    photos: [roomMoody, exteriorNight2, roomSingle1],
    description: "Stylish single rooms with dark walls, exposed steel ceilings, framed art and a quiet split AC. Designed for postgrad and final-year students who want a calm, distraction-free space.",
    owner: { name: "Studio 7 Properties", responseRate: 97 },
    reviews: [
      { id: "r1", author: "Yaa P.", program: "MPhil Economics", rating: 5, comment: "Feels like a boutique hotel. I sleep and study so much better here.", date: "Mar 2025" },
    ],
  },
];


export const AMENITIES = ["Wi-Fi", "24/7 Water", "Security", "Kitchen", "Study Area", "AC", "Backup Power"];

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

export type UtilityInfo = {
  water: { included: boolean; note: string };
  electricity: { included: boolean; meter: "private" | "shared" | "billed"; note: string };
};

export function getUtilities(hostel: Hostel): UtilityInfo {
  const isSelf = hostel.roomTypes.includes("self-contained");
  const premium = hostel.pricePerSemester >= 4500;
  const budget = hostel.pricePerSemester < 2000;

  if (premium || isSelf) {
    return {
      water: { included: true, note: "Water bill is included in the hostel fee." },
      electricity: {
        included: false,
        meter: "private",
        note: "Prepaid meter per room — you top up your own credit at the ECG vendor.",
      },
    };
  }
  if (budget) {
    return {
      water: { included: true, note: "Water is included, but supply may stop briefly during outages." },
      electricity: {
        included: false,
        meter: "shared",
        note: "One prepaid meter shared across the block — cost is split monthly among tenants.",
      },
    };
  }
  return {
    water: { included: true, note: "Water bill is included in the semester fee." },
    electricity: {
      included: false,
      meter: "shared",
      note: "Prepaid meter shared between 2–4 rooms; residents split top-ups monthly.",
    },
  };
}
