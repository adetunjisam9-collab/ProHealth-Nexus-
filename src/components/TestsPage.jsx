// ─── components/TestsPage.jsx ─────────────────────────────────────────────────
import React, { useState } from "react";
import { ALL_TESTS, CATEGORIES, catName, tagClass, tagLabel, fmt } from "../data.js";

export default function TestsPage({ onBook }) {
  const [searchQ, setSearchQ]   = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const filtered = ALL_TESTS.filter((t) => {
    const matchCat = filterCat === "all" || t.cat === filterCat;
    const matchQ   = !searchQ ||
      t.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      catName(t.cat).toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <div className="page-header">
        <h1>All Diagnostic Tests</h1>
        <p>Browse and book from our full catalogue of {ALL_TESTS.length}+ tests</p>
      </div>

      <div className="main">
        {/* Search */}
        <input
          className="search-bar"
          placeholder="🔍  Search tests by name or category..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {/* Category Filters */}
        <div className="filter-bar">
          <button
            className={`filter-chip ${filterCat === "all" ? "active" : ""}`}
            onClick={() => setFilterCat("all")}
          >
            All Tests
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`filter-chip ${filterCat === c.id ? "active" : ""}`}
              onClick={() => setFilterCat(c.id)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔬</div>
            <h3>No tests found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="all-tests-list">
            {filtered.map((t) => (
              <div key={t.id} className="test-card" onClick={() => onBook(t)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span className={`tag ${tagClass[t.tag]}`}>{tagLabel[t.tag]}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>{fmt(t.price)}</span>
                </div>
                <div className="test-name" style={{ fontSize: 14, marginBottom: 5 }}>{t.name}</div>
                <div className="test-meta" style={{ marginBottom: 10 }}>{catName(t.cat)} · {t.sample}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>{t.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>⏱ {t.hours}</span>
                  <button
                    className="btn sm"
                    onClick={(e) => { e.stopPropagation(); onBook(t); }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
