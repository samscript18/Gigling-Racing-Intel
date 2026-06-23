import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="speed-rail mb-6 rounded-lg border border-white/10 bg-black/10 px-4 py-5 sm:px-5 lg:flex lg:items-end lg:justify-between lg:gap-4">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="neon-kicker text-[11px] font-black uppercase tracking-[0.22em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="hero-title-gradient mt-3 text-4xl font-black tracking-normal sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58 sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="mt-4 flex flex-wrap items-center gap-2 lg:mt-0">{actions}</div> : null}
    </div>
  );
}
