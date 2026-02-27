// ─── components/AdminLoginPage.jsx ───────────────────────────────────────────
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

export default function AdminLoginPage({ onSuccess, switchToPatient }) {
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Fill all fields."); return; }
    const res = loginAdmin(form.email, form.password);
    if (res.error) setError(res.error);
    else onSuccess();
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--navy)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"white", borderRadius:20, padding:40, width:"100%", maxWidth:400, boxShadow:"0 32px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, background:"var(--red)", borderRadius:14, display:"grid", placeItems:"center", margin:"0 auto 12px", fontSize:20, fontWeight:900, color:"white", fontFamily:"'DM Serif Display',serif" }}>🛡️</div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, marginBottom:4 }}>Admin Portal</h1>
          <p style={{ fontSize:13, color:"var(--muted)" }}>ProHealth Nexus Administration</p>
        </div>

        <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:20, fontSize:12, color:"#92620a" }}>
          🔑 Demo credentials: admin@prohealth.com / admin123
        </div>

        {error && (
          <div style={{ background:"rgba(232,87,74,0.08)", border:"1px solid rgba(232,87,74,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:"var(--red)" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="fgroup"><label>Admin Email</label><input type="email" placeholder="admin@prohealth.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        <div className="fgroup"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>

        <button className="btn" onClick={submit} style={{ background:"var(--navy)", marginTop:8 }}>Sign In as Admin →</button>

        <div style={{ textAlign:"center", marginTop:20 }}>
          <button onClick={switchToPatient} style={{ background:"none", border:"none", color:"var(--teal)", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            ← Back to Patient Login
          </button>
        </div>
      </div>
    </div>
  );
}
