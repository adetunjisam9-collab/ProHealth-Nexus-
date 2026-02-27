// ─── components/AuthPage.jsx ──────────────────────────────────────────────────
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

export default function AuthPage({ onSuccess, switchToAdmin, onBack, initialTab = "login" }) {
  const { loginPatient, signupPatient } = useAuth();
  const [mode, setMode]   = useState(initialTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", confirm:"" });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (mode === "login") {
        if (!form.email || !form.password) { setError("Please fill all fields."); setLoading(false); return; }
        const res = loginPatient(form.email, form.password);
        if (res.error) { setError(res.error); setLoading(false); }
        else onSuccess();
      } else {
        if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) { setError("Please fill all required fields."); setLoading(false); return; }
        if (form.password !== form.confirm) { setError("Passwords do not match."); setLoading(false); return; }
        if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
        const res = signupPatient({ firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, password:form.password });
        if (res.error) { setError(res.error); setLoading(false); }
        else onSuccess();
      }
    }, 500);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--navy)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,168,150,0.12) 0%, transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />

      <div style={{ background:"white", borderRadius:20, padding:40, width:"100%", maxWidth:440, boxShadow:"0 32px 80px rgba(0,0,0,0.35)", position:"relative", zIndex:1 }}>

        {/* Back button */}
        {onBack && (
          <button onClick={onBack} style={{ position:"absolute", top:16, left:16, background:"var(--cream)", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:"var(--muted)", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            ← Back
          </button>
        )}

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, background:"var(--teal)", borderRadius:14, display:"grid", placeItems:"center", margin:"0 auto 12px", fontSize:18, fontWeight:900, color:"white", fontFamily:"'DM Serif Display',serif", letterSpacing:1, boxShadow:"0 4px 16px rgba(0,168,150,0.35)" }}>
            PHN
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, marginBottom:4 }}>ProHealth Nexus</h1>
          <p style={{ fontSize:13, color:"var(--muted)" }}>{mode==="login" ? "Welcome back! Sign in to continue" : "Create your free patient account"}</p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"var(--cream)", borderRadius:8, padding:4, marginBottom:24 }}>
          {[["login","Sign In"],["signup","Sign Up"]].map(([m,label]) => (
            <button key={m} onClick={()=>{ setMode(m); setError(""); }}
              style={{ flex:1, padding:"9px", border:"none", borderRadius:6, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, background:mode===m?"white":"transparent", color:mode===m?"var(--navy)":"var(--muted)", boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.1)":"none", transition:"all .2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"rgba(232,87,74,0.08)", border:"1px solid rgba(232,87,74,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:"var(--red)", display:"flex", alignItems:"center", gap:8 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Sign Up Fields */}
        {mode === "signup" && (
          <div className="frow">
            <div className="fgroup"><label>First Name <span className="req">*</span></label><input placeholder="Adebayo" value={form.firstName} onChange={e=>set("firstName",e.target.value)} /></div>
            <div className="fgroup"><label>Last Name <span className="req">*</span></label><input placeholder="Okafor" value={form.lastName} onChange={e=>set("lastName",e.target.value)} /></div>
          </div>
        )}

        <div className="fgroup">
          <label>Email Address <span className="req">*</span></label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>

        {mode === "signup" && (
          <div className="fgroup">
            <label>Phone Number <span className="req">*</span></label>
            <input placeholder="+234 800 000 0000" value={form.phone} onChange={e=>set("phone",e.target.value)} />
          </div>
        )}

        <div className="fgroup">
          <label>Password <span className="req">*</span></label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>

        {mode === "signup" && (
          <div className="fgroup">
            <label>Confirm Password <span className="req">*</span></label>
            <input type="password" placeholder="••••••••" value={form.confirm} onChange={e=>set("confirm",e.target.value)} />
          </div>
        )}

        <button className="btn" onClick={submit} disabled={loading} style={{ opacity:loading?0.7:1 }}>
          {loading ? "Please wait..." : mode==="login" ? "Sign In →" : "Create Account →"}
        </button>

        {/* Admin link */}
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--muted)" }}>
          <button onClick={switchToAdmin} style={{ background:"none", border:"none", color:"var(--teal)", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            Admin Login →
          </button>
        </div>
      </div>
    </div>
  );
}
