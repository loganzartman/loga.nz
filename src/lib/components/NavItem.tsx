import Link from 'next/link';

export default function NavItem({label, href}: {label: string; href: string}) {
  return (
    <Link href={href}>
      <div className="group relative flex items-center gap-3 text-xl">
        <div className="relative w-[1em] h-[1em]">
          <div className="absolute inline-block w-full h-full rounded-full transition duration-200 bg-brand-100 group-hover:bg-highlight translate-x-0.5 group-hover:translate-x-0" />
          <div className="absolute inline-block w-full h-full rounded-full transition duration-200 ring-0 group-hover:ring-1 ring-brand-100 group-hover:ring-highlight bg-background -translate-x-0.5 group-hover:translate-x-0" />
        </div>
        <div className="font-semibold select-none transition duration-300 translate-x-0 group-hover:-translate-x-1 group-hover:text-highlight">
          {label}
        </div>
      </div>
    </Link>
  );
}
