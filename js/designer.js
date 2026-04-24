const canvas = document.getElementById("storeCanvas");
const ctx = canvas.getContext("2d");
let storeW = 60, storeH = 40;
let layoutStyle = "grid";
let placedDepts = [];
let selectedDept = null;

const deptList = document.getElementById("dept-list");
DEPARTMENTS.forEach(d => {
  const btn = document.createElement("button");
  btn.className = "dept-btn";
  btn.textContent = `${d.id}. ${d.name}`;
  btn.style.borderLeft = `5px solid ${d.color}`;
  btn.onclick = () => {
    document.querySelectorAll(".dept-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDept = d;
  };
  deptList.appendChild(btn);
});

function mToPx(m, axis) { return axis === "x" ? (m/storeW)*canvas.width : (m/storeH)*canvas.height; }
function pxToM(p, axis) { return axis === "x" ? (p/canvas.width)*storeW : (p/canvas.height)*storeH; }

function drawStore() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "#eee"; ctx.lineWidth = 1;
  for (let i = 0; i <= storeW; i += 5) { ctx.beginPath(); ctx.moveTo(mToPx(i,"x"),0); ctx.lineTo(mToPx(i,"x"),canvas.height); ctx.stroke(); }
  for (let i = 0; i <= storeH; i += 5) { ctx.beginPath(); ctx.moveTo(0,mToPx(i,"y")); ctx.lineTo(canvas.width,mToPx(i,"y")); ctx.stroke(); }
  ctx.fillStyle = "#2a9d8f";
  ctx.beginPath(); ctx.arc(20,canvas.height-20,14,0,2*Math.PI); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 16px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText("🚪",20,canvas.height-20);
  ctx.strokeStyle = "#cfcfcf"; ctx.lineWidth = 1;
  for (let i = 0; i < placedDepts.length; i++)
    for (let j = i+1; j < placedDepts.length; j++) {
      ctx.beginPath(); ctx.moveTo(placedDepts[i].px,placedDepts[i].py); ctx.lineTo(placedDepts[j].px,placedDepts[j].py); ctx.stroke();
    }
  placedDepts.forEach(d => {
    ctx.fillStyle = d.color; ctx.strokeStyle = "#333"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(d.px,d.py,24,0,2*Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#000"; ctx.font = "bold 11px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(d.id, d.px, d.py);
    ctx.font = "10px sans-serif";
    ctx.fillText(d.name.substring(0,14), d.px, d.py+38);
  });
}

canvas.addEventListener("click", (e) => {
  if (!selectedDept) { alert(t("palette_hint")); return; }
  const rect = canvas.getBoundingClientRect();
  const px = (e.clientX - rect.left)*(canvas.width/rect.width);
  const py = (e.clientY - rect.top)*(canvas.height/rect.height);
  const existing = placedDepts.find(d => d.id === selectedDept.id);
  if (existing) { existing.px=px; existing.py=py; existing.x=pxToM(px,"x"); existing.y=pxToM(py,"y"); }
  else placedDepts.push({ ...selectedDept, px, py, x:pxToM(px,"x"), y:pxToM(py,"y") });
  drawStore(); updateAnalysis();
  RLOAnalytics.track("designer_place_dept", { id: selectedDept.id });
});

document.getElementById("clearBtn").onclick = () => {
  placedDepts = []; drawStore(); updateAnalysis();
  RLOAnalytics.track("designer_clear");
};
document.getElementById("applyStoreBtn").onclick = () => {
  storeW = +document.getElementById("storeW").value;
  storeH = +document.getElementById("storeH").value;
  layoutStyle = document.getElementById("layoutStyle").value;
  placedDepts.forEach(d => { d.px = mToPx(d.x,"x"); d.py = mToPx(d.y,"y"); });
  drawStore(); updateAnalysis();
};

function updateAnalysis() {
  const pairDiv = document.getElementById("pairAnalysis");
  const n = placedDepts.length;
  document.getElementById("deptCount").textContent = n;
  if (n < 2) {
    pairDiv.innerHTML = `<p class="empty">${t("place_prompt")}</p>`;
    document.getElementById("avgIDD").textContent = "–";
    document.getElementById("predRev").textContent = "–";
    return;
  }
  const pairs = []; let total = 0, totDist = 0, cnt = 0;
  for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) {
    const dx = placedDepts[i].x - placedDepts[j].x;
    const dy = placedDepts[i].y - placedDepts[j].y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const variety = Math.abs(placedDepts[i].categories - placedDepts[j].categories);
    const js = predictJointSales({ idd: dist, nonIdentical:false, variety, hyper:false });
    const opt = optimalDistance({ nonIdentical:false, variety, hyper:false });
    const cat = categorize(dist, opt);
    pairs.push({ a:placedDepts[i], b:placedDepts[j], dist, js, cat });
    total += js; totDist += dist; cnt++;
  }
  pairs.sort((a,b) => b.js - a.js);
  pairDiv.innerHTML = `<h4>${t("top_pairs")}</h4>` + pairs.slice(0,5).map(p =>
    `<div class="pair-row">${p.a.name} ↔ ${p.b.name}
       <span class="pair-dist">${p.dist.toFixed(1)} m</span>
       <span class="tag" style="background:${p.cat.color}">${t("cat_"+p.cat.key)||p.cat.key}</span>
       <br><small>${t("pred_joint")}: ${formatCurrency(p.js)}</small>
     </div>`).join("");
  document.getElementById("avgIDD").textContent = (totDist/cnt).toFixed(1);
  document.getElementById("predRev").textContent = formatCurrency(total);
}

document.getElementById("downloadBtn").onclick = () => {
  const blob = new Blob([JSON.stringify({ storeW, storeH, layoutStyle, placedDepts }, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "store-layout.json"; a.click();
  RLOAnalytics.track("export_json", { n: placedDepts.length });
};

document.getElementById("screenshotBtn").onclick = () => {
  html2canvas(document.getElementById("canvasArea")).then(c => {
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png"); a.download = "store-layout.png"; a.click();
    RLOAnalytics.track("screenshot_export", { page:"designer2d" });
  });
};

drawStore();