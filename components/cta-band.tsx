import Link from "next/link";

export function CtaBand() {
  return (
    <section className="cta-band">
      <h2 className="display-lg" style={{ marginBottom: 16 }}>Your Cave is Ready.</h2>
      <p className="body-md">
        The 8-month programme begins soon. Applications are open to all — physical and virtual enrollment available.
      </p>
      <Link href="/enroll" className="btn-primary">Apply for Enrollment</Link>
    </section>
  );
}
