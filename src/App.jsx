// ─── App.jsx ──────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth }  from "./AuthContext.jsx";
import Header         from "./components/Header.jsx";
import HomePage       from "./components/HomePage.jsx";
import TestsPage      from "./components/TestsPage.jsx";
import TrackPage      from "./components/TrackPage.jsx";
import BookingsPage   from "./components/BookingsPage.jsx";
import BookingModal   from "./components/BookingModal.jsx";
import DoctorsPage    from "./components/DoctorsPage.jsx";
import AuthPage       from "./components/AuthPage.jsx";
import AdminLoginPage from "./components/AdminLoginPage.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

// ── localStorage database ─────────────────────────────────────────────────────
const DB_PREFIX = "medtest_";
const db = {
  list:   ()          => Object.keys(localStorage).filter(k=>k.startsWith(DB_PREFIX)).map(k=>JSON.parse(localStorage.getItem(k))).filter(Boolean),
  set:    (ref,b)     => localStorage.setItem(`${DB_PREFIX}${ref}`, JSON.stringify(b)),
  update: (ref,patch) => { const e=JSON.parse(localStorage.getItem(`${DB_PREFIX}${ref}`)||"null"); if(e) localStorage.setItem(`${DB_PREFIX}${ref}`,JSON.stringify({...e,...patch})); },
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}`}>
      <span>{toast.type==="success"?"✓":"✕"}</span> {toast.msg}
    </div>
  );
}

// ── Landing Page (shown to logged-out users) ──────────────────────────────────
function LandingPage({ onGetStarted, onAdminLogin }) {
  return (
    <div style={{ minHeight:"100vh", background:"var(--navy)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,168,150,0.15) 0%, transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:48, position:"relative", zIndex:1 }}>
        <div style={{ width:72, height:72, background:"var(--teal)", borderRadius:18, display:"grid", placeItems:"center", margin:"0 auto 16px", fontSize:22, fontWeight:900, color:"white", fontFamily:"'DM Serif Display',serif", letterSpacing:1, boxShadow:"0 8px 32px rgba(0,168,150,0.4)" }}>
          PHN
        </div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:48, color:"white", marginBottom:8, lineHeight:1.1 }}>
          ProHealth <em style={{ color:"var(--teal-l)", fontStyle:"italic" }}>Nexus</em>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:16, maxWidth:480, margin:"0 auto", lineHeight:1.75 }}>
          Your complete healthcare platform — book diagnostic tests, connect with specialist doctors, and manage your health all in one place.
        </p>
      </div>

      {/* Feature Pills */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:48, position:"relative", zIndex:1 }}>
        {["🩺 Book Medical Tests","👨‍⚕️ Connect with Doctors","📋 Track Reports","💊 Manage Health Records"].map(f => (
          <div key={f} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 18px", color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:500 }}>
            {f}
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div style={{ display:"flex", gap:14, position:"relative", zIndex:1, flexWrap:"wrap", justifyContent:"center" }}>
        <button onClick={()=>onGetStarted("signup")}
          style={{ padding:"14px 36px", background:"var(--teal)", color:"white", border:"none", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:700, cursor:"pointer", transition:"all .2s", boxShadow:"0 4px 20px rgba(0,168,150,0.4)" }}
          onMouseEnter={e=>e.target.style.background="var(--teal-l)"}
          onMouseLeave={e=>e.target.style.background="var(--teal)"}>
          Create Free Account →
        </button>
        <button onClick={()=>onGetStarted("login")}
          style={{ padding:"14px 36px", background:"rgba(255,255,255,0.08)", color:"white", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:600, cursor:"pointer", transition:"all .2s" }}
          onMouseEnter={e=>{ e.target.style.background="rgba(255,255,255,0.15)"; }}
          onMouseLeave={e=>{ e.target.style.background="rgba(255,255,255,0.08)"; }}>
          Sign In
        </button>
      </div>

      {/* Admin link */}
      <button onClick={onAdminLogin}
        style={{ marginTop:32, background:"none", border:"none", color:"rgba(255,255,255,0.3)", fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", position:"relative", zIndex:1 }}>
        Admin Portal →
      </button>

      {/* Stats */}
      <div style={{ display:"flex", gap:48, marginTop:56, position:"relative", zIndex:1 }}>
        {[["200+","Diagnostic Tests"],["6","Specialist Doctors"],["98.7%","Accuracy Rate"],["24hr","Report Turnaround"]].map(([n,l])=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"white" }}>{n}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inner App ─────────────────────────────────────────────────────────────────
function InnerApp() {
  const { patient, admin } = useAuth();
  const [page, setPage]           = useState("home");
  const [authMode, setAuthMode]   = useState("patient"); // patient | admin
  const [authTab, setAuthTab]     = useState("login");   // login | signup
  const [bookings, setBookings]   = useState([]);
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    if (patient) {
      const all = db.list().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
      setBookings(all);
    }
  }, [patient]);

  const saveBooking = (b) => {
    db.set(b.ref, b);
    setBookings(prev=>[b,...prev]);
  };

  const cancelBooking = (ref) => {
    db.update(ref,{status:"cancelled"});
    setBookings(prev=>prev.map(b=>b.ref===ref?{...b,status:"cancelled"}:b));
    showToast("Booking cancelled.","error");
  };

  const showToast = (msg,type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3500);
  };

  const closeModal = () => setModal(null);
  const activeCount = bookings.filter(b=>b.status!=="cancelled").length;

  // ── 1. Admin dashboard ──────────────────────────────────────────────────────
  if (admin) return <AdminDashboard />;

  // ── 2. Admin login screen ───────────────────────────────────────────────────
  if (authMode === "admin") {
    return <AdminLoginPage onSuccess={()=>{}} switchToPatient={()=>setAuthMode("patient")} />;
  }

  // ── 3. Not logged in — show landing page or auth page ──────────────────────
  if (!patient) {
    if (page === "auth") {
      return (
        <AuthPage
          initialTab={authTab}
          onSuccess={()=>setPage("home")}
          switchToAdmin={()=>setAuthMode("admin")}
          onBack={()=>setPage("landing")}
        />
      );
    }
    // Default: show landing
    return (
      <LandingPage
        onGetStarted={(tab)=>{ setAuthTab(tab); setPage("auth"); }}
        onAdminLogin={()=>setAuthMode("admin")}
      />
    );
  }

  // ── 4. Logged-in patient app ────────────────────────────────────────────────
  return (
    <div className="app">
      <Header page={page} setPage={setPage} bookingCount={activeCount} />

      {page==="home"     && <HomePage    bookings={bookings} selectedCat={selectedCat} setSelectedCat={setSelectedCat} onBook={t=>setModal({type:"book",test:t})} onViewAll={()=>setPage("tests")} />}
      {page==="tests"    && <TestsPage   onBook={t=>setModal({type:"book",test:t})} />}
      {page==="doctors"  && <DoctorsPage />}
      {page==="track"    && <TrackPage   bookings={bookings} />}
      {page==="bookings" && <BookingsPage bookings={bookings} onCancel={cancelBooking} onBook={()=>setModal({type:"book",test:null})} />}

      <footer>© 2026 <span>ProHealth Nexus</span> · All Rights Reserved · NAFDAC Certified · ISO 15189 Accredited</footer>

      {modal?.type==="book" && (
        <BookingModal
          initialTest={modal.test}
          onClose={closeModal}
          onSave={(b)=>{ saveBooking(b); closeModal(); showToast(`Booking confirmed! Ref: ${b.ref}`,"success"); setPage("bookings"); }}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
