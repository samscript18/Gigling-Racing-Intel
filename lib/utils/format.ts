export function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function formatToken(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "N/A";
  }

  const maximumFractionDigits = value > 0 && value < 1 ? 6 : value >= 100 ? 0 : 2;

  return `${Intl.NumberFormat("en", {
    maximumFractionDigits
  }).format(value)} ETH`;
}

export function formatOptionalToken(value?: number | null, unavailableLabel = "N/A") {
  return typeof value === "number" && Number.isFinite(value)
    ? formatToken(value)
    : unavailableLabel;
}

export function formatInteger(value?: number | null, unavailableLabel = "N/A") {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return unavailableLabel;
  }

  return Intl.NumberFormat("en", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatConditionLabel(value?: string | null, unavailableLabel = "N/A") {
  return !value || value === "unknown" ? unavailableLabel : value;
}

export function formatGiglingRaceFit(distance: string, condition: string) {
  const labels = [
    formatConditionLabel(distance, ""),
    formatConditionLabel(condition, "")
  ].filter(Boolean);

  return labels.length > 0 ? labels.join(" / ") : "N/A";
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
