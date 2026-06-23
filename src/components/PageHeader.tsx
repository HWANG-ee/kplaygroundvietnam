export default function PageHeader({
  title,
  emoji,
  subtitle,
  count,
}: {
  title: string;
  emoji?: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 px-7 py-8 mb-8">
      <h1 className="text-3xl font-black flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
        {count !== undefined && (
          <span className="text-base font-semibold text-[var(--color-muted)]">
            {count}개
          </span>
        )}
      </h1>
      {subtitle && <p className="text-[var(--color-muted)] mt-2">{subtitle}</p>}
    </div>
  );
}
