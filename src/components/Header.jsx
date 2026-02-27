// ─── components/Header.jsx ───────────────────────────────────────────────────
import React from "react";
import { useAuth } from "../AuthContext.jsx";

export default function Header({ page, setPage, bookingCount }) {
  const { patient, logout } = useAuth();

  return (
    <header className="hdr">
      <div className="logo" onClick={() => setPage("home")}>
        <div className="logo-icon" style={{ fontSize:13, fontWeight:900, fontFamily:"'DM Serif Display',serif", letterSpacing:0.5 }}>PHN</div>
        <span className="logo-text">ProHealth Nexus</span>
      </div>

      <nav className="nav">
        <button className={`nav-btn ${page==="home"?"active":""}`}     onClick={()=>setPage("home")}>Home</button>
        <button className={`nav-btn ${page==="tests"?"active":""}`}    onClick={()=>setPage("tests")}>All Tests</button>
        <button className={`nav-btn ${page==="doctors"?"active":""}`}  onClick={()=>setPage("doctors")}>Doctors</button>
        <button className={`nav-btn ${page==="track"?"active":""}`}    onClick={()=>setPage("track")}>Track Report</button>

        {patient ? (
          <>
            <button className={`nav-btn ${page==="bookings"?"active":""}`} onClick={()=>setPage("bookings")}>
              My Bookings {bookingCount > 0 && <span className="badge">{bookingCount}</span>}
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:6 }}>
              <div style={{ width:30, height:30, background:"var(--teal)", borderRadius:"50%", display:"grid", placeItems:"center", color:"white", fontSize:12, fontWeight:700 }}>
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>{patient.firstName}</span>
              <button className="nav-btn" onClick={logout} style={{ fontSize:12, padding:"4px 10px", color:"rgba(255,255,255,0.5)" }}>Logout</button>
            </div>
          </>
        ) : (
          <button className="nav-btn primary" onClick={()=>setPage("auth")}>Sign In / Sign Up</button>
        )}
      </nav>
    </header>
  );
}
