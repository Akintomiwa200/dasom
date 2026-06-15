import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CtaBand } from "@/components/cta-band";
import { stats, modules, gates, pillars, timeline, instructor } from "@/lib/content";

export default function Home() {
  return (
    <main className="page-canvas">
      <SiteNav />

      <section className="hero-band">
        <div className="hero-inner">
          <span className="badge-pill">The Cave of Adullam Awaits You</span>
          <h1 className="display-mega" style={{ marginBottom: 24 }}>
            Raising Mighty Men<br />for the Nations
          </h1>
          <p className="body-md">
            An 8-month transformational programme designed to take the raw, the restless, and the ready — and raise them as Kingdom Gatekeepers.
          </p>
          <p className="caption-uppercase" style={{ marginBottom: 0 }}>
            By The Mighty Men of David · Ago-Iwoye, Ogun State
          </p>
          <div className="hero-cta-row">
            <Link href="/enroll" className="btn-primary">Begin Your Enrollment</Link>
            <Link href="/about" className="btn-secondary">Learn More</Link>
          </div>
          <div className="stats-row">
            {stats.map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="stat-value">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-md">
          <div className="section-header">
            <span className="caption-uppercase">Our Origin</span>
            <h2 className="display-lg">The Cave of Adullam</h2>
            <div className="divider" />
          </div>
          <div className="about-grid">
            <div>
              <blockquote className="blockquote">
                &ldquo;And every one that was in distress, and every one that was in debt, and every one that was in discontented, gathered themselves unto him; and he became a captain over them.&rdquo;
                <footer>— 1 Samuel 22:2</footer>
              </blockquote>
              <p className="body-md">
                David didn&apos;t turn the broken away. He received them, refined them, and raised them — and out of that group came his legendary Mighty Men. DASOM is that cave.
              </p>
              <Link href="/about" className="link-read-more" style={{ display: "inline-block", marginTop: 16 }}>
                Read the full story →
              </Link>
            </div>
            <div className="pillar-list">
              {pillars.map(({ icon, title, desc }) => (
                <div key={title} className="card pillar-row">
                  <div className="feature-card-icon">{icon}</div>
                  <div>
                    <div className="title-sm" style={{ marginBottom: 4 }}>{title}</div>
                    <div className="body-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--canvas-soft)" }}>
        <div className="container">
          <div className="section-header">
            <span className="caption-uppercase">The Curriculum</span>
            <h2 className="display-lg">12 Modules of Training</h2>
            <div className="divider" />
            <p className="body-md">7 months of teaching, 1 month of assessment — all leading to graduation and impartation.</p>
          </div>
          <div className="module-grid">
            {modules.slice(0, 6).map(({ num, title, desc }) => (
              <div key={num} className="card module-card">
                <div className="module-num-watermark">{num}</div>
                <div className="caption-uppercase" style={{ marginBottom: 8 }}>Module {num}</div>
                <div className="title-sm" style={{ marginBottom: 8 }}>{title}</div>
                <div className="body-sm">{desc}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/curriculum" className="link-read-more">View all 12 modules and gates of influence →</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-sm" style={{ textAlign: "center" }}>
          <span className="caption-uppercase" style={{ display: "inline-block", marginBottom: 16 }}>12 Clusters</span>
          <h2 className="display-lg" style={{ marginBottom: 8 }}>Gates of Influence</h2>
          <div className="divider" />
          <p className="body-md" style={{ marginBottom: 40 }}>
            Students are grouped into 12 clusters, each corresponding to a gate of societal influence.
          </p>
          <div className="gates-wrap">
            {gates.map((g) => (
              <span key={g.name} className="badge-pill">{g.name}</span>
            ))}
          </div>
          <p style={{ marginTop: 32 }}>
            <Link href="/curriculum#gates" className="link-read-more">Explore each gate in detail →</Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--canvas-soft)" }}>
        <div className="container-sm">
          <div className="section-header">
            <span className="caption-uppercase">Programme Structure</span>
            <h2 className="display-lg">How It Works</h2>
            <div className="divider" />
          </div>
          <div className="timeline">
            {timeline.map(({ phase, title, desc }, i) => (
              <div key={title} className="timeline-item">
                <div className="timeline-rail">
                  <div className="timeline-dot" />
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <div>
                  <div className="caption-uppercase" style={{ marginBottom: 4 }}>{phase}</div>
                  <div className="display-sm" style={{ fontSize: 18, marginBottom: 8 }}>{title}</div>
                  <div className="body-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/structure" className="link-read-more">Full structure, fees, and attendance rules →</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-sm">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <span className="caption-uppercase">Lead Instructor</span>
            <h2 className="display-lg">{instructor.name}</h2>
            <div className="divider" />
          </div>
          <div className="card instructor-card">
            <div className="avatar">{instructor.initials}</div>
            <div>
              <div className="caption-uppercase" style={{ marginBottom: 8 }}>{instructor.role}</div>
              <p className="body-sm" style={{ marginBottom: 16 }}>{instructor.bio}</p>
              <Link href="/about#instructor" className="link-read-more">Read full bio →</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </main>
  );
}
