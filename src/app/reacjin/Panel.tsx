export function Panel({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-background rounded-lg overflow-hidden shadow-black/50 shadow-xl ${className}`}
    >
      <div className="bg-brand-100/10 flex flex-col">
        <div className="p-2 bg-brand-100/10">{title}</div>
        {children}
      </div>
    </div>
  );
}
