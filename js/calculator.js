const deptA = document.getElementById("deptA");
const deptB = document.getElementById("deptB");
DEPARTMENTS.forEach(d => {
  [deptA, deptB].forEach(sel => {
    const o = document.createElement("option");
    o.value = d.id; o.textContent = `${d.id}. ${d.name} (${d.categories})`;
    sel.appendChild(o);
  });
});
deptA.value = 22; deptB.value = 17;

const iddRange = document.getElementById("idd");
const iddVal = document.getElementById("iddVal");
const varietyRange = document.getElementById("variety");
const varVal = document.getElementById("varVal");
const nonIdent = document.getElementById("nonIdentical");

function autoVariety() {
  const a = DEPARTMENTS.find(x => x.id == deptA.value);
  const b = DEPARTMENTS.find(x => x.id == deptB.value);
  const diff = Math.abs(a.categories - b.categories);
  varietyRange.value = diff;
  varVal.textContent = diff;
}
deptA.onchange = () => { autoVariety(); update(); };
deptB.onchange = () => { autoVariety(); update(); };
[iddRange, varietyRange, nonIdent].forEach(el => el.addEventListener("input", update));
document.querySelectorAll("[name=storeType]").forEach(r => r.addEventListener("change", update));

const chart = document.getElementById("curveChart");
const cctx = chart.getContext("2d");

function drawCurve(cur, params) {
  const W = chart.width, H = chart.height, P = 45;
  cctx.clearRect(0,0,W,H);
  cctx.strokeStyle = "#333"; cctx.lineWidth = 1.5;
  cctx.beginPath(); cctx.moveTo(P,20); cctx.lineTo(P,H-P); cctx.lineTo(W-20,H-P); cctx.stroke();
  cctx.fillStyle = "#333"; cctx.font = "12px sans-serif"; cctx.textAlign = "center";
  cctx.fillText("Inter-Departmental Distance (m)", W/2, H-8);
  cctx.save(); cctx.translate(14, H/2); cctx.rotate(-Math.PI/2);
  cctx.fillText("Joint Sales", 0, 0); cctx.restore();

  const pts = []; let maxY = 0;
  for (let d = 1; d <= 100; d++) {
    const js = predictJointSales({ ...params, idd:d });
    pts.push({ d, js }); if (js > maxY) maxY = js;
  }
  const sx = (W - P - 20)/100, sy = (H - P - 20)/maxY;
  cctx.strokeStyle = "#ff6b35"; cctx.lineWidth = 3;
  cctx.beginPath();
  pts.forEach((p, i) => {
    const x = P + p.d*sx, y = H - P - p.js*sy;
    i === 0 ? cctx.moveTo(x,y) : cctx.lineTo(x,y);
  });
  cctx.stroke();

  const cx = P + cur*sx, cy = H - P - predictJointSales({ ...params, idd:cur })*sy;
  cctx.fillStyle = "#e63946";
  cctx.beginPath(); cctx.arc(cx, cy, 8, 0, 2*Math.PI); cctx.fill();
  cctx.strokeStyle = "#fff"; cctx.lineWidth = 2; cctx.stroke();

  const opt = optimalDistance(params);
  const ox = P + opt*sx;
  cctx.strokeStyle = "#2a9d8f"; cctx.setLineDash([5,4]);
  cctx.beginPath(); cctx.moveTo(ox, 20); cctx.lineTo(ox, H-P); cctx.stroke();
  cctx.setLineDash([]);
  cctx.fillStyle = "#2a9d8f"; cctx.textAlign = "left";
  cctx.fillText(`D* = ${opt.toFixed(1)} m`, ox+6, 35);
}

function update() {
  iddVal.textContent = iddRange.value;
  varVal.textContent = varietyRange.value;
  const idd = +iddRange.value, variety = +varietyRange.value;
  const hyper = document.querySelector("[name=storeType]:checked").value === "hyper";
  const nonIdentical = nonIdent.checked;
  const params = { variety, hyper, nonIdentical };
  const js = predictJointSales({ ...params, idd });
  const opt = optimalDistance(params);
  const cat = categorize(idd, opt);

  document.getElementById("jsValue").textContent = formatCurrency(js);
  document.getElementById("optValue").textContent = opt.toFixed(1);
  const badge = document.getElementById("catBadge");
  badge.textContent = t("cat_"+cat.key);
  badge.style.background = cat.color;
  document.getElementById("catText").textContent = t("cat_"+cat.key+"_t");
  drawCurve(idd, params);
  RLOAnalytics.track("calculator_change", { idd, variety, hyper, nonIdentical });
}

document.getElementById("calcScreenshot").onclick = () => {
  html2canvas(document.getElementById("calcResults")).then(c => {
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png"); a.download = "idd-calculator.png"; a.click();
    RLOAnalytics.track("screenshot_export", { page:"calculator" });
  });
};

autoVariety(); update();