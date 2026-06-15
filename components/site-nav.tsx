import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/structure", label: "Structure" },
] as const;

export function SiteNav() {
  return (
    <nav className="top-nav">
      <Link href="/" className="top-nav-brand">
        <span className="top-nav-wordmark">DASOM</span>
        <span className="top-nav-subtitle">Davidic School of Ministry</span>
      </Link>
      <div className="top-nav-links">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="nav-link">
            {label}
          </Link>
        ))}
        <Link href="/enroll" className="btn-primary">
          Enroll Now
        </Link>
      </div>
    </nav>
  );
}
