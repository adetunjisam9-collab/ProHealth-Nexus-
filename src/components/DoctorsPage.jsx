// ─── components/DoctorsPage.jsx ───────────────────────────────────────────────
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { DOCTORS } from "./AdminDashboard.jsx";

export default function DoctorsPage() {
  const { patient } = useAuth();
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ reason:"", preferredDate:"", preferredTime:"", notes:"" });
  const [done, setDone]         = useState(false);
  const [apptId, setApptId]     = useState("");
  const [filterSpec, setFilterSpec] = useState("all");

  const specialities = ["all", ...new Set(DOCTORS.map(d=>d.speciality))];

  const filtered = filterSpec === "all" ? DOCTORS : DOCTORS.filter(d=>d.speciality===filterSpec);

  const submitRequest = () => {
    if (!form.reason || !form.preferredDate) { alert("Please fill reason and preferred date."); return; }
    const apts = JSON.parse(localStorage.getItem("phn_appointments") || "[]");
    const id   = `APT-${Date.now()}`;
    const newApt = {
      id,
      doctorId:     selected.id,
      doctorName:   selected.name,
      speciality:   selected.speciality,
      patientId:    patient?.id || "guest",
      patientName:  patient ? `${patient.firstName} ${patient.lastName}` : "Guest",
      patientEmail: patient?.email || "",
      patientPhone: patient?.phone || "",
      reason:       form.reason,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      notes:        form.notes,
      status:       "pending",
      createdAt:    new Date().toISOString(),
    };
    apts.push(newApt);
    localStorage.setItem("phn_appointments", JSON.stringify(apts));
    setApptId(id);
    setDone(true);
  };

  return (
    <>
      <div className="page-header">
        <h1>Our Doctors</h1>
        <p>Browse specialists and send an appointment request — our team will confirm within 24 hours</p>
      </div>

      <div className="main">
        {/* Filter by speciality */}
        <div className="filter-bar" style={{ marginBottom:24 }}>
          {specialities.map(s => (
            <button key={s} className={`filter-chip ${filterSpec===s?"active":""}`} onClick={()=>setFilterSpec(s)}>
              {s === "all" ? "All Specialities" : s}
            </button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {filtered.map(d => (
            <div key={d.id} style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:14, padding:24, transition:"all .2s", cursor:"pointer" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--teal)"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,168,150,0.12)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:56, height:56, background:d.color, borderRadius:"50%", display:"grid", placeItems:"center", fontSize:26, flexShrink:0 }}>{d.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>Dr. {d.name}</div>
                  <div style={{ fontSize:12, color:"var(--teal)", fontWeight:500 }}>{d.speciality}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <span style={{ background:"rgba(0,168,150,0.1)", color:"var(--teal)", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>⭐ {d.rating}</span>
                <span style={{ background:"var(--cream)", color:"var(--muted)", padding:"3px 10px", borderRadius:20, fontSize:11 }}>{d.experience}</span>
              </div>
              <button className="btn sm" style={{ width:"100%" }} onClick={()=>{ setSelected(d); setDone(false); setForm({ reason:"", preferredDate:"", preferredTime:"", notes:"" }); }}>
                Request Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Request Modal */}
      {selected && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal">
            <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>

            {!done ? (
              <>
                <h2>Request Appointment</h2>
                <div className="modal-sub">Send a request to Dr. {selected.name} · {selected.speciality}</div>

                <div style={{ display:"flex", gap:12, alignItems:"center", background:"var(--cream)", borderRadius:10, padding:14, marginBottom:20 }}>
                  <div style={{ width:44, height:44, background:selected.color, borderRadius:"50%", display:"grid", placeItems:"center", fontSize:22 }}>{selected.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700 }}>Dr. {selected.name}</div>
                    <div style={{ fontSize:12, color:"var(--teal)" }}>{selected.speciality} · ⭐ {selected.rating}</div>
                  </div>
                </div>

                <div className="fgroup">
                  <label>Reason for Visit <span className="req">*</span></label>
                  <input placeholder="e.g. Chest pain, routine checkup, follow-up..." value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} />
                </div>
                <div className="frow">
                  <div className="fgroup">
                    <label>Preferred Date <span className="req">*</span></label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={form.preferredDate} onChange={e=>setForm({...form,preferredDate:e.target.value})} />
                  </div>
                  <div className="fgroup">
                    <label>Preferred Time</label>
                    <div className="sel-wrap">
                      <select value={form.preferredTime} onChange={e=>setForm({...form,preferredTime:e.target.value})}>
                        <option value="">Any time</option>
                        <option>8:00 AM – 10:00 AM</option>
                        <option>10:00 AM – 12:00 PM</option>
                        <option>12:00 PM – 2:00 PM</option>
                        <option>2:00 PM – 4:00 PM</option>
                        <option>4:00 PM – 6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="fgroup">
                  <label>Additional Notes</label>
                  <textarea rows="3" placeholder="Any symptoms, medical history, or extra info..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                </div>

                {!patient && (
                  <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#92620a" }}>
                    ⚠️ You are not logged in. Your request will be submitted as a guest.
                  </div>
                )}

                <button className="btn" onClick={submitRequest}>Send Appointment Request →</button>
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"10px 0" }}>
                <div className="succ-icon">✓</div>
                <h2>Request Sent!</h2>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:8 }}>Your appointment request ID is:</p>
                <div className="ref-box">{apptId}</div>
                <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, marginBottom:20 }}>
                  Dr. {selected.name} will review your request. You'll be notified within 24 hours once confirmed.
                </p>
                <button className="btn" onClick={()=>setSelected(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
