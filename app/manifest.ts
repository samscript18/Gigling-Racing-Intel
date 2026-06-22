import type { MetadataRoute } from "next";

import { appEnv } from "@/lib/config/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appEnv.appName,
    short_name: "GRI",
    description:
      "The intelligence layer for Gigaverse Gigling Racing players.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#05070d",
    theme_color: "#20F7FF",
    categories: ["games", "sports", "utilities"],
    orientation: "portrait-primary"
  };
}
