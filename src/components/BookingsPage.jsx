// ─── components/BookingsPage.jsx ──────────────────────────────────────────────
import React, { useState } from "react";
import { fmt } from "../data.js";

export default function BookingsPage({ bookings, loading, onCancel, onBook }) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View, track, and manage all your registered medical tests</p>
      </div>

      <div className="main">
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                className={`filter-chip ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn sm" onClick={onBook}>+ New Booking</button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{filter === "all" ? "No bookings yet" : `No ${filter} bookings`}</h3>
            <p style={{ marginBottom: 20 }}>
              {filter === "all"
                ? "Register your first medical test to get started."
                : "Try a different filter."}
            </p>
            {filter === "all" && (
              <button className="btn sm" onClick={onBook}>Book a Test</button>
            )}
          </div>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Patient</th>
                  <th>Test</th>
                  <th>Date &amp; Time</th>
                  <th>Collection</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.ref}>
                    <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>
                      {b.ref}
                    </td>
                    <td>
                      {b.name}
                      <br />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{b.phone}</span>
                    </td>
                    <td style={{ maxWidth: 160 }}>
                      <div style={{ fontWeight: 500 }}>{b.test}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{b.category}</div>
                    </td>
                    <td>
                      {b.date}
                      <br />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{b.time}</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{b.collection}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(b.price)}</td>
                    <td>
                      <span className={`status-badge s-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      {b.status === "pending" || b.status === "confirmed" ? (
                        <button
                          className="btn sm danger"
                          onClick={() => {
                            if (window.confirm("Cancel this booking?")) onCancel(b.ref);
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
