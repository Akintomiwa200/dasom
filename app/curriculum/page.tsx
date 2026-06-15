import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { modules, gates } from "@/lib/content";

export const metadata = {
  title: "Curriculum — DASOM",
  description: "12 modules of theological and practical training, plus 12 gates of societal influence.",
};

export default function CurriculumPage() {
  return (
    <main className="page-canvas">
      <SiteNav />
      <PageHero
        label="The Curriculum"
        title="12 Modules of Training"
        description="Seven months of teaching and one month of assessment — a comprehensive journey from foundations to deployment."
        cta={{ href: "/enroll", label: "Apply Now" }}
      />

      <div className="page-body container">
        <p className="body-md" style={{ maxWidth: 640, margin: "0 auto 48px", textAlign: "center" }}>
          Each module builds on the last, taking students from God&apos;s original agenda through systematic theology,
          marketplace ministry, and end-time prophecy — all oriented toward real-world Kingdom influence.
        </p>

        <div className="module-grid">
          {modules.map(({ num, title, desc, topics }) => (
            <div key={num} className="card module-card">
              <div className="module-num-watermark">{num}</div>
              <div className="caption-uppercase" style={{ marginBottom: 8 }}>Module {num}</div>
              <div className="title-sm" style={{ marginBottom: 8 }}>{title}</div>
              <p className="body-sm" style={{ marginBottom: 12 }}>{desc}</p>
              <ul className="topic-list">
                {topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div id="gates" style={{ marginTop: 80, textAlign: "center" }}>
          <span className="caption-uppercase" style={{ display: "inline-block", marginBottom: 16 }}>12 Clusters</span>
          <h2 className="display-lg" style={{ marginBottom: 8 }}>Gates of Influence</h2>
          <div className="divider" />
          <p className="body-md" style={{ maxWidth: 560, margin: "0 auto 48px" }}>
            Every student is assigned to one of twelve gates — clusters corresponding to spheres of societal influence.
            Your gate shapes your group project, peer community, and deployment focus after graduation.
          </p>
        </div>

        <div className="module-grid">
          {gates.map(({ name, desc }) => (
            <div key={name} className="card gate-card">
              <h3>{name}</h3>
              <p className="body-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CtaBand />
      <SiteFooter />
    </main>
  );
}
