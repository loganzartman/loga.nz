export function Panel({
  children,
  title,
  buttons,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  buttons?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-background rounded-lg overflow-hidden shadow-black/50 shadow-xl ${className}`}
    >
      <div className="bg-brand-100/10 flex flex-col">
        <div className="flex flex-row items-center p-2 bg-brand-100/10">
          <div className="flex-1">{title}</div>
          {buttons}
        </div>
        {children}
      </div>
    </div>
  );
}
