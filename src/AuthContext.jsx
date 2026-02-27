// ─── AuthContext.jsx ──────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [admin, setAdmin]     = useState(null);

  useEffect(() => {
    const p = localStorage.getItem("phn_patient");
    const a = localStorage.getItem("phn_admin");
    if (p) setPatient(JSON.parse(p));
    if (a) setAdmin(JSON.parse(a));
  }, []);

  const signupPatient = (data) => {
    const patients = JSON.parse(localStorage.getItem("phn_patients") || "[]");
    const exists = patients.find(p => p.email === data.email);
    if (exists) return { error: "Email already registered." };
    const newPatient = { ...data, id: `PAT-${Date.now()}`, createdAt: new Date().toISOString() };
    patients.push(newPatient);
    localStorage.setItem("phn_patients", JSON.stringify(patients));
    localStorage.setItem("phn_patient", JSON.stringify(newPatient));
    setPatient(newPatient);
    return { success: true };
  };

  const loginPatient = (email, password) => {
    const patients = JSON.parse(localStorage.getItem("phn_patients") || "[]");
    const found = patients.find(p => p.email === email && p.password === password);
    if (!found) return { error: "Invalid email or password." };
    localStorage.setItem("phn_patient", JSON.stringify(found));
    setPatient(found);
    return { success: true };
  };

  const loginAdmin = (email, password) => {
    if (email === "admin@prohealth.com" && password === "admin123") {
      const a = { name: "Admin", email, role: "admin" };
      localStorage.setItem("phn_admin", JSON.stringify(a));
      setAdmin(a);
      return { success: true };
    }
    return { error: "Invalid admin credentials." };
  };

  const logout = () => {
    localStorage.removeItem("phn_patient");
    localStorage.removeItem("phn_admin");
    setPatient(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ patient, admin, signupPatient, loginPatient, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
