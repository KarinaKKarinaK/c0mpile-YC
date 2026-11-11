import type { MetadataRoute } from "next";
const B = "https://selfmade-yc.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pipeline", "/desk", "/invest", "/llms.txt"].map((p) => ({ url: `${B}${p}` }));
}
