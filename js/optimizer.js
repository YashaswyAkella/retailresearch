const optCanvas = document.getElementById("optCanvas");
const octx = optCanvas.getContext("2d");
const optList = document.getElementById("optDeptList");

DEPARTMENTS.forEach(d => {
  const lbl = document.createElement("label");
  lbl.innerHTML = `<input type="checkbox" value="${d.id}" checked> ${d.id}. ${d.name}`;
  optList.appendChild(lbl);
});
document.getElementById("selectAll").onclick = () =>
  optList.querySelectorAll("input").forEach(i => i.checked = true);

document.getElementById("runOpt").onclick = runOpt;

function runOpt() {
  const hyper = document.querySelector("[name=optStoreType]:checked").value === "hyper";
  const selected = [...optList.querySelectorAll("input:checked")].map(i => +i.value);
  if (selected.length < 3) { alert("Select at least 3 departments."); return; }
  const depts = DEPARTMENTS.filter(d => selected.includes(d.id));
  const n = depts.length;
  const W = hyper ? 200 : 100, H = hyper ? 130 : 70;

  const ideal = Array.from({length:n}, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) {
    const v = Math.abs(depts[i].categories - depts[j].categories);
    let d = optimalDistance({ nonIdentical:(i+j)%2===1, variety:v, hyper });
    d = Math.min(d, Math.sqrt(W*W + H*H)*0.8);
    ideal[i][j] = ideal[j][i] = d;
  }
  const pos = depts.map(() => ({ x:Math.random()*W, y:Math.random()*H }));
  const LR = 0.02;
  for (let it = 0; it < 600; it++) {
    const g = pos.map(() => ({ x:0, y:0 }));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy) + 1e-6;
      const err = dist - ideal[i][j];
      g[i].x += err*dx/dist; g[i].y += err*dy/dist;
    }
    for (let i = 0; i < n; i++) {
      pos[i].x -= LR*g[i].x; pos[i].y -= LR*g[i].y;
      pos[i].x = Math.max(2, Math.min(W-2, pos[i].x));
      pos[i].y = Math.max(2, Math.min(H-2, pos[i].y));
    }
  }

  octx.clearRect(0,0,optCanvas.width, optCanvas.height);
  const sx = optCanvas.width/W, sy = optCanvas.height/H;
  octx.strokeStyle = "#eee";
  for (let i = 0; i <= W; i += 10) { octx.beginPath(); octx.moveTo(i*sx,0); octx.lineTo(i*sx, optCanvas.height); octx.stroke(); }
  for (let i = 0; i <= H; i += 10) { octx.beginPath(); octx.moveTo(0,i*sy); octx.lineTo(optCanvas.width,i*sy); octx.stroke(); }
  octx.fillStyle = "#2a9d8f";
  octx.beginPath(); octx.arc(15, optCanvas.height-15, 12, 0, 2*Math.PI); octx.fill();
  octx.fillStyle = "#fff"; octx.font = "bold 14px sans-serif"; octx.textAlign = "center"; octx.textBaseline = "middle";
  octx.fillText("🚪", 15, optCanvas.height-15);

  depts.forEach((d, i) => {
    const px = pos[i].x*sx, py = pos[i].y*sy;
    octx.fillStyle = d.color; octx.strokeStyle = "#333"; octx.lineWidth = 2;
    octx.beginPath(); octx.arc(px,py,20,0,2*Math.PI); octx.fill(); octx.stroke();
    octx.fillStyle = "#000"; octx.font = "bold 11px sans-serif"; octx.textAlign="center"; octx.textBaseline="middle";
    octx.fillText(d.id, px, py);
    octx.font = "10px sans-serif";
    octx.fillText(d.name.substring(0,15), px, py+32);
  });

  let total = 0;
  for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) {
    const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const v = Math.abs(depts[i].categories - depts[j].categories);
    total += predictJointSales({ idd:dist, nonIdentical:(i+j)%2===1, variety:v, hyper, useOptModel:true });
  }

  const sq = hyper ? STATUS_QUO.hypermarket : STATUS_QUO.supermarket;
  document.getElementById("optSummary").innerHTML = `
    <p><strong>Store type:</strong> ${hyper ? "Hypermarket":"Supermarket"}</p>
    <p><strong>${t("depts_placed")}:</strong> ${n}</p>
    <p><strong>${t("pred_rev")}:</strong> ${formatCurrency(total)}</p>
    <p><strong>${t("status_quo")}:</strong> ${formatCurrency(sq.avg)}</p>
    <p><strong>${t("expected_opt")}:</strong> ${formatCurrency(sq.optimized)}
       &nbsp;<span style="color:#2a9d8f;font-weight:700">(${t("lift")} +${(sq.lift*100).toFixed(2)}%)</span></p>
    <p style="margin-top:.5rem;font-size:.82rem;color:#666">Values from Table 7 of Akella et al. (2026).</p>`;

  const exp = document.getElementById("exportOpt");
  exp.style.display = "inline-block";
  exp.onclick = () => {
    const blueprint = depts.map((d, i) => ({ id:d.id, name:d.name, x:+pos[i].x.toFixed(2), y:+pos[i].y.toFixed(2) }));
    const blob = new Blob([JSON.stringify({ storeType: hyper?"hypermarket":"supermarket", W, H, blueprint }, null, 2)], { type:"application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "optimized-blueprint.json"; a.click();
    RLOAnalytics.track("export_json", { page:"optimizer", n });
  };
  RLOAnalytics.track("optimizer_run", { hyper, n });
}

document.getElementById("optScreenshot").onclick = () => {
  html2canvas(document.getElementById("optResults")).then(c => {
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png"); a.download = "optimized-layout.png"; a.click();
    RLOAnalytics.track("screenshot_export", { page:"optimizer" });
  });
};