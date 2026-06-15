import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { timeline, feeContent, attendanceRules } from "@/lib/content";

export const metadata = {
  title: "Programme Structure — DASOM",
  description: "How the 8-month DASOM programme works — classes, assessment, graduation, fees, and attendance.",
};

export default function StructurePage() {
  return (
    <main className="page-canvas">
      <SiteNav />
      <PageHero
        label="Programme Structure"
        title="How It Works"
        description="Eight months from enrollment to impartation — a clear path from classroom to commissioning."
        cta={{ href: "/enroll", label: "Start Application" }}
      />

      <div className="page-body container-sm">
        <div className="timeline" style={{ marginBottom: 48 }}>
          {timeline.map(({ phase, title, desc, detail }, i) => (
            <div key={title} className="timeline-item">
              <div className="timeline-rail">
                <div className="timeline-dot" />
                {i < timeline.length - 1 && <div className="timeline-line" />}
              </div>
              <div>
                <div className="caption-uppercase" style={{ marginBottom: 4 }}>{phase}</div>
                <div className="display-sm" style={{ fontSize: 18, marginBottom: 8 }}>{title}</div>
                <p className="body-sm" style={{ marginBottom: 8 }}>{desc}</p>
                <p className="body-sm">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="title-sm" style={{ marginBottom: 8 }}>Attendance Requirements</div>
          <ul className="topic-list">
            {attendanceRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="title-sm" style={{ marginBottom: 8 }}>{feeContent.title}</div>
          <p className="body-sm" style={{ marginBottom: 16 }}>{feeContent.summary}</p>
          <ul className="topic-list">
            {feeContent.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ marginTop: 24, background: "var(--canvas-soft)" }}>
          <div className="title-sm" style={{ marginBottom: 8 }}>Enrollment Modes</div>
          <p className="body-sm" style={{ marginBottom: 12 }}>
            <strong className="text-ink">Physical</strong> — For students based in or near Ago-Iwoye, Ogun State. Attend classes in person at the programme venue.
          </p>
          <p className="body-sm">
            <strong className="text-ink">Virtual</strong> — For students outside Ago-Iwoye. Join live sessions online with the same curriculum, attendance tracking, and graduation requirements.
          </p>
        </div>
      </div>

      <CtaBand />
      <SiteFooter />
    </main>
  );
}
