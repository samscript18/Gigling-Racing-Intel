import type { MetadataRoute } from "next";

import { appEnv } from "@/lib/config/env";

const routes = [
  "",
  "/dashboard",
  "/giglings",
  "/races",
  "/predictor",
  "/stable",
  "/leaderboard",
  "/meta",
  "/rivals",
  "/reports",
  "/docs"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${appEnv.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
