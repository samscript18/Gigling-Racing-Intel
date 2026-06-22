import type { MetadataRoute } from "next";

import { appEnv } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${appEnv.siteUrl}/sitemap.xml`
  };
}
