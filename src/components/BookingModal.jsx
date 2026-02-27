// ─── components/BookingModal.jsx ──────────────────────────────────────────────
import React, { useState } from "react";
import { ALL_TESTS, catName, fmt, genRef } from "../data.js";
import PaymentPage from "./PaymentPage.jsx";

export default function BookingModal({ initialTest, onClose, onSave }) {
  const [step, setSaving_step] = useState(1);
  const [saving, setSaving]   = useState(false);
  const [done, setDone]       = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [ref, setRef]         = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    age:       "",
    gender:    "",
    phone:     "",
    email:     "",
    test:       initialTest?.id || "",
    collection: "home",
    date:       "",
    time:       "7-9am",
    address:    "",
    notes:      "",
  });

  const selTest    = ALL_TESTS.find((t) => t.id === form.test) || initialTest;
  const totalPrice = selTest ? selTest.price + (form.collection === "home" ? 1500 : 0) : 0;

  const next = () => {
    if (step === 1 && (!form.firstName || !form.lastName || !form.age || !form.gender || !form.phone)) {
      alert("Fill all required fields.");
      return;
    }
    if (step === 2 && (!form.test || !form.date)) {
      alert("Select a test and date.");
      return;
    }
    setSaving_step((s) => s + 1);
  };

  const submit = async () => {
    setSaving(true);
    const newRef = genRef();
    const booking = {
      ref:        newRef,
      name:       `${form.firstName} ${form.lastName}`,
      age:        form.age,
      gender:     form.gender,
      phone:      form.phone,
      email:      form.email,
      test:       selTest?.name || form.test,
      testId:     form.test,
      category:   catName(selTest?.cat || ""),
      collection: form.collection === "home" ? "Home Collection" : "Walk-in",
      date:       form.date,
      time:       form.time,
      address:    form.address,
      notes:      form.notes,
      price:      totalPrice,
      status:     "awaiting_payment",
      createdAt:  new Date().toISOString(),
    };
    setSaving(false);
    setPendingBooking(booking);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (payInfo) => {
    const booking = { ...pendingBooking, status:"pending", paymentMethod: payInfo.method, paymentRef: payInfo.transactionRef };
    await onSave(booking);
    setRef(booking.ref);
    setShowPayment(false);
    setDone(true);
  };

  if (showPayment && pendingBooking) {
    return <PaymentPage booking={pendingBooking} onSuccess={handlePaymentSuccess} onBack={()=>setShowPayment(false)} />;
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {!done ? (
          <>
            <h2>Book a Test</h2>
            <div className="modal-sub">
              Step {step} of 3 — {step === 1 ? "Your Details" : step === 2 ? "Test & Schedule" : "Review & Confirm"}
            </div>

            {/* Steps bar */}
            <div className="steps-bar">
              <div className={`step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
                <div className="step-num">{step > 1 ? "✓" : "1"}</div>Details
              </div>
              <div className={`step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
                <div className="step-num">{step > 2 ? "✓" : "2"}</div>Test
              </div>
              <div className={`step-item ${step >= 3 ? "active" : ""}`}>
                <div className="step-num">3</div>Confirm
              </div>
            </div>

            {/* ── Step 1: Personal Details ── */}
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
                <button className="btn" onClick={next}>Continue →</button>
              </>
            )}

            {/* ── Step 2: Test & Schedule ── */}
            {step === 2 && (
              <>
                <div className="fgroup">
                  <label>Select Test <span className="req">*</span></label>
                  <div className="sel-wrap">
                    <select value={form.test} onChange={(e) => setForm({ ...form, test: e.target.value })}>
                      <option value="">Choose a test...</option>
                      {ALL_TESTS.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} — {fmt(t.price)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="fgroup">
                  <label>Collection Type</label>
                  <div className="sel-wrap">
                    <select value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })}>
                      <option value="home">Home Collection (+₦1,500)</option>
                      <option value="walkin">Walk-in — Nearest Centre</option>
                    </select>
                  </div>
                </div>
                <div className="frow">
                  <div className="fgroup">
                    <label>Date <span className="req">*</span></label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="fgroup">
                    <label>Time Slot</label>
                    <div className="sel-wrap">
                      <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                        <option value="7-9am">7:00–9:00 AM</option>
                        <option value="9-11am">9:00–11:00 AM</option>
                        <option value="11am-1pm">11:00 AM–1:00 PM</option>
                        <option value="2-4pm">2:00–4:00 PM</option>
                        <option value="4-6pm">4:00–6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                {form.collection === "home" && (
                  <div className="fgroup">
                    <label>Home Address</label>
                    <input placeholder="12 Bode Thomas St, Surulere, Lagos" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                )}
                <div className="fgroup">
                  <label>Clinical Notes</label>
                  <textarea rows="2" placeholder="e.g. fasting since 8 PM, on medication..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn sec" style={{ marginTop: 0 }} onClick={() => setSaving_step(1)}>← Back</button>
                  <button className="btn" style={{ marginTop: 0 }} onClick={next}>Review →</button>
                </div>
              </>
            )}

            {/* ── Step 3: Review & Confirm ── */}
            {step === 3 && (
              <>
                <div style={{ background: "var(--cream)", borderRadius: 10, padding: 18, marginBottom: 16, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Booking Summary</div>
                  {[
                    ["Patient",    `${form.firstName} ${form.lastName}, ${form.age} yrs (${form.gender})`],
                    ["Contact",    `${form.phone}${form.email ? " · " + form.email : ""}`],
                    ["Test",       selTest?.name || "—"],
                    ["Collection", form.collection === "home" ? "Home Collection" : "Walk-in"],
                    ["Date & Time",`${form.date} · ${form.time}`],
                    form.address && ["Address", form.address],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--muted)", minWidth: 80 }}>{k}:</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
                    <span>Total Amount</span>
                    <span style={{ color: "var(--teal)" }}>{fmt(totalPrice)}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", background: "rgba(0,168,150,0.05)", border: "1px solid rgba(0,168,150,0.2)", borderRadius: 8, padding: 12, marginBottom: 16, lineHeight: 1.6 }}>
                  📋 By confirming, you agree the information is accurate. Your report will be delivered to the registered contact.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn sec" style={{ marginTop: 0 }} onClick={() => setSaving_step(2)}>← Edit</button>
                  <button className="btn" style={{ marginTop: 0 }} onClick={submit} disabled={saving}>
                    {saving ? "Saving..." : "✓ Confirm Booking"}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          /* ── Success Screen ── */
          <div className="success-box">
            <div className="succ-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Your booking reference number is:</p>
            <div className="ref-box">{ref}</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>
              You'll receive a confirmation SMS and email shortly. Our team will contact you before your scheduled appointment.
            </p>
            <button className="btn" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
