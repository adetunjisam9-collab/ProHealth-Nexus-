// ─── data.js ────────────────────────────────────────────────────────────────
// All static data: categories and test catalogue

export const CATEGORIES = [
  { id: "haem",   name: "Haematology",  icon: "🩸", bg: "#e8f8f7", count: 8  },
  { id: "bio",    name: "Biochemistry", icon: "💛", bg: "#fef0ee", count: 12 },
  { id: "micro",  name: "Microbiology", icon: "🧫", bg: "#f0f4ff", count: 7  },
  { id: "gen",    name: "Genetics",     icon: "🧬", bg: "#f5f0ff", count: 5  },
  { id: "cardio", name: "Cardiology",   icon: "🫀", bg: "#fff8e8", count: 6  },
  { id: "radio",  name: "Radiology",    icon: "🩻", bg: "#e8fff2", count: 4  },
  { id: "immuno", name: "Immunology",   icon: "🧪", bg: "#fef4f4", count: 6  },
  { id: "viro",   name: "Virology",     icon: "🦠", bg: "#f0faf5", count: 4  },
];

export const ALL_TESTS = [
  {
    id: "cbc",     name: "Complete Blood Count (CBC)",
    cat: "haem",   sample: "Blood",     price: 4500,
    hours: "4–6 hrs",  tag: "pop",
    desc: "Measures red/white blood cells and platelets. Essential for detecting anaemia, infection, and more.",
  },
  {
    id: "lipid",   name: "Lipid Profile",
    cat: "bio",    sample: "Blood",     price: 6200,
    hours: "12–24 hrs", tag: "pop",
    desc: "Measures cholesterol, LDL, HDL, and triglycerides. Key cardiovascular risk assessment.",
  },
  {
    id: "fbg",     name: "Fasting Blood Glucose",
    cat: "bio",    sample: "Blood",     price: 2000,
    hours: "2–4 hrs",  tag: "off",
    desc: "Diagnoses and monitors diabetes mellitus and pre-diabetes.",
  },
  {
    id: "hbsag",   name: "Hepatitis B Surface Antigen",
    cat: "viro",   sample: "Blood",     price: 5500,
    hours: "6–8 hrs",  tag: "new",
    desc: "Detects current Hepatitis B infection for early diagnosis and treatment.",
  },
  {
    id: "tft",     name: "Thyroid Function Test (TFT)",
    cat: "bio",    sample: "Blood",     price: 9800,
    hours: "24 hrs",   tag: "pop",
    desc: "Evaluates TSH, T3, and T4 levels to assess thyroid gland function.",
  },
  {
    id: "ure",     name: "Urine Routine & Microscopy",
    cat: "micro",  sample: "Urine",     price: 1800,
    hours: "4–6 hrs",  tag: "off",
    desc: "Detects urinary tract infections, kidney disorders, and diabetes.",
  },
  {
    id: "lft",     name: "Liver Function Test (LFT)",
    cat: "bio",    sample: "Blood",     price: 7500,
    hours: "12–24 hrs", tag: "pop",
    desc: "Measures enzymes and proteins produced by the liver to assess liver health.",
  },
  {
    id: "rft",     name: "Renal Function Test (RFT)",
    cat: "bio",    sample: "Blood",     price: 5200,
    hours: "8–12 hrs",  tag: "pop",
    desc: "Evaluates kidney function through creatinine, BUN, and electrolyte levels.",
  },
  {
    id: "hiv",     name: "HIV 1 & 2 Antibody Test",
    cat: "viro",   sample: "Blood",     price: 4000,
    hours: "2–4 hrs",  tag: "new",
    desc: "Rapid and confidential screening for HIV infection.",
  },
  {
    id: "psa",     name: "Prostate Specific Antigen (PSA)",
    cat: "immuno", sample: "Blood",     price: 8500,
    hours: "24 hrs",   tag: "new",
    desc: "Screens for prostate cancer and monitors treatment response.",
  },
  {
    id: "malaria", name: "Malaria Parasite (MP) Test",
    cat: "micro",  sample: "Blood",     price: 1500,
    hours: "1–2 hrs",  tag: "pop",
    desc: "Rapid test for Plasmodium species detection in blood smear.",
  },
  {
    id: "ecg",     name: "Electrocardiogram (ECG)",
    cat: "cardio", sample: "Procedure", price: 12000,
    hours: "Same Day",  tag: "pop",
    desc: "Records the electrical activity of the heart to detect cardiac abnormalities.",
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────
export const catName    = (id) => CATEGORIES.find((c) => c.id === id)?.name || id;
export const tagClass   = { pop: "tag-pop", new: "tag-new", off: "tag-off" };
export const tagLabel   = { pop: "Popular", new: "New",     off: "Offer"   };

// ─── Formatting helpers ──────────────────────────────────────────────────────
export const fmt    = (n) => `₦${Number(n).toLocaleString()}`;
export const genRef = ()  => `MT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
