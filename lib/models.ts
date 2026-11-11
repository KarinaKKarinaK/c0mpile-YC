// Real robot models with sourced list prices (Nov 2026). Hourly rates and US content are [synthetic].
import type { Kind } from "./engine";
export type Model = { model: string; maker: string; kind: Kind; price: number; note: string; madeIn: string; usPct: number; rate: number; source: string };
export const MODELS: Model[] = [
  { model: "MiR250", maker: "Mobile Industrial Robots", kind: "AMR", price: 30000, note: "estimate, no official price", madeIn: "Denmark", usPct: 30, rate: 18, source: "https://robotomated.com/explore/warehouse/mir250" },
  { model: "UR5e", maker: "Universal Robots", kind: "Arm", price: 36515, note: "reseller list", madeIn: "Denmark", usPct: 30, rate: 22, source: "https://vention.io/parts/universal-robots-ur5e-collaborative-robot-arm-2445" },
  { model: "G1", maker: "Unitree", kind: "Humanoid", price: 16000, note: "launch price; US resellers $17.9k to $21.6k", madeIn: "China", usPct: 15, rate: 12, source: "https://heise.de/-9720187" },
  { model: "Go2 Air", maker: "Unitree", kind: "Quadruped", price: 1600, note: "starting price", madeIn: "China", usPct: 15, rate: 6, source: "https://www.roboticscenter.ai/blog/spot-vs-go2-price-comparison" },
  { model: "Origin", maker: "Locus Robotics", kind: "AMR", price: 39600, note: "derived: $1,100/mo lease x 36", madeIn: "USA", usPct: 72, rate: 15, source: "https://www.sap.com/mena/products/scm/partners/locus-robotics-inc-locus-autonomous-mobile-robots-for-sap-ewm.html" },
  { model: "CRX-10iA", maker: "FANUC", kind: "Arm", price: 46026, note: "reseller list", madeIn: "Japan", usPct: 25, rate: 25, source: "https://vention.io/parts/fanuc-crx-10ia-collaborative-robot-arm-1923" },
  { model: "Digit", maker: "Agility Robotics", kind: "Humanoid", price: 250000, note: "reseller estimate; RaaS ~$8.5k/mo", madeIn: "USA", usPct: 70, rate: 32, source: "https://www.therobotreport.com/agility-robotics-reports-18m-revenue-ahead-of-humanoid-spac/" },
  { model: "Spot", maker: "Boston Dynamics", kind: "Quadruped", price: 74500, note: "starting price", madeIn: "USA", usPct: 68, rate: 30, source: "https://www.roboticscenter.ai/blog/spot-vs-go2-price-comparison" },
  { model: "CartConnect 500", maker: "Zebra (Fetch)", kind: "AMR", price: 35000, note: "estimate, low reliability", madeIn: "USA", usPct: 66, rate: 16, source: "https://robotomated.com/explore/warehouse/fetch-cart500" },
  { model: "RO1", maker: "Standard Bots", kind: "Arm", price: 37000, note: "maker list price", madeIn: "USA", usPct: 78, rate: 22, source: "https://standardbots.com/articles/how-much-do-robots-cost" },
  { model: "NEO", maker: "1X", kind: "Humanoid", price: 20000, note: "preorder price or $499/mo", madeIn: "USA (unverified)", usPct: 55, rate: 10, source: "https://fortune.com/2026/02/26/humanoid-robot-that-will-do-chores-for-you-robotics-company-1x/" },
  { model: "B2", maker: "Unitree", kind: "Quadruped", price: 85900, note: "reseller list", madeIn: "China", usPct: 15, rate: 28, source: "https://store.trossenrobotics.com/products/b2" },
];
