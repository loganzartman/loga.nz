import NavItem from '@/lib/components/NavItem';

export default function NavBar() {
  return (
    <div className="flex flex-row gap-4 px-5 py-2 ring-1 ring-brand-100 bg-background/50 backdrop-blur-sm rounded-full">
      <NavItem label="home" href="/" />
      <NavItem label="blog" href="/blog" />
      <NavItem label="about" href="/about" />
    </div>
  );
}
