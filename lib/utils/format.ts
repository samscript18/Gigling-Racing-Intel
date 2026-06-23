export function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function formatToken(value: number) {
  return `${Intl.NumberFormat("en", {
    maximumFractionDigits: value >= 100 ? 0 : 2
  }).format(value)} GIGA`;
}

export function formatOptionalToken(value: number, unavailableLabel = "Payout data unavailable") {
  return value > 0 ? formatToken(value) : unavailableLabel;
}

export function formatConditionLabel(value: string, unavailableLabel = "Unavailable") {
  return value === "unknown" ? unavailableLabel : value;
}

export function formatGiglingRaceFit(distance: string, weather: string) {
  const labels = [
    formatConditionLabel(distance, ""),
    formatConditionLabel(weather, "")
  ].filter(Boolean);

  return labels.length > 0 ? labels.join(" / ") : "Race fit unavailable";
}

export function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
