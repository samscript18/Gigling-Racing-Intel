import { LandingExperience } from "@/components/landing/landing-experience";
import {
  fetchGiglings,
  fetchMetaData,
  fetchRaces
} from "@/lib/gigaverse/api-client";

export const dynamic = "force-dynamic";

function getLandingErrorMessage(reason: unknown) {
  return reason instanceof Error
    ? reason.message
    : "Live Gigaverse data is unavailable right now.";
}

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
  const feedStatus = {
    giglings: {
      available: giglingResult.status === "fulfilled",
      message:
        giglingResult.status === "rejected"
          ? getLandingErrorMessage(giglingResult.reason)
          : undefined
    },
    meta: {
      available: metaResult.status === "fulfilled",
      message:
        metaResult.status === "rejected"
          ? getLandingErrorMessage(metaResult.reason)
          : undefined
    },
    races: {
      available: raceResult.status === "fulfilled",
      message:
        raceResult.status === "rejected"
          ? getLandingErrorMessage(raceResult.reason)
          : undefined
    }
  };

  return (
    <LandingExperience
      feedStatus={feedStatus}
      factionPerformance={metaData.factionPerformance}
      giglings={giglings}
      insights={metaData.insights}
      races={races}
    />
  );
}
