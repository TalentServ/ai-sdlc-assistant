interface StageCardProps {
  title: string;
  children: React.ReactNode;
}

export function StageCard({ title, children }: StageCardProps) {
  return (
    <section className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-slate-500">None listed.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-brand-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ListSection({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <BulletList items={items} />
    </div>
  );
}

export function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p>{text}</p>
    </div>
  );
}
