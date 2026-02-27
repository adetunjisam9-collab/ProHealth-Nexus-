// ─── components/PaymentPage.jsx ───────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext.jsx";
import { fmt } from "../data.js";

export default function PaymentPage({ booking, onSuccess, onBack }) {
  const { patient }   = useAuth();
  const [method, setMethod]     = useState("paystack");
  const [loading, setLoading]   = useState(false);
  const [scriptReady, setScriptReady] = useState(!!window.PaystackPop);
  const key = import.meta.env.pk_live_e09ffd9408013865421d68e5364249c9362fc6f2VITE_PAYSTACK_KEY;
  const [paystackKey, setPaystackKey] = useState(key || localStorage.getItem("phn_paystack_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [cardForm, setCardForm] = useState({ name:"", number:"", expiry:"", cvv:"" });

  // ── Load Paystack script and wait for it ──────────────────────────────────
  useEffect(() => {
    if (window.PaystackPop) { setScriptReady(true); return; }
    const existing = document.getElementById("paystack-script");
    if (existing) {
      existing.onload = () => setScriptReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id  = "paystack-script";
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => setScriptReady(true);
    s.onerror = () => setScriptReady(false);
    document.head.appendChild(s);
  }, []);

  // ── Save key to localStorage when changed ─────────────────────────────────
  const saveKey = (key) => {
    setPaystackKey(key);
    localStorage.setItem("phn_paystack_key", key);
  };

  // ── Pay with Paystack ─────────────────────────────────────────────────────
  const payWithPaystack = () => {
    const key = paystackKey.trim();

    if (!key || !key.startsWith("pk_")) {
      setShowKeyInput(true);
      return;
    }
    if (!scriptReady || !window.PaystackPop) {
      alert("Paystack is still loading, please wait a moment and try again.");
      return;
    }

    setLoading(true);
    try {
      const handler = window.PaystackPop.setup({
        key,
        email:    patient?.email || booking.email || "patient@prohealth.com",
        amount:   booking.price * 100,
        currency: "NGN",
        ref:      `PHN-${Date.now()}`,
        metadata: { bookingRef: booking.ref, patientName: booking.name },
        callback: (response) => {
          setLoading(false);
          onSuccess({ method:"paystack", transactionRef: response.reference });
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err) {
      setLoading(false);
      alert("Paystack error: " + err.message);
    }
  };

  // ── Pay with card (demo simulation) ──────────────────────────────────────
  const payWithCard = () => {
    if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) {
      alert("Please fill all card details."); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({ method:"card", transactionRef:`CARD-${Date.now()}` });
    }, 2000);
  };

  // ── Bank transfer ─────────────────────────────────────────────────────────
  const payWithTransfer = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({ method:"transfer", transactionRef:`TRF-${Date.now()}` });
    }, 1000);
  };

  const formatCard   = (v) => v.replace(/\s/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const formatExpiry = (v) => v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").slice(0,5);

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onBack()}>
      <div className="modal" style={{ maxWidth:500 }}>
        <button className="modal-close" onClick={onBack}>✕</button>
        <h2>Payment</h2>
        <div className="modal-sub">Complete payment to confirm your booking</div>

        {/* Order Summary */}
        <div style={{ background:"var(--cream)", borderRadius:10, padding:16, marginBottom:20 }}>
          <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>Order Summary</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
            <span style={{ color:"var(--muted)" }}>{booking.test}</span>
            <span>{fmt(booking.price - (booking.collection==="Home Collection"?1500:0))}</span>
          </div>
          {booking.collection === "Home Collection" && (
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
              <span style={{ color:"var(--muted)" }}>Home collection fee</span>
              <span>{fmt(1500)}</span>
            </div>
          )}
          <div style={{ borderTop:"1px solid var(--border)", marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:16 }}>
            <span>Total</span>
            <span style={{ color:"var(--teal)" }}>{fmt(booking.price)}</span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div style={{ marginBottom:20 }}>
          <label style={{ marginBottom:10, display:"block" }}>Select Payment Method</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { id:"paystack", label:"Paystack",      icon:"💳" },
              { id:"card",     label:"Debit Card",    icon:"🏦" },
              { id:"transfer", label:"Bank Transfer", icon:"📲" },
            ].map(m => (
              <div key={m.id} onClick={()=>{ setMethod(m.id); setShowKeyInput(false); }}
                style={{ border:`1.5px solid ${method===m.id?"var(--teal)":"var(--border)"}`, borderRadius:8, padding:"12px 8px", textAlign:"center", cursor:"pointer", background:method===m.id?"rgba(0,168,150,0.05)":"white", transition:"all .2s" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{m.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, color:method===m.id?"var(--teal)":"var(--text)" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PAYSTACK ── */}
        {method === "paystack" && (
          <div>
            {/* Key Input (shows when key is missing/invalid) */}
            {showKeyInput || !paystackKey ? (
              <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:10, padding:16, marginBottom:16 }}>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:6 }}>🔑 Enter Your Paystack Public Key</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:10, lineHeight:1.6 }}>
                  Get it from <strong>dashboard.paystack.com</strong> → Settings → API Keys. Must start with <code>pk_test_</code> or <code>pk_live_</code>
                </div>
                <input
                  placeholder="pk_test_e09ffd9408013865421d68e5364249c9362fc6f2"
                  value={paystackKey}
                  onChange={e=>saveKey(e.target.value)}
                  style={{ width:"100%", padding:"9px 12px", border:"1.5px solid var(--border)", borderRadius:7, fontFamily:"monospace", fontSize:12, outline:"none" }}
                />
                {paystackKey && paystackKey.startsWith("pk_") && (
                  <button className="btn sm" style={{ marginTop:10 }} onClick={()=>setShowKeyInput(false)}>Save Key ✓</button>
                )}
              </div>
            ) : (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, background:"rgba(0,168,150,0.05)", borderRadius:8, padding:"8px 12px" }}>
                <span style={{ fontSize:12, color:"var(--muted)" }}>Key: <code style={{ color:"var(--teal)" }}>{paystackKey.slice(0,18)}...</code></span>
                <button onClick={()=>setShowKeyInput(true)} style={{ background:"none", border:"none", color:"var(--teal)", fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Change</button>
              </div>
            )}

            <div style={{ textAlign:"center", padding:"8px 0 4px" }}>
              <p style={{ fontSize:13, color:"var(--muted)", marginBottom:16, lineHeight:1.6 }}>
                Securely pay {fmt(booking.price)} via card, bank transfer, or USSD through Paystack.
              </p>
              <button className="btn" onClick={payWithPaystack} disabled={loading || !paystackKey}>
                {loading ? "Opening Paystack..." : `Pay ${fmt(booking.price)} with Paystack`}
              </button>
              {!scriptReady && <div style={{ fontSize:11, color:"var(--muted)", marginTop:8 }}>⏳ Loading Paystack...</div>}
            </div>
          </div>
        )}

        {/* ── DEBIT CARD ── */}
        {method === "card" && (
          <>
            <div className="fgroup">
              <label>Cardholder Name</label>
              <input placeholder="ADEBAYO OKAFOR" value={cardForm.name} onChange={e=>setCardForm({...cardForm,name:e.target.value.toUpperCase()})} />
            </div>
            <div className="fgroup">
              <label>Card Number</label>
              <input placeholder="0000 0000 0000 0000" value={cardForm.number} onChange={e=>setCardForm({...cardForm,number:formatCard(e.target.value)})} maxLength={19} />
            </div>
            <div className="frow">
              <div className="fgroup">
                <label>Expiry</label>
                <input placeholder="MM/YY" value={cardForm.expiry} onChange={e=>setCardForm({...cardForm,expiry:formatExpiry(e.target.value)})} maxLength={5} />
              </div>
              <div className="fgroup">
                <label>CVV</label>
                <input placeholder="123" value={cardForm.cvv} onChange={e=>setCardForm({...cardForm,cvv:e.target.value.slice(0,3)})} maxLength={3} type="password" />
              </div>
            </div>
            <div style={{ fontSize:11, color:"var(--muted)", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              🔒 Demo mode — no real charge will be made
            </div>
            <button className="btn" onClick={payWithCard} disabled={loading}>
              {loading ? "Processing..." : `Pay ${fmt(booking.price)}`}
            </button>
          </>
        )}

        {/* ── BANK TRANSFER ── */}
        {method === "transfer" && (
          <div>
            <div style={{ background:"rgba(0,168,150,0.05)", border:"1px solid rgba(0,168,150,0.2)", borderRadius:10, padding:18, marginBottom:16 }}>
              <div style={{ fontWeight:700, marginBottom:12 }}>Bank Account Details</div>
              {[
                ["Bank Name",       "First Bank Nigeria"],
                ["Account Name",    "ProHealth Nexus Ltd"],
                ["Account Number",  "3012345678"],
                ["Amount",          fmt(booking.price)],
                ["Narration/Ref",   booking.ref],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8, alignItems:"center" }}>
                  <span style={{ color:"var(--muted)" }}>{k}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:12, color:"var(--muted)", marginBottom:16, lineHeight:1.6 }}>
              ⚠️ Use <strong>{booking.ref}</strong> as your transfer narration. Click the button below after completing your transfer.
            </p>
            <button className="btn" onClick={payWithTransfer} disabled={loading}>
              {loading ? "Confirming..." : "I Have Made the Transfer ✓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
