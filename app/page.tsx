import { LandingExperience } from "@/components/landing/landing-experience";
import {
  fetchGiglings,
  fetchMetaData,
  fetchRaces
} from "@/lib/gigaverse/api-client";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [giglingResult, raceResult, metaResult] = await Promise.allSettled([
    fetchGiglings(),
    fetchRaces(),
    fetchMetaData()
  ]);
  const giglings = giglingResult.status === "fulfilled" ? giglingResult.value : [];
  const races = raceResult.status === "fulfilled" ? raceResult.value : [];
  const metaData =
    metaResult.status === "fulfilled"
      ? metaResult.value
      : { factionPerformance: [], insights: [] };

  return (
    <LandingExperience
      factionPerformance={metaData.factionPerformance}
      giglings={giglings}
      insights={metaData.insights}
      races={races}
    />
  );
}
