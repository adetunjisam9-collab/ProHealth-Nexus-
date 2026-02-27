// ─── components/TrackPage.jsx ─────────────────────────────────────────────────
import React, { useState } from "react";
import { fmt } from "../data.js";

export default function TrackPage({ bookings }) {
  const [ref, setRef]         = useState("");
  const [result, setResult]   = useState(null);
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (!ref.trim()) return;
    const found = bookings.find(
      (b) => b.ref.toLowerCase() === ref.trim().toLowerCase()
    );
    setResult(found || null);
    setSearched(true);
  };

  return (
    <>
      <div className="page-header">
        <h1>Track Your Report</h1>
        <p>Enter your booking reference number to view test status and results</p>
      </div>

      <div className="main" style={{ display: "flex", justifyContent: "center" }}>
        <div className="track-box">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔎</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 6 }}>
              Find Your Booking
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Your reference number was sent via SMS and email after booking
            </p>
          </div>

          <div className="fgroup">
            <label>Booking Reference Number</label>
            <input
              placeholder="e.g. MT-2026-12345"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <button className="btn" onClick={search}>Track Status →</button>

          {searched && (
            <div className={`track-result ${result ? "found" : "notfound"}`}>
              {result ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Booking Found</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Ref: {result.ref}</div>
                    </div>
                    <span className={`status-badge s-${result.status}`} style={{ marginLeft: "auto" }}>
                      {result.status}
                    </span>
                  </div>
                  <div className="info-grid">
                    <div className="info-item"><label>Patient Name</label><span>{result.name}</span></div>
                    <div className="info-item"><label>Test</label><span>{result.test}</span></div>
                    <div className="info-item"><label>Date</label><span>{result.date}</span></div>
                    <div className="info-item"><label>Time Slot</label><span>{result.time}</span></div>
                    <div className="info-item"><label>Collection</label><span>{result.collection}</span></div>
                    <div className="info-item"><label>Amount</label><span>{fmt(result.price)}</span></div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>❌</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Booking Not Found</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    No record found for <strong>{ref}</strong>. Check and try again.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
