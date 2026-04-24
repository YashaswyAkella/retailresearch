/* ============================================================
   RETAIL LAYOUT OPTIMIZER — Core Data
   ============================================================
   ALL numerical coefficients in this file are EXACT values from:

   Akella, L. Y., Kopalle, P. K., Noble, S. M., Nordfält, J.,
   & Grewal, D. (2026). The Impact of Inter-Departmental
   Distance on Joint Sales in Retail Stores.
   Journal of Marketing. DOI: 10.1177/00222429261419762

   Source tables:
   - Table 5 (Main Model)          → MODEL_MAIN
   - Web Appendix F, Table W6      → MODEL_OPT (hypermarket moderator)

   Currency in source data: Swedish Krona (SEK).
   SEK→EUR conversion applied only at UI render time (see i18n.js).
   ============================================================ */

// ------- 28 DEPARTMENTS from Web Appendix A ------------------
// Areas approximated from Figure 6 of the paper (hypermarket average).
// Users can edit heights/areas in the 3D designer.
const DEPARTMENTS = [
  { id:1,  name:"Babies & children",        categories:4,  area:60,  height:1.8, color:"#ffb4a2" },
  { id:2,  name:"Frozen",                   categories:6,  area:80,  height:1.2, color:"#a2d2ff" },
  { id:3,  name:"Cold drinks",              categories:5,  area:70,  height:2.1, color:"#90e0ef" },
  { id:4,  name:"Confectionery",            categories:3,  area:40,  height:1.7, color:"#ffc8dd" },
  { id:5,  name:"Gluten free",              categories:2,  area:25,  height:1.6, color:"#cdb4db" },
  { id:6,  name:"Other staple commodities", categories:4,  area:55,  height:1.9, color:"#bde0fe" },
  { id:7,  name:"Breakfast",                categories:4,  area:45,  height:1.9, color:"#ffafcc" },
  { id:8,  name:"Hot beverages",            categories:3,  area:35,  height:1.8, color:"#c8b6ff" },
  { id:9,  name:"Baking",                   categories:5,  area:50,  height:1.9, color:"#ffd6a5" },
  { id:10, name:"Cans, soups & world food", categories:7,  area:95,  height:2.0, color:"#caffbf" },
  { id:11, name:"Seasoning",                categories:4,  area:40,  height:1.8, color:"#fdffb6" },
  { id:12, name:"Snacks",                   categories:5,  area:60,  height:1.8, color:"#ffadad" },
  { id:13, name:"Dry foods",                categories:5,  area:70,  height:2.0, color:"#fdb462" },
  { id:14, name:"Pets",                     categories:3,  area:40,  height:1.9, color:"#b5ead7" },
  { id:15, name:"Household chemicals",      categories:6,  area:80,  height:2.0, color:"#c7ceea" },
  { id:16, name:"Health & beauty",          categories:6,  area:85,  height:1.9, color:"#f6bd60" },
  { id:17, name:"Bread",                    categories:3,  area:146.33, height:1.6, color:"#f5cac3" },
  { id:18, name:"Processed meat",           categories:4,  area:50,  height:1.4, color:"#f28482" },
  { id:19, name:"Cold cuts",                categories:3,  area:40,  height:1.4, color:"#f6b3b0" },
  { id:20, name:"Manual deli",              categories:4,  area:32.6, height:1.3, color:"#e09f3e" },
  { id:21, name:"Fish",                     categories:3,  area:31.44,height:1.2, color:"#8ecae6" },
  { id:22, name:"Fresh meat & poultry",     categories:4,  area:55,  height:1.4, color:"#e63946" },
  { id:23, name:"Foods, salads & chilled",  categories:5,  area:45,  height:1.4, color:"#a7c957" },
  { id:24, name:"Dairy",                    categories:5,  area:90,  height:1.5, color:"#e9ecef" },
  { id:25, name:"Cheese & platter",         categories:4,  area:45,  height:1.4, color:"#fefae0" },
  { id:26, name:"Flowers & accessories",    categories:2,  area:30,  height:1.5, color:"#e5989b" },
  { id:27, name:"Fruits & vegetables",      categories:8,  area:120, height:1.2, color:"#6a994e" },
  { id:28, name:"Cuisine & cutlery",        categories:3,  area:45,  height:1.9, color:"#bc6c25" }
];

// ------- MODEL 1 : Table 5 — Main regression ------------------
// Used for: calculator predictions, designer pair analysis
const MODEL_MAIN = {
  source:        "Table 5 of Akella et al. (2026)",
  alpha:         391189.229,   // Constant
  b_IDD:         1143.647,
  b_IDD2:        -24.059,
  b_layout:      49944.806,    // Layout = 1 if non-identical
  b_IDDxLayout:  435.773,
  b_variety:     2936.467,
  b_IDDxVariety: 70.324,
  b_hyper:       267571.576
};

// ------- MODEL 2 : Web Appendix F, Table W6 ------------------
// Used for: optimizer (includes Hypermarket × IDD interaction)
const MODEL_OPT = {
  source:        "Web Appendix F, Table W6 of Akella et al. (2026)",
  alpha:         403480.844,   // Reconstructed constant from Table W6
  b_IDD:         1080.509,
  b_IDD2:        -26.200,
  b_layout:      50873.212,
  b_IDDxLayout:  391.516,
  b_variety:     2916.589,
  b_IDDxVariety: 70.486,
  b_hyper:       263523.076,
  b_IDDxHyper:   410.190
};

// ------- Status-quo revenues from paper (SEK/week) -----------
const STATUS_QUO = {
  supermarket: { avg: 2818421, optimized: 2930773, lift: 0.0408 },
  hypermarket: { avg: 6323329, optimized: 6526191, lift: 0.0320 }
};

// ============================================================
// CORE FUNCTION 1 — Predict expected weekly joint sales (SEK)
//   Implements Eq. (2) from the paper.
//   Residuals (unobserved heterogeneity + endogeneity controls)
//   are set to zero for *expected* prediction.
// ============================================================
function predictJointSales({ idd, nonIdentical=false, variety=0, hyper=false, useOptModel=false }) {
  const M = useOptModel ? MODEL_OPT : MODEL_MAIN;
  const L = nonIdentical ? 1 : 0;
  const H = hyper ? 1 : 0;
  let js =
    M.alpha +
    M.b_IDD * idd +
    M.b_IDD2 * idd * idd +
    M.b_layout * L +
    M.b_IDDxLayout * L * idd +
    M.b_variety * variety +
    M.b_IDDxVariety * variety * idd +
    M.b_hyper * H;
  if (useOptModel) js += M.b_IDDxHyper * H * idd;
  return Math.max(0, js);
}

// ============================================================
// CORE FUNCTION 2 — Revenue-maximizing distance D*_ij
//   Implements Eq. (6) from the paper using MODEL_OPT.
// ============================================================
function optimalDistance({ nonIdentical=false, variety=0, hyper=false }) {
  const M = MODEL_OPT;
  const L = nonIdentical ? 1 : 0;
  const H = hyper ? 1 : 0;
  const num = M.b_IDD
            + M.b_IDDxLayout  * L
            + M.b_IDDxVariety * variety
            + M.b_IDDxHyper   * H;
  return -num / (2 * M.b_IDD2);
}

// ============================================================
// CORE FUNCTION 3 — Qualitative categorization label
// ============================================================
function categorize(idd, optimal) {
  const r = idd / optimal;
  if (r < 0.45)  return { key:"substitutes",    color:"#e63946" };
  if (r < 0.75)  return { key:"close",          color:"#f4a261" };
  if (r <= 1.25) return { key:"optimal",        color:"#2a9d8f" };
  if (r <= 1.75) return { key:"weaklyRelated",  color:"#f4a261" };
  return                { key:"unrelated",      color:"#e63946" };
}

// Sanity self-test (runs once on load, logs to console)
(function verify(){
  const inflection = -MODEL_MAIN.b_IDD / (2 * MODEL_MAIN.b_IDD2);
  console.log("[Verification] Inflection point (Main):", inflection.toFixed(2), "m — paper reports 23.76 m");
})();