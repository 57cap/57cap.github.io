import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/their-story",
    "/our-mission",
    "/the-plan",
    "/impact",
    "/donate",
    "/privacy",
    "/terms",
    "/donation-disclaimer",
  ];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/impact" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/donate" ? 0.9 : 0.7,
  }));
}
