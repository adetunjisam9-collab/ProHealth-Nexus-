// ─── components/HomePage.jsx ─────────────────────────────────────────────────
import React, { useState } from "react";
import { ALL_TESTS, CATEGORIES, catName, tagClass, tagLabel, fmt } from "../data.js";

// ── Quick Registration Steps ──────────────────────────────────────────────────
function QuickStep2({ onBack, onNext }) {
  const [sel, setSel] = useState("");

  return (
    <>
      <div className="fgroup">
        <label>Select Test <span className="req">*</span></label>
        <div className="sel-wrap">
          <select value={sel} onChange={(e) => setSel(e.target.value)}>
            <option value="">Choose a test...</option>
            {ALL_TESTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {fmt(t.price)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fgroup">
        <label>Collection Type <span className="req">*</span></label>
        <div className="sel-wrap">
          <select>
            <option>Home Collection (+₦1,500)</option>
            <option>Walk-in — Nearest Centre</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn sec" style={{ marginTop: 0 }} onClick={onBack}>← Back</button>
        <button className="btn" style={{ marginTop: 0 }} onClick={() => sel ? onNext() : alert("Please select a test.")}>
          Next →
        </button>
      </div>
    </>
  );
}

function QuickStep3({ onBack, onDone }) {
  return (
    <>
      <div className="frow">
        <div className="fgroup">
          <label>Date <span className="req">*</span></label>
          <input type="date" min={new Date().toISOString().split("T")[0]} />
        </div>
        <div className="fgroup">
          <label>Time <span className="req">*</span></label>
          <div className="sel-wrap">
            <select>
              <option>7–9 AM</option>
              <option>9–11 AM</option>
              <option>11 AM–1 PM</option>
              <option>2–4 PM</option>
              <option>4–6 PM</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fgroup">
        <label>Address (if home collection)</label>
        <input placeholder="12 Bode Thomas St, Surulere" />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn sec" style={{ marginTop: 0 }} onClick={onBack}>← Back</button>
        <button className="btn" style={{ marginTop: 0 }} onClick={onDone}>Go to Full Booking →</button>
      </div>
    </>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage({ bookings, selectedCat, setSelectedCat, onBook, onViewAll }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", gender: "", phone: "", email: "",
  });

  const featuredTests = selectedCat
    ? ALL_TESTS.filter((t) => t.cat === selectedCat).slice(0, 6)
    : ALL_TESTS.slice(0, 6);

  const nextStep = () => {
    if (!form.firstName || !form.lastName || !form.age || !form.gender || !form.phone) {
      alert("Please fill all required fields.");
      return;
    }
    setStep(2);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div>
          <div className="hero-tag">⬤ Trusted by 500,000+ patients</div>
          <h1>Book Your Medical Test<br /><em>From Home</em></h1>
          <p>
            Register for diagnostic tests online, choose your preferred collection time,
            and receive certified reports digitally — fast, safe, and hassle-free.
          </p>
          <div className="hero-stats">
            <div><div className="stat-number">200+</div><div className="stat-label">Diagnostic Tests</div></div>
            <div><div className="stat-number">98.7%</div><div className="stat-label">Accuracy Rate</div></div>
            <div><div className="stat-number">24hr</div><div className="stat-label">Avg. Turnaround</div></div>
            <div><div className="stat-number">{bookings.length}</div><div className="stat-label">Active Bookings</div></div>
          </div>
        </div>

        {/* Quick Registration Card */}
        <div className="card">
          <div className="card-title">Quick Registration</div>
          <div className="card-sub">
            Step {step} of 3 — {step === 1 ? "Personal Details" : step === 2 ? "Select Test" : "Schedule"}
          </div>

          <div className="steps-bar">
            <div className={`step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
              <div className="step-num">{step > 1 ? "✓" : "1"}</div>Details
            </div>
            <div className={`step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
              <div className="step-num">{step > 2 ? "✓" : "2"}</div>Test
            </div>
            <div className={`step-item ${step >= 3 ? "active" : ""}`}>
              <div className="step-num">3</div>Schedule
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="frow">
                <div className="fgroup">
                  <label>First Name <span className="req">*</span></label>
                  <input placeholder="Adebayo" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="fgroup">
                  <label>Last Name <span className="req">*</span></label>
                  <input placeholder="Okafor" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="frow">
                <div className="fgroup">
                  <label>Age <span className="req">*</span></label>
                  <input type="number" placeholder="35" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
                <div className="fgroup">
                  <label>Gender <span className="req">*</span></label>
                  <div className="sel-wrap">
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="fgroup">
                <label>Phone <span className="req">*</span></label>
                <input placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="fgroup">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <button className="btn" onClick={nextStep}>Continue to Test Selection →</button>
            </>
          )}

          {step === 2 && <QuickStep2 onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && (
            <QuickStep3
              onBack={() => setStep(2)}
              onDone={() => { setStep(1); setForm({ firstName: "", lastName: "", age: "", gender: "", phone: "", email: "" }); onViewAll(); }}
            />
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="main">
        {/* Categories */}
        <div className="sec-hdr">
          <div className="sec-title">Browse by <span>Category</span></div>
          {selectedCat && (
            <button className="sec-link" onClick={() => setSelectedCat(null)}>Clear filter ✕</button>
          )}
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className={`cat-card ${selectedCat === c.id ? "sel" : ""}`}
              onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
            >
              <div className="cat-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div className="cat-name">{c.name}</div>
              <div className="cat-count">{c.count} tests</div>
            </div>
          ))}
        </div>

        {/* Featured Tests */}
        <div className="sec-hdr">
          <div className="sec-title">
            {selectedCat ? catName(selectedCat) : "Popular"} <span>Tests</span>
          </div>
          <button className="sec-link" onClick={onViewAll}>See all tests →</button>
        </div>
        <div className="tests-grid">
          {featuredTests.map((t) => (
            <div key={t.id} className="test-row" onClick={() => onBook(t)}>
              <div>
                <div className="test-name">{t.name}</div>
                <div className="test-meta">{catName(t.cat)} · Sample: {t.sample}</div>
                <span className={`tag ${tagClass[t.tag]}`}>{tagLabel[t.tag]}</span>
              </div>
              <div>
                <div className="test-price">{fmt(t.price)}</div>
                <div className="test-turn">{t.hours}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="process">
          {[
            { n: "1", title: "Register Online",   desc: "Fill your details and select your required test from our catalogue." },
            { n: "2", title: "Choose Slot",        desc: "Pick your preferred date, time, and home collection or walk-in." },
            { n: "3", title: "Sample Collection",  desc: "A trained phlebotomist collects your sample at home or our centre." },
            { n: "4", title: "Get Report",         desc: "Receive your certified digital report via email and SMS on time." },
          ].map((s) => (
            <div key={s.n} className="proc-step">
              <div className="proc-num">{s.n}</div>
              <div className="proc-title">{s.title}</div>
              <div className="proc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
