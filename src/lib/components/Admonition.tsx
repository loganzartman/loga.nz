export type Type = 'note' | 'warning';

const icons: Record<Type, React.ReactNode> = {
  note: <div>🛈</div>,
  warning: <div>⚠</div>,
};

const messages: Record<Type, React.ReactNode> = {
  note: <div>Note</div>,
  warning: <div>Warning!</div>,
};

const classNames: Record<Type, string> = {
  note: 'text-indigo-100 bg-indigo-500/10 ring-indigo-500',
  warning: 'text-amber-100 bg-amber-500/10 ring-amber-500',
};

export default function Admonition({
  children,
  type,
}: {
  children: React.ReactNode;
  type: Type;
}) {
  return (
    <div className={`flex flex-col px-4 rounded-lg ring-1 ${classNames[type]}`}>
      <div className="flex flex-row items-start gap-2 mt-4 -mb-2 font-bold lowercase">
        {icons[type]}
        {messages[type]}
      </div>
      <div>{children}</div>
    </div>
  );
}
