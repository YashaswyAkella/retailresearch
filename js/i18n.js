/* ============================================================
   Internationalization — English, Italian, Swedish
   Swedish included because the paper's data is from Sweden;
   Italian because the primary target retailers are Italian.
   ============================================================ */

const SEK_TO_EUR = 0.087;   // approximate; display hint, not authoritative

const TRANSLATIONS = {
  en: {
    lang_name:"EN",
    currency_symbol:"€",
    currency_hint:"(€ converted from SEK @ ~0.087)",
    // Nav
    nav_home:"Home", nav_designer:"2D Designer", nav_3d:"3D Designer",
    nav_calculator:"Calculator", nav_optimizer:"Optimizer",
    nav_insights:"Insights", nav_verify:"Verification",
    // Home
    home_badge:"Based on Journal of Marketing research (2026)",
    home_title_1:"Design stores that sell",
    home_title_2:"more, scientifically.",
    home_lead:"Up to <strong>+4.08% weekly revenue</strong> just by rearranging where your departments sit. Built on peer-reviewed research across 64 stores and 52 weeks of sales data.",
    home_cta_primary:"Design My Store →",
    home_cta_secondary:"See the Research",
    home_problem_title:"The problem every store manager knows",
    home_problem_sub:"The average supermarket spans 48,000 sq ft with 31,000+ SKUs. Where does bread go relative to cheese? Most retailers decide by intuition — we show you what the data says.",
    feat1_t:"Drag-and-drop Designer", feat1_d:"Place your 28 departments on a blueprint. Measure inter-departmental distances in real time.",
    feat2_t:"3D Visualization", feat2_d:"Adjust shelf heights to explore vertical layout — a future direction identified in the paper.",
    feat3_t:"Joint-Sales Predictor", feat3_d:"Plug in distance, layout type and variety differential → get predicted joint sales.",
    feat4_t:"Revenue Optimizer", feat4_d:"Computes optimal distances between all department pairs to maximize store revenue.",
    stat1:"Revenue lift in supermarkets", stat2:"Revenue lift in hypermarkets",
    stat3:"Stores analyzed", stat4:"Department-pair observations",
    for_who_title:"Perfect for Italian & European retailers",
    for_who_sub:"Whether you run a neighborhood Pam or a 25,000-SKU Esselunga hypermarket, the physics of shopper categorization is universal.",
    // Designer
    designer_title:"Interactive 2D Store Designer",
    designer_sub:"Click a department, then click the canvas to place it. Distances auto-update and joint sales are predicted using Table 5 coefficients.",
    palette_h:"Departments", palette_hint:"Click a department, then click the canvas.",
    clear_canvas:"Clear Canvas",
    store_settings:"Store Settings",
    store_width:"Store width (m)", store_height:"Store height (m)",
    layout_style:"Layout style", apply:"Apply",
    analysis:"Live Analysis",
    place_prompt:"Place at least 2 departments to see pair analysis.",
    top_pairs:"Top 5 joint-sales pairs",
    summary:"Summary",
    depts_placed:"Departments placed",
    avg_idd:"Avg. IDD",
    pred_rev:"Sum of pairwise joint sales",
    export_json:"📥 Export layout (JSON)",
    screenshot:"📸 Screenshot",
    // 3D
    d3_title:"3D Store Designer (with shelf heights)",
    d3_sub:"Explore the vertical dimension of your store. Shelf heights affect shopper overview — a mechanism flagged as future research in the paper [1].",
    d3_hint:"Drag to rotate · Scroll to zoom · Right-click to pan",
    d3_selected:"Selected department",
    d3_height:"Shelf height (m)",
    d3_area:"Footprint (m²)",
    d3_none:"None selected",
    // Calculator
    calc_title:"Joint-Sales Calculator",
    calc_sub:"Enter distance between two departments and see predicted joint sales along the inverted-U curve.",
    dept_a:"Department A", dept_b:"Department B",
    idd_label:"Inter-Departmental Distance (m)",
    non_identical:"Non-identical layouts",
    non_identical_hint:"(one grid, one free-flow, etc.)",
    variety_diff:"Variety differential |#cat A − #cat B|",
    store_type:"Store type",
    supermarket:"Supermarket", hypermarket:"Hypermarket",
    pred_joint:"Predicted weekly joint sales",
    optimal_dist:"Optimal distance for this pair",
    // Categorization labels
    cat_substitutes:"Substitutes",
    cat_substitutes_t:"At this short distance, shoppers see these departments as interchangeable — they'll buy from one or the other, not both.",
    cat_close:"Close / Substitutable",
    cat_close_t:"Still close enough for direct comparison. Good if you want shoppers to choose between substitutes.",
    cat_optimal:"Related but distinct ✅ SWEET SPOT",
    cat_optimal_t:"Optimal range. Departments perceived as complementary / related-but-distinct. Joint purchases peak here.",
    cat_weakly:"Weakly related",
    cat_weakly_t:"Distance is starting to signal unrelatedness. Add inspirational signage (recipes, bundles) to rebuild relatedness.",
    cat_unrelated:"Unrelated",
    cat_unrelated_t:"Departments feel disconnected. Only appropriate for truly unrelated categories (e.g., babies vs. household chemicals).",
    // Optimizer
    opt_title:"🎯 Store Revenue Optimizer",
    opt_sub:"Computes near-optimal (x, y) coordinates for each department by matching the ideal pairwise distances from Eq. (6) of the paper.",
    opt_step1:"1. Store type",
    opt_step2:"2. Departments to include",
    opt_step3:"3. Run",
    select_all:"Select all 28",
    run_opt:"⚡ Optimize Layout",
    optimized_layout:"Optimized Layout",
    click_run:"Click \"Optimize Layout\" to generate.",
    status_quo:"Status-quo weekly revenue (paper)",
    expected_opt:"Expected optimized revenue",
    lift:"Lift",
    // Insights
    insights_title:"The research in plain language",
    // Verification
    verify_title:"Model Transparency & Verification",
    verify_sub:"Every coefficient used in this tool is extracted directly from tables in the paper. No illustrative defaults.",
    // Cookie
    cookie_msg:"We use anonymous analytics to improve this free tool. No personal data is collected.",
    cookie_ok:"OK"
  },

  it: {
    lang_name:"IT",
    currency_symbol:"€",
    currency_hint:"(€ convertiti da SEK a ~0.087)",
    nav_home:"Home", nav_designer:"Progettista 2D", nav_3d:"Progettista 3D",
    nav_calculator:"Calcolatore", nav_optimizer:"Ottimizzatore",
    nav_insights:"Approfondimenti", nav_verify:"Verifica",
    home_badge:"Basato su ricerca pubblicata sul Journal of Marketing (2026)",
    home_title_1:"Progetta negozi che vendono",
    home_title_2:"di più, scientificamente.",
    home_lead:"Fino a <strong>+4,08% di ricavi settimanali</strong> semplicemente riposizionando i tuoi reparti. Basato su ricerca peer-reviewed su 64 negozi e 52 settimane di dati di vendita.",
    home_cta_primary:"Progetta il mio negozio →",
    home_cta_secondary:"Vedi la ricerca",
    home_problem_title:"Il problema che ogni direttore conosce",
    home_problem_sub:"Un supermercato medio ha 4.500 m² e 31.000+ SKU. Dove mettere il pane rispetto al formaggio? La maggior parte dei retailer decide per intuito — noi ti mostriamo cosa dicono i dati.",
    feat1_t:"Progettista drag-and-drop", feat1_d:"Posiziona i tuoi 28 reparti su una planimetria. Misura le distanze in tempo reale.",
    feat2_t:"Visualizzazione 3D", feat2_d:"Regola le altezze degli scaffali per esplorare la dimensione verticale — direzione futura identificata nel paper.",
    feat3_t:"Previsione vendite congiunte", feat3_d:"Inserisci distanza, tipo di layout e differenza di varietà → ottieni la previsione.",
    feat4_t:"Ottimizzatore ricavi", feat4_d:"Calcola le distanze ottimali tra tutte le coppie di reparti per massimizzare i ricavi.",
    stat1:"Aumento ricavi supermercati", stat2:"Aumento ricavi ipermercati",
    stat3:"Negozi analizzati", stat4:"Coppie di reparti osservate",
    for_who_title:"Perfetto per retailer italiani ed europei",
    for_who_sub:"Che tu gestisca un Pam di quartiere o un ipermercato Esselunga con 25.000 SKU, la fisica della categorizzazione dello shopper è universale.",
    designer_title:"Progettista Negozio 2D",
    designer_sub:"Clicca un reparto, poi clicca sulla tela per posizionarlo. Le distanze si aggiornano e le vendite congiunte vengono previste usando i coefficienti della Tabella 5.",
    palette_h:"Reparti", palette_hint:"Clicca un reparto, poi la tela.",
    clear_canvas:"Pulisci tela",
    store_settings:"Impostazioni negozio",
    store_width:"Larghezza (m)", store_height:"Altezza (m)",
    layout_style:"Stile layout", apply:"Applica",
    analysis:"Analisi in tempo reale",
    place_prompt:"Posiziona almeno 2 reparti per vedere l'analisi.",
    top_pairs:"Top 5 coppie per vendite congiunte",
    summary:"Riepilogo",
    depts_placed:"Reparti posizionati",
    avg_idd:"Distanza media",
    pred_rev:"Somma vendite congiunte (coppie)",
    export_json:"📥 Esporta layout (JSON)",
    screenshot:"📸 Screenshot",
    d3_title:"Progettista 3D (con altezze scaffali)",
    d3_sub:"Esplora la dimensione verticale del tuo negozio. Le altezze influenzano la visuale dello shopper — meccanismo segnalato come ricerca futura nel paper [1].",
    d3_hint:"Trascina per ruotare · Rotella per zoom · Click destro per panoramica",
    d3_selected:"Reparto selezionato",
    d3_height:"Altezza scaffale (m)",
    d3_area:"Ingombro (m²)",
    d3_none:"Nessuno selezionato",
    calc_title:"Calcolatore vendite congiunte",
    calc_sub:"Inserisci la distanza tra due reparti e vedi le vendite congiunte previste lungo la curva a U rovesciata.",
    dept_a:"Reparto A", dept_b:"Reparto B",
    idd_label:"Distanza inter-reparto (m)",
    non_identical:"Layout non identici",
    non_identical_hint:"(uno a griglia, uno free-flow, ecc.)",
    variety_diff:"Differenza varietà |#cat A − #cat B|",
    store_type:"Tipo di negozio",
    supermarket:"Supermercato", hypermarket:"Ipermercato",
    pred_joint:"Vendite congiunte settimanali previste",
    optimal_dist:"Distanza ottimale per questa coppia",
    cat_substitutes:"Sostituti",
    cat_substitutes_t:"A questa distanza ridotta, gli shopper percepiscono i reparti come intercambiabili — compreranno da uno o dall'altro, non da entrambi.",
    cat_close:"Vicini / sostituibili",
    cat_close_t:"Ancora abbastanza vicini per il confronto diretto. Utile se vuoi che lo shopper scelga tra sostituti.",
    cat_optimal:"Correlati ma distinti ✅ PUNTO OTTIMALE",
    cat_optimal_t:"Range ottimale. I reparti sono percepiti come complementari / correlati ma distinti. Gli acquisti congiunti sono massimi.",
    cat_weakly:"Debolmente correlati",
    cat_weakly_t:"La distanza inizia a segnalare non-correlazione. Aggiungi comunicazioni ispirazionali (ricette, bundle) per ricostruire correlazione.",
    cat_unrelated:"Non correlati",
    cat_unrelated_t:"I reparti appaiono disconnessi. Appropriato solo per categorie veramente non correlate (es. bambini vs. prodotti per la casa).",
    opt_title:"🎯 Ottimizzatore ricavi",
    opt_sub:"Calcola le coordinate (x, y) quasi-ottimali di ogni reparto abbinando le distanze ideali dell'Eq. (6) del paper.",
    opt_step1:"1. Tipo di negozio",
    opt_step2:"2. Reparti da includere",
    opt_step3:"3. Esegui",
    select_all:"Seleziona tutti i 28",
    run_opt:"⚡ Ottimizza layout",
    optimized_layout:"Layout ottimizzato",
    click_run:"Clicca \"Ottimizza layout\" per generare.",
    status_quo:"Ricavi settimanali status-quo (paper)",
    expected_opt:"Ricavi ottimizzati previsti",
    lift:"Incremento",
    insights_title:"La ricerca spiegata semplicemente",
    verify_title:"Trasparenza e verifica del modello",
    verify_sub:"Ogni coefficiente usato in questo strumento è estratto direttamente dalle tabelle del paper. Nessun valore illustrativo.",
    cookie_msg:"Usiamo analytics anonimi per migliorare questo strumento gratuito. Nessun dato personale è raccolto.",
    cookie_ok:"OK"
  },

  sv: {
    lang_name:"SV",
    currency_symbol:"kr",
    currency_hint:"(belopp i SEK — originalvaluta i studien)",
    nav_home:"Hem", nav_designer:"2D-design", nav_3d:"3D-design",
    nav_calculator:"Kalkylator", nav_optimizer:"Optimerare",
    nav_insights:"Insikter", nav_verify:"Verifiering",
    home_badge:"Baserat på forskning i Journal of Marketing (2026)",
    home_title_1:"Designa butiker som säljer",
    home_title_2:"mer, vetenskapligt.",
    home_lead:"Upp till <strong>+4,08 % veckointäkter</strong> bara genom att ändra var avdelningarna ligger. Baserat på peer-reviewad forskning över 64 butiker och 52 veckors försäljning.",
    home_cta_primary:"Designa min butik →",
    home_cta_secondary:"Se forskningen",
    home_problem_title:"Problemet varje butikschef känner igen",
    home_problem_sub:"En genomsnittlig stormarknad har 4 500 m² och 31 000+ SKU. Var ska brödet ligga i förhållande till osten? De flesta beslutar på intuition — vi visar vad datan säger.",
    feat1_t:"Dra-och-släpp-designer", feat1_d:"Placera dina 28 avdelningar på en ritning. Avstånd mäts i realtid.",
    feat2_t:"3D-visualisering", feat2_d:"Justera hyllhöjder för att utforska den vertikala dimensionen — en framtida forskningsriktning i artikeln.",
    feat3_t:"Prognos för gemensam försäljning", feat3_d:"Ange avstånd, layout och varietetsskillnad → få prognosen.",
    feat4_t:"Intäktsoptimerare", feat4_d:"Beräknar optimala avstånd mellan alla avdelningspar för att maximera intäkter.",
    stat1:"Intäktsökning stormarknader", stat2:"Intäktsökning hypermarknader",
    stat3:"Butiker analyserade", stat4:"Avdelningspar observerade",
    for_who_title:"Perfekt för svenska och europeiska retailers",
    for_who_sub:"Oavsett om du driver en närbutik eller en 25 000-SKU hypermarknad — shopparens kategoriseringsfysik är universell.",
    designer_title:"Interaktiv 2D-butiksdesigner",
    designer_sub:"Klicka på en avdelning och klicka sedan på ytan för att placera den. Avstånd uppdateras automatiskt.",
    palette_h:"Avdelningar", palette_hint:"Klicka på en avdelning, sedan på ytan.",
    clear_canvas:"Rensa ytan",
    store_settings:"Butiksinställningar",
    store_width:"Bredd (m)", store_height:"Höjd (m)",
    layout_style:"Layoutstil", apply:"Tillämpa",
    analysis:"Liveanalys",
    place_prompt:"Placera minst 2 avdelningar för att se paranalys.",
    top_pairs:"Topp 5 paren med högst gemensam försäljning",
    summary:"Sammanfattning",
    depts_placed:"Avdelningar placerade",
    avg_idd:"Genomsnittligt avstånd",
    pred_rev:"Summa gemensam försäljning (par)",
    export_json:"📥 Exportera layout (JSON)",
    screenshot:"📸 Skärmbild",
    d3_title:"3D-designer (med hyllhöjder)",
    d3_sub:"Utforska butikens vertikala dimension. Hyllhöjder påverkar shopparens överblick — markerat som framtida forskning i artikeln [1].",
    d3_hint:"Dra för att rotera · Skrolla för zoom · Högerklicka för panorering",
    d3_selected:"Vald avdelning",
    d3_height:"Hyllhöjd (m)",
    d3_area:"Yta (m²)",
    d3_none:"Ingen vald",
    calc_title:"Kalkylator för gemensam försäljning",
    calc_sub:"Ange avstånd mellan två avdelningar och se prognosen längs den inverterade U-kurvan.",
    dept_a:"Avdelning A", dept_b:"Avdelning B",
    idd_label:"Interavdelningsavstånd (m)",
    non_identical:"Olika layouter",
    non_identical_hint:"(t.ex. en rutnät, en free-flow)",
    variety_diff:"Varietetsskillnad |#kat A − #kat B|",
    store_type:"Butikstyp",
    supermarket:"Stormarknad", hypermarket:"Hypermarknad",
    pred_joint:"Prognostiserad gemensam veckoförsäljning",
    optimal_dist:"Optimalt avstånd för paret",
    cat_substitutes:"Substitut",
    cat_substitutes_t:"På detta korta avstånd ses avdelningarna som utbytbara — kunden väljer en, inte båda.",
    cat_close:"Nära / utbytbara",
    cat_close_t:"Fortfarande nära nog för direkt jämförelse. Bra om du vill att kunder ska välja mellan substitut.",
    cat_optimal:"Relaterade men distinkta ✅ OPTIMALT",
    cat_optimal_t:"Optimalt intervall. Avdelningarna uppfattas som komplementära / relaterade-men-distinkta. Gemensam försäljning når maximum.",
    cat_weakly:"Svagt relaterade",
    cat_weakly_t:"Avståndet börjar signalera orelaterade. Lägg till inspirerande kommunikation (recept, paket).",
    cat_unrelated:"Orelaterade",
    cat_unrelated_t:"Avdelningarna känns frånkopplade. Bara lämpligt för verkligt orelaterade kategorier.",
    opt_title:"🎯 Intäktsoptimerare",
    opt_sub:"Beräknar nästan optimala (x, y)-koordinater genom att matcha de ideala paravstånden från artikelns Ekv. (6).",
    opt_step1:"1. Butikstyp",
    opt_step2:"2. Avdelningar att inkludera",
    opt_step3:"3. Kör",
    select_all:"Välj alla 28",
    run_opt:"⚡ Optimera layout",
    optimized_layout:"Optimerad layout",
    click_run:"Klicka \"Optimera layout\" för att generera.",
    status_quo:"Status-quo veckointäkter (artikeln)",
    expected_opt:"Förväntade optimerade intäkter",
    lift:"Ökning",
    insights_title:"Forskningen i enkla ord",
    verify_title:"Modelltransparens & verifiering",
    verify_sub:"Varje koefficient i detta verktyg är tagen direkt från artikelns tabeller.",
    cookie_msg:"Vi använder anonym analys för att förbättra detta gratis verktyg. Ingen personlig data samlas in.",
    cookie_ok:"OK"
  }
};

// ------- Language management ---------------------------------
function getLang() {
  const saved = localStorage.getItem("rlo_lang");
  if (saved && TRANSLATIONS[saved]) return saved;
  const browser = (navigator.language || "en").slice(0,2);
  return TRANSLATIONS[browser] ? browser : "en";
}

function setLang(code) {
  if (!TRANSLATIONS[code]) return;
  localStorage.setItem("rlo_lang", code);
  applyTranslations();
  if (window.RLOAnalytics) RLOAnalytics.track("language_change", { lang: code });
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
    else el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  // Update lang switcher highlighting
  const lang = getLang();
  document.querySelectorAll(".lang-switch button").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
}

function formatCurrency(sek) {
  const lang = getLang();
  const symbol = TRANSLATIONS[lang].currency_symbol;
  const value = lang === "sv" ? sek : sek * SEK_TO_EUR;
  return symbol + " " + Math.round(value).toLocaleString(lang === "sv" ? "sv-SE" : lang === "it" ? "it-IT" : "en-US");
}

// Auto-initialize when DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Inject language switcher into nav
  const nav = document.querySelector(".nav");
  if (nav && !nav.querySelector(".lang-switch")) {
    const sw = document.createElement("div");
    sw.className = "lang-switch";
    sw.innerHTML = `
      <button data-lang="en">EN</button>
      <button data-lang="it">IT</button>
      <button data-lang="sv">SV</button>`;
    nav.appendChild(sw);
    sw.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => setLang(b.dataset.lang));
    });
  }
  applyTranslations();
});