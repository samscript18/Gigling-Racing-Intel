type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-black text-white">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-white/52">{description}</p> : null}
    </div>
  );
}
