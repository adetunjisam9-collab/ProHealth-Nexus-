// ─── components/AdminDashboard.jsx ───────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { fmt } from "../data.js";

const TABS = ["Overview", "Bookings", "Appointments", "Patients", "Doctors"];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [tab, setTab]           = useState("Overview");
  const [bookings, setBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const bks = Object.keys(localStorage).filter(k=>k.startsWith("medtest_")).map(k=>JSON.parse(localStorage.getItem(k))).filter(Boolean);
    const apts = JSON.parse(localStorage.getItem("phn_appointments") || "[]");
    const pts  = JSON.parse(localStorage.getItem("phn_patients") || "[]");
    setBookings(bks.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
    setAppointments(apts.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
    setPatients(pts);
  }, [tab]);

  const updateBookingStatus = (ref, status) => {
    const key = `medtest_${ref}`;
    const b = JSON.parse(localStorage.getItem(key));
    if (!b) return;
    localStorage.setItem(key, JSON.stringify({ ...b, status }));
    setBookings(prev => prev.map(bk => bk.ref === ref ? { ...bk, status } : bk));
  };

  const updateApptStatus = (id, status) => {
    const apts = JSON.parse(localStorage.getItem("phn_appointments") || "[]");
    const updated = apts.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem("phn_appointments", JSON.stringify(updated));
    setAppointments(updated.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
  };

  const totalRevenue = bookings.filter(b=>b.status!=="cancelled").reduce((s,b)=>s+b.price,0);

  const stats = [
    { label:"Total Patients",     value: patients.length,                           icon:"👥", color:"#e8f8f7" },
    { label:"Total Bookings",     value: bookings.length,                            icon:"📋", color:"#f0f4ff" },
    { label:"Appointments",       value: appointments.length,                        icon:"🗓️", color:"#fff8e8" },
    { label:"Revenue",            value: fmt(totalRevenue),                          icon:"💰", color:"#e8fff2" },
    { label:"Pending Bookings",   value: bookings.filter(b=>b.status==="pending").length,   icon:"⏳", color:"#fef0ee" },
    { label:"Pending Appts",      value: appointments.filter(a=>a.status==="pending").length, icon:"🔔", color:"#fef4f4" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", display:"flex" }}>
      {/* Sidebar */}
      <div style={{ width:220, background:"var(--navy)", padding:"24px 0", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:"var(--teal)", borderRadius:10, display:"grid", placeItems:"center", fontSize:14, fontWeight:900, color:"white", fontFamily:"'DM Serif Display',serif" }}>PHN</div>
            <div>
              <div style={{ color:"white", fontWeight:600, fontSize:13 }}>ProHealth Nexus</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>Admin Portal</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"16px 12px" }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ width:"100%", textAlign:"left", padding:"10px 12px", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, marginBottom:4, background: tab===t?"rgba(0,168,150,0.2)":"none", color: tab===t?"var(--teal-l)":"rgba(255,255,255,0.6)", transition:"all .2s" }}>
              {{ Overview:"📊", Bookings:"📋", Appointments:"🗓️", Patients:"👥", Doctors:"👨‍⚕️" }[t]} {t}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={logout} style={{ width:"100%", padding:"10px 12px", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, background:"rgba(232,87,74,0.15)", color:"#ff8a80" }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"36px 40px", overflowY:"auto" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, marginBottom:4 }}>{tab}</h1>
          <p style={{ fontSize:13, color:"var(--muted)" }}>ProHealth Nexus Administration Panel</p>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:12, padding:"20px 24px" }}>
                  <div style={{ width:40, height:40, background:s.color, borderRadius:10, display:"grid", placeItems:"center", fontSize:18, marginBottom:12 }}>{s.icon}</div>
                  <div style={{ fontSize:24, fontWeight:700, fontFamily:"'DM Serif Display',serif", marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:12, padding:24 }}>
                <div style={{ fontWeight:700, marginBottom:16 }}>Recent Bookings</div>
                {bookings.slice(0,5).map(b => (
                  <div key={b.ref} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                    <div><div style={{ fontSize:13, fontWeight:500 }}>{b.name}</div><div style={{ fontSize:11, color:"var(--muted)" }}>{b.test}</div></div>
                    <span className={`status-badge s-${b.status}`}>{b.status}</span>
                  </div>
                ))}
                {bookings.length===0 && <div style={{ fontSize:13, color:"var(--muted)", textAlign:"center", padding:20 }}>No bookings yet</div>}
              </div>
              <div style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:12, padding:24 }}>
                <div style={{ fontWeight:700, marginBottom:16 }}>Recent Appointments</div>
                {appointments.slice(0,5).map(a => (
                  <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                    <div><div style={{ fontSize:13, fontWeight:500 }}>{a.patientName}</div><div style={{ fontSize:11, color:"var(--muted)" }}>Dr. {a.doctorName}</div></div>
                    <span className={`status-badge s-${a.status}`}>{a.status}</span>
                  </div>
                ))}
                {appointments.length===0 && <div style={{ fontSize:13, color:"var(--muted)", textAlign:"center", padding:20 }}>No appointments yet</div>}
              </div>
            </div>
          </>
        )}

        {/* ── BOOKINGS ── */}
        {tab === "Bookings" && (
          <div className="bookings-table">
            <table>
              <thead><tr><th>Ref</th><th>Patient</th><th>Test</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {bookings.length === 0 && <tr><td colSpan={7} style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>No bookings found</td></tr>}
                {bookings.map(b => (
                  <tr key={b.ref}>
                    <td style={{ fontFamily:"monospace", fontSize:11, fontWeight:700 }}>{b.ref}</td>
                    <td>{b.name}<br/><span style={{ fontSize:11, color:"var(--muted)" }}>{b.phone}</span></td>
                    <td style={{ fontSize:12 }}>{b.test}</td>
                    <td style={{ fontSize:12 }}>{b.date}</td>
                    <td style={{ fontWeight:700 }}>{fmt(b.price)}</td>
                    <td><span className={`status-badge s-${b.status}`}>{b.status}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:4 }}>
                        {b.status === "pending"   && <button className="btn sm" style={{ fontSize:11, padding:"4px 8px" }} onClick={()=>updateBookingStatus(b.ref,"confirmed")}>Confirm</button>}
                        {b.status === "confirmed" && <button className="btn sm" style={{ fontSize:11, padding:"4px 8px", background:"var(--navy)" }} onClick={()=>updateBookingStatus(b.ref,"completed")}>Complete</button>}
                        {(b.status==="pending"||b.status==="confirmed") && <button className="btn sm danger" style={{ fontSize:11, padding:"4px 8px" }} onClick={()=>updateBookingStatus(b.ref,"cancelled")}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── APPOINTMENTS ── */}
        {tab === "Appointments" && (
          <div className="bookings-table">
            <table>
              <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Speciality</th><th>Reason</th><th>Date Requested</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {appointments.length === 0 && <tr><td colSpan={8} style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>No appointment requests yet</td></tr>}
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily:"monospace", fontSize:11, fontWeight:700 }}>{a.id}</td>
                    <td>{a.patientName}<br/><span style={{ fontSize:11, color:"var(--muted)" }}>{a.patientPhone}</span></td>
                    <td style={{ fontWeight:500 }}>Dr. {a.doctorName}</td>
                    <td style={{ fontSize:12 }}>{a.speciality}</td>
                    <td style={{ fontSize:12, maxWidth:140 }}>{a.reason}</td>
                    <td style={{ fontSize:12 }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className={`status-badge s-${a.status}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:4 }}>
                        {a.status==="pending" && <>
                          <button className="btn sm" style={{ fontSize:11, padding:"4px 8px" }} onClick={()=>updateApptStatus(a.id,"confirmed")}>Confirm</button>
                          <button className="btn sm danger" style={{ fontSize:11, padding:"4px 8px" }} onClick={()=>updateApptStatus(a.id,"cancelled")}>Decline</button>
                        </>}
                        {a.status==="confirmed" && <button className="btn sm" style={{ fontSize:11, padding:"4px 8px", background:"var(--navy)" }} onClick={()=>updateApptStatus(a.id,"completed")}>Complete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {tab === "Patients" && (
          <div className="bookings-table">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th>Bookings</th></tr></thead>
              <tbody>
                {patients.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>No registered patients yet</td></tr>}
                {patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily:"monospace", fontSize:11, fontWeight:700 }}>{p.id}</td>
                    <td style={{ fontWeight:500 }}>{p.firstName} {p.lastName}</td>
                    <td style={{ fontSize:12 }}>{p.email}</td>
                    <td style={{ fontSize:12 }}>{p.phone}</td>
                    <td style={{ fontSize:12 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight:700 }}>{bookings.filter(b=>b.patientEmail===p.email).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── DOCTORS ── */}
        {tab === "Doctors" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {DOCTORS.map(d => (
              <div key={d.id} style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:12, padding:24, textAlign:"center" }}>
                <div style={{ width:64, height:64, background:d.color, borderRadius:50, display:"grid", placeItems:"center", fontSize:28, margin:"0 auto 14px" }}>{d.avatar}</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Dr. {d.name}</div>
                <div style={{ fontSize:12, color:"var(--teal)", fontWeight:500, marginBottom:8 }}>{d.speciality}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:12 }}>{d.experience} experience</div>
                <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
                  <span style={{ background:"rgba(0,168,150,0.1)", color:"var(--teal)", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>
                    ⭐ {d.rating}
                  </span>
                  <span style={{ background:"var(--cream)", color:"var(--muted)", padding:"3px 10px", borderRadius:20, fontSize:11 }}>
                    {appointments.filter(a=>a.doctorId===d.id).length} appts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const DOCTORS = [
  { id:"d1", name:"Amaka Obi",       speciality:"General Practice",  experience:"8 years",  rating:4.8, avatar:"👩‍⚕️", color:"#e8f8f7" },
  { id:"d2", name:"Emeka Nwosu",     speciality:"Cardiology",        experience:"12 years", rating:4.9, avatar:"👨‍⚕️", color:"#f0f4ff" },
  { id:"d3", name:"Fatima Bello",    speciality:"Endocrinology",     experience:"7 years",  rating:4.7, avatar:"👩‍⚕️", color:"#fff8e8" },
  { id:"d4", name:"Chidi Eze",       speciality:"Haematology",       experience:"10 years", rating:4.8, avatar:"👨‍⚕️", color:"#fef0ee" },
  { id:"d5", name:"Ngozi Adeyemi",   speciality:"Microbiology",      experience:"6 years",  rating:4.6, avatar:"👩‍⚕️", color:"#e8fff2" },
  { id:"d6", name:"Tunde Fashola",   speciality:"Radiology",         experience:"15 years", rating:4.9, avatar:"👨‍⚕️", color:"#fef4f4" },
];
