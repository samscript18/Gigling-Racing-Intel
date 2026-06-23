import type { Metadata } from "next";

import { RacingAcademy } from "@/components/docs/racing-academy";

export const metadata: Metadata = {
  title: "Racing Academy",
  description:
    "A premium Gigling Racing Academy for learning mechanics, strategy, Race Intelligence, stable management, rivalries, reports, and the Gigaverse data layer."
};

export default function DocsPage() {
  return <RacingAcademy />;
}
