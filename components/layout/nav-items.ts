import {
  BarChart3,
  BookOpenCheck,
  Bot,
  FileStack,
  Flag,
  Gauge,
  Home,
  LineChart,
  Medal,
  Radar,
  Swords,
  Trophy,
  WalletCards,
  type LucideIcon
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const primaryNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Race intelligence cockpit",
    icon: Gauge
  },
  {
    href: "/giglings",
    label: "Giglings",
    description: "Explore pets, traits, and form",
    icon: Bot
  },
  {
    href: "/races",
    label: "Races",
    description: "Live, recent, and historical races",
    icon: Flag
  },
  {
    href: "/predictor",
    label: "Predictor",
    description: "Explainable race estimates",
    icon: Radar
  },
  {
    href: "/stable",
    label: "Stable",
    description: "Wallet-ready stable manager",
    icon: WalletCards
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    description: "Top Giglings, players, factions",
    icon: Trophy
  },
  {
    href: "/meta",
    label: "Meta",
    description: "Faction and condition shifts",
    icon: LineChart
  },
  {
    href: "/rivals",
    label: "Rivals",
    description: "Rivalry and ally reads",
    icon: Swords
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Shareable intel cards",
    icon: FileStack
  },
  {
    href: "/docs",
    label: "Docs",
    description: "Racing academy and manual",
    icon: BookOpenCheck
  }
];

export const landingNavItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Product overview",
    icon: Home
  },
  ...primaryNavItems,
  {
    href: "/meta",
    label: "Meta Watch",
    description: "Current racing meta",
    icon: BarChart3
  },
  {
    href: "/leaderboard",
    label: "Podium",
    description: "Top performers",
    icon: Medal
  }
];
