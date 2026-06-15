import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { aboutContent, pillars, instructor } from "@/lib/content";

export const metadata = {
  title: "About — DASOM",
  description: "The Cave of Adullam — origin, vision, and pillars of the Davidic School of Ministry.",
};

export default function AboutPage() {
  return (
    <main className="page-canvas">
      <SiteNav />
      <PageHero
        label="Our Origin"
        title={aboutContent.headline}
        description="DASOM is a gathering place for the distressed, indebted, and discontented — those carrying untapped Kingdom potential."
        cta={{ href: "/enroll", label: "Begin Enrollment" }}
      />

      <div className="page-body container-md">
        <blockquote className="blockquote" style={{ marginBottom: 48 }}>
          &ldquo;{aboutContent.scripture}&rdquo;
          <footer>— {aboutContent.reference}</footer>
        </blockquote>

        {aboutContent.sections.map(({ title, body }) => (
          <div key={title} className="prose-block">
            <h3>{title}</h3>
            <p className="body-md">{body}</p>
          </div>
        ))}

        <div style={{ marginTop: 48, marginBottom: 48 }}>
          <span className="caption-uppercase" style={{ display: "block", marginBottom: 24 }}>Our Approach</span>
          <h2 className="display-md" style={{ marginBottom: 32 }}>Enlighten · Equip · Empower</h2>
          <div className="pillar-list">
            {pillars.map(({ icon, title, desc, detail }) => (
              <div key={title} className="card pillar-row">
                <div className="feature-card-icon">{icon}</div>
                <div>
                  <div className="title-sm" style={{ marginBottom: 4 }}>{title}</div>
                  <p className="body-sm" style={{ marginBottom: 8 }}>{desc}</p>
                  <p className="body-sm">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="instructor" style={{ marginTop: 48 }}>
          <span className="caption-uppercase" style={{ display: "block", marginBottom: 24 }}>Lead Instructor</span>
          <h2 className="display-md" style={{ marginBottom: 24 }}>{instructor.name}</h2>
          <div className="card instructor-card">
            <div className="avatar">{instructor.initials}</div>
            <div>
              <div className="caption-uppercase" style={{ marginBottom: 8 }}>{instructor.role}</div>
              <p className="body-sm" style={{ marginBottom: 12 }}>{instructor.bio}</p>
              <p className="body-sm" style={{ marginBottom: 16 }}>{instructor.extended}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {instructor.credentials.map((c) => (
                  <span key={c} className="badge-pill">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CtaBand />
      <SiteFooter />
    </main>
  );
}
