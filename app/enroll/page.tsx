"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { dasomReference, formatNaira, getSelarCheckoutUrl, REGISTRATION_FEE_NGN } from "@/lib/payment";

const GATES = ["Education","Government","Politics/Leadership","Media","Arts & Entertainment","Business/Finance","Religion","Family","Law","Sports","Health","Technology"];
const STEPS = ["Personal Info","Spiritual Journey","Commitment","Referee"];

type EnrollFieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  children?: React.ReactNode;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function EnrollField({
  label,
  id,
  type = "text",
  placeholder = "",
  required = true,
  textarea = false,
  children,
  value,
  error,
  onChange,
}: EnrollFieldProps) {
  return (
    <div className="field">
      <label htmlFor={children ? undefined : id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children || (textarea ? (
        <textarea
          id={id}
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export default function EnrollPage() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "payment" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [appId, setAppId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">("unpaid");
  const [errors, setErrors] = useState<Record<string,string>>({});

  const [form, setForm] = useState({
    email: "", surname: "", middleName: "", firstName: "",
    dateOfBirth: "", nationality: "", gender: "", state: "",
    city: "", homeAddress: "", profession: "", mobileNumber: "",
    modeOfEnrollment: "",
    isSaved: "", savedDate: "", salvationExperience: "", lifeVision: "",
    reasonForEnrolling: "", gateOfInfluence: "",
    attendanceAgreement: false, graduationAgreement: false, feeAgreement: false,
    characterChallenges: "",
    refereeName: "", refereePhone: "",
  });

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({...f, [k]: v}));
    setErrors(e => ({...e, [k]: ""}));
  };

  const validateStep = () => {
    const e: Record<string,string> = {};
    if (step === 0) {
      if (!form.email) e.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
      if (!form.surname) e.surname = "Required";
      if (!form.firstName) e.firstName = "Required";
      if (!form.dateOfBirth) e.dateOfBirth = "Required";
      if (!form.nationality) e.nationality = "Required";
      if (!form.gender) e.gender = "Required";
      if (!form.state) e.state = "Required";
      if (!form.city) e.city = "Required";
      if (!form.homeAddress) e.homeAddress = "Required";
      if (!form.profession) e.profession = "Required";
      if (!form.mobileNumber) e.mobileNumber = "Required";
      if (!form.modeOfEnrollment) e.modeOfEnrollment = "Required";
    }
    if (step === 1) {
      if (!form.isSaved) e.isSaved = "Required";
      if (!form.salvationExperience) e.salvationExperience = "Required";
      if (!form.lifeVision) e.lifeVision = "Required";
      if (!form.reasonForEnrolling) e.reasonForEnrolling = "Required";
      if (!form.gateOfInfluence) e.gateOfInfluence = "Required";
    }
    if (step === 2) {
      if (!form.attendanceAgreement) e.attendanceAgreement = "You must agree to the attendance requirement";
      if (!form.graduationAgreement) e.graduationAgreement = "You must agree to attend graduation";
      if (!form.feeAgreement) e.feeAgreement = "You must acknowledge the fee";
    }
    if (step === 3) {
      if (!form.refereeName) e.refereeName = "Required";
      if (!form.refereePhone) e.refereePhone = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s+1, 3)); };
  const back = () => setStep(s => Math.max(s-1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = { ...form, isSaved: form.isSaved === "yes" };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setAppId(data.id);
        setCheckoutUrl(data.checkoutUrl ?? getSelarCheckoutUrl({
          id: data.id,
          email: form.email,
          firstName: form.firstName,
          surname: form.surname,
        }));
        setPhase("payment");
      } else setErrors({ form: data.error || "Submission failed. Please try again." });
    } catch { setErrors({ form: "Network error. Please try again." }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (phase !== "payment" || !appId) return;
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/applications/${appId}/payment`);
        if (!res.ok || !active) return;
        const data = await res.json();
        if (data.paymentStatus === "paid") {
          setPaymentStatus("paid");
          setPhase("done");
        }
      } catch {
        /* retry on next interval */
      }
    };

    poll();
    const timer = setInterval(poll, 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [phase, appId]);

  const field = (id: keyof typeof form) => ({
    id,
    value: String(form[id] ?? ""),
    error: errors[id],
    onChange: (v: string) => set(id, v),
  });

  if (phase === "done") return (
    <div className="page-canvas success-screen">
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div className="success-icon">✦</div>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Enrollment Complete</h1>
        <p className="body-md" style={{ marginBottom: 16 }}>
          Welcome to the Cave of Adullam. Your application and {formatNaira(REGISTRATION_FEE_NGN)} registration payment are confirmed.
        </p>
        <div className="card" style={{ marginBottom: 32, textAlign: "left" }}>
          <div className="caption-uppercase" style={{ marginBottom: 4 }}>Application Reference</div>
          <div className="ref-code">{dasomReference(appId)}</div>
        </div>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );

  if (phase === "payment") return (
    <div className="page-canvas success-screen">
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div className="success-icon" style={{ opacity: 0.9 }}>◇</div>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Complete Registration Payment</h1>
        <p className="body-md" style={{ marginBottom: 16 }}>
          Your application is saved. Pay {formatNaira(REGISTRATION_FEE_NGN)} via Selar to finalize enrollment.
        </p>
        <div className="card" style={{ marginBottom: 24, textAlign: "left" }}>
          <div className="caption-uppercase" style={{ marginBottom: 4 }}>Application Reference</div>
          <div className="ref-code" style={{ marginBottom: 12 }}>{dasomReference(appId)}</div>
          <p className="body-sm text-muted">
            Use this reference if Selar asks for an application ID. Your email ({form.email}) is pre-filled at checkout.
          </p>
        </div>
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginBottom: 12, display: "inline-flex" }}>
          Pay {formatNaira(REGISTRATION_FEE_NGN)} on Selar →
        </a>
        <p className="caption" style={{ marginTop: 16 }}>
          {paymentStatus === "paid" ? "Payment confirmed." : "Waiting for payment confirmation… this page updates automatically."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="page-canvas">
      <SiteNav />

      <div className="container-xs" style={{ padding: "32px 24px 48px" }}>
        <p className="caption-uppercase" style={{ textAlign: "center", marginBottom: 32 }}>Enrollment Application</p>
        <div className="step-row">
          {STEPS.map((s, i) => (
            <div key={s} className="step-group">
              <div className="step-col">
                <div className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div className={`step-label ${i === step ? "active" : i < step ? "done" : ""}`}>{s}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-connector ${i < step ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card enroll-card">
          {step === 0 && (
            <div>
              <h2 className="display-sm" style={{ marginBottom: 8 }}>Personal Information</h2>
              <p className="body-sm" style={{ marginBottom: 32 }}>Basic details about you.</p>
              <div className="form-grid-2">
                <EnrollField label="Surname" placeholder="e.g. Adebayo" {...field("surname")} />
                <EnrollField label="First Name" placeholder="e.g. Samuel" {...field("firstName")} />
              </div>
              <EnrollField label="Middle Name" placeholder="Optional" required={false} {...field("middleName")} />
              <EnrollField label="Email Address" type="email" placeholder="you@example.com" {...field("email")} />
              <div className="form-grid-2">
                <EnrollField label="Date of Birth" type="date" {...field("dateOfBirth")} />
                <EnrollField label="Mobile Number" placeholder="+234 xxx xxx xxxx" {...field("mobileNumber")} />
              </div>
              <div className="form-grid-2">
                <EnrollField label="Gender" {...field("gender")}>
                  <select id="gender" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </EnrollField>
                <EnrollField label="Nationality" placeholder="e.g. Nigerian" {...field("nationality")} />
              </div>
              <div className="form-grid-2">
                <EnrollField label="State" placeholder="e.g. Ogun" {...field("state")} />
                <EnrollField label="City" placeholder="e.g. Ago-Iwoye" {...field("city")} />
              </div>
              <EnrollField label="Home Address" placeholder="Full address" {...field("homeAddress")} />
              <EnrollField label="Profession / Occupation" placeholder="e.g. Engineer, Student, Teacher" {...field("profession")} />
              <EnrollField label="Mode of Enrollment" {...field("modeOfEnrollment")}>
                <select id="modeOfEnrollment" value={form.modeOfEnrollment} onChange={(e) => set("modeOfEnrollment", e.target.value)}>
                  <option value="">Select mode</option>
                  <option value="Physical">Physical (Ago-Iwoye only)</option>
                  <option value="Virtual">Virtual (outside Ago-Iwoye)</option>
                </select>
              </EnrollField>
              {errors.modeOfEnrollment && <div className="field-error" style={{ marginTop: -12, marginBottom: 12 }}>{errors.modeOfEnrollment}</div>}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="display-sm" style={{ marginBottom: 8 }}>Spiritual Journey</h2>
              <p className="body-sm" style={{ marginBottom: 32 }}>Tell us about your faith and calling.</p>
              <EnrollField label="Are You Saved?" {...field("isSaved")}>
                <div style={{ display: "flex", gap: 12 }}>
                  {["yes", "no"].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("isSaved", v)}
                      className={`choice-btn ${form.isSaved === v ? "selected" : ""}`}
                    >
                      {v === "yes" ? "Yes, I am saved" : "Not yet"}
                    </button>
                  ))}
                </div>
              </EnrollField>
              {form.isSaved === "yes" && (
                <EnrollField label="Date of Salvation" type="date" required={false} {...field("savedDate")} />
              )}
              <EnrollField label="Briefly Narrate Your Salvation Experience" textarea placeholder="Share your testimony..." {...field("salvationExperience")} />
              <EnrollField label="What Is Your Life's Vision?" textarea placeholder="What has God put in your heart to accomplish?" {...field("lifeVision")} />
              <EnrollField label="Why Have You Chosen to Enroll at DASOM?" textarea placeholder="What draws you to this programme?" {...field("reasonForEnrolling")} />
              <EnrollField label="Choose Your Gate of Influence" {...field("gateOfInfluence")}>
                <select id="gateOfInfluence" value={form.gateOfInfluence} onChange={(e) => set("gateOfInfluence", e.target.value)}>
                  <option value="">Select your gate</option>
                  {GATES.map(g => <option key={g}>{g}</option>)}
                </select>
              </EnrollField>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="display-sm" style={{ marginBottom: 8 }}>Commitments & Agreements</h2>
              <p className="body-sm" style={{ marginBottom: 32 }}>Please read and agree to the programme requirements.</p>
              {[
                { id: "attendanceAgreement", label: "75% Attendance Requirement", desc: "I understand that I must meet a minimum of 75% attendance throughout the programme. Missing 4 consecutive weeks results in automatic withdrawal." },
                { id: "graduationAgreement", label: "Graduation & Impartation", desc: "I commit to being available for the Graduation and Impartation service at the end of the 8-month programme." },
                { id: "feeAgreement", label: "Registration Fee", desc: `I understand that DASOM is tuition-free, and I agree to pay the ${formatNaira(REGISTRATION_FEE_NGN)} registration fee via Selar during enrollment to secure my place in the programme.` },
              ].map(({ id, label, desc }) => {
                const key = id as "attendanceAgreement" | "graduationAgreement" | "feeAgreement";
                const checked = form[key];
                return (
                <div key={id} style={{ marginBottom: 20 }}>
                  <div
                    className={`card agreement-card ${checked ? "selected" : ""}`}
                    onClick={() => set(id, !checked)}
                  >
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div className={`checkbox ${checked ? "checked" : ""}`}>
                        {checked && "✓"}
                      </div>
                      <div>
                        <div className="title-sm" style={{ marginBottom: 4 }}>{label}</div>
                        <div className="body-sm">{desc}</div>
                      </div>
                    </div>
                  </div>
                  {errors[id] && <div className="field-error">{errors[id]}</div>}
                </div>
              );
              })}
              <div className="field">
                <label>
                  Character Challenges or Counselling Needs{" "}
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal", color: "var(--muted-soft)" }}>(Optional)</span>
                </label>
                <textarea rows={4} placeholder="Share anything you feel comfortable sharing..." value={form.characterChallenges} onChange={e=>set("characterChallenges", e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="display-sm" style={{ marginBottom: 8 }}>Referee Information</h2>
              <p className="body-sm" style={{ marginBottom: 32 }}>Please provide a referee who knows you and can speak to your character.</p>
              <EnrollField label="Referee's Full Name" placeholder="Full name" {...field("refereeName")} />
              <EnrollField label="Referee's Mobile Number" placeholder="+234 xxx xxx xxxx" {...field("refereePhone")} />
              <div className="card" style={{ marginTop: 8, background: "var(--canvas-soft)" }}>
                <div className="caption-uppercase" style={{ marginBottom: 8 }}>Review Before Submitting</div>
                <div className="review-grid">
                  {[
                    ["Name", `${form.firstName} ${form.surname}`],
                    ["Email", form.email],
                    ["Mode", form.modeOfEnrollment],
                    ["Gate", form.gateOfInfluence],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="review-key">{k}</div>
                      <div className="review-val">{v || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              {errors.form && <div className="error-banner">{errors.form}</div>}
            </div>
          )}

          <div className="form-nav">
            <button className="btn-ghost" onClick={back} style={{ visibility: step === 0 ? "hidden" : "visible" }}>← Back</button>
            <span className="caption">{step + 1} of {STEPS.length}</span>
            {step < 3
              ? <button className="btn-primary" onClick={next}>Continue →</button>
              : <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? "Saving…" : `Continue to Payment (${formatNaira(REGISTRATION_FEE_NGN)})`}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
