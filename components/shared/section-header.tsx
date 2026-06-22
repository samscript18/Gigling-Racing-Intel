import { MechanicTooltip } from "@/components/shared/mechanic-tooltip";
import type { RacingMechanic } from "@/lib/gigaverse/mechanics";

type SectionHeaderProps = {
  title: string;
  description?: string;
  mechanic?: RacingMechanic;
};

export function SectionHeader({ title, description, mechanic }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {mechanic ? <MechanicTooltip mechanic={mechanic} /> : null}
      </div>
      {description ? <p className="mt-1 text-sm leading-6 text-white/52">{description}</p> : null}
    </div>
  );
}
