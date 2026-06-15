import Link from "next/link";

type PageHeroProps = {
  label: string;
  title: string;
  description?: string;
  cta?: { href: string; label: string };
};

export function PageHero({ label, title, description, cta }: PageHeroProps) {
  return (
    <header className="page-hero">
      <span className="caption-uppercase">{label}</span>
      <h1 className="display-lg" style={{ marginTop: 16, marginBottom: description ? 16 : 0 }}>
        {title}
      </h1>
      {description && (
        <p className="body-md page-hero-desc">{description}</p>
      )}
      {cta && (
        <div style={{ marginTop: 24 }}>
          <Link href={cta.href} className="btn-primary">{cta.label}</Link>
        </div>
      )}
    </header>
  );
}
