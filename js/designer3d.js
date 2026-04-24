/* 3D Store Designer — Three.js */
const container = document.getElementById("canvas3d");
const W_STORE = 100, H_STORE = 70;   // meters (hypermarket-ish default)

// --- Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe9ecef);
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / 600, 0.1, 1000);
camera.position.set(W_STORE*0.7, 60, H_STORE*1.2);
const renderer = new THREE.WebGLRenderer({ antialias:true, preserveDrawingBuffer:true });
renderer.setSize(container.clientWidth, 600);
container.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(W_STORE/2, 1, H_STORE/2);
controls.update();

// --- Lights ---
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(50, 100, 50); scene.add(dir);

// --- Floor & walls ---
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(W_STORE, H_STORE),
  new THREE.MeshStandardMaterial({ color:0xdee2e6 })
);
floor.rotation.x = -Math.PI/2;
floor.position.set(W_STORE/2, 0, H_STORE/2);
scene.add(floor);

// Grid
const grid = new THREE.GridHelper(Math.max(W_STORE,H_STORE), Math.max(W_STORE,H_STORE)/5, 0x888888, 0xcccccc);
grid.position.set(W_STORE/2, 0.02, H_STORE/2);
scene.add(grid);

// Entrance marker
const entrance = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5, 1.5, 0.3, 24),
  new THREE.MeshStandardMaterial({ color:0x2a9d8f })
);
entrance.position.set(2, 0.2, H_STORE-2);
scene.add(entrance);

// --- Department list sidebar ---
const dlist = document.getElementById("dept3d-list");
DEPARTMENTS.forEach(d => {
  const btn = document.createElement("button");
  btn.className = "dept-btn";
  btn.textContent = `${d.id}. ${d.name}`;
  btn.style.borderLeft = `5px solid ${d.color}`;
  btn.onclick = () => placeRandom(d);
  dlist.appendChild(btn);
});

// --- Placed departments (Three.js meshes) ---
const placed = [];       // { dept, mesh, label, x, z, h, area }
let selected = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function placeRandom(dept) {
  // avoid duplicates — move if existing
  const existing = placed.find(p => p.dept.id === dept.id);
  if (existing) { selectMesh(existing); return; }
  const x = 5 + Math.random()*(W_STORE-10);
  const z = 5 + Math.random()*(H_STORE-10);
  addDept(dept, x, z, dept.height, dept.area);
  RLOAnalytics.track("designer_place_dept", { page:"3d", id: dept.id });
}

function addDept(dept, x, z, h, area) {
  const side = Math.sqrt(area);
  const geom = new THREE.BoxGeometry(side, h, side);
  const mat = new THREE.MeshStandardMaterial({ color: dept.color, transparent:true, opacity:0.9 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, h/2, z);

  // Label (sprite)
  const canv = document.createElement("canvas");
  canv.width = 256; canv.height = 64;
  const cx = canv.getContext("2d");
  cx.fillStyle = "rgba(255,255,255,0.9)"; cx.fillRect(0,0,256,64);
  cx.fillStyle = "#222"; cx.font = "bold 20px sans-serif"; cx.textAlign = "center";
  cx.fillText(`${dept.id}. ${dept.name.substring(0,18)}`, 128, 38);
  const tex = new THREE.CanvasTexture(canv);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true }));
  sprite.scale.set(8, 2, 1);
  sprite.position.set(x, h + 1.5, z);

  scene.add(mesh); scene.add(sprite);
  const record = { dept, mesh, label: sprite, x, z, h, area };
  placed.push(record);
  updateSummary();
  return record;
}

// Click selection
renderer.domElement.addEventListener("click", ev => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left)/rect.width)*2 - 1;
  mouse.y = -((ev.clientY - rect.top)/rect.height)*2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(placed.map(p => p.mesh));
  if (hits.length) {
    const rec = placed.find(p => p.mesh === hits[0].object);
    selectMesh(rec);
  }
});

function selectMesh(rec) {
  placed.forEach(p => p.mesh.material.emissive && p.mesh.material.emissive.setHex(0x000000));
  if (rec) {
    rec.mesh.material.emissive = new THREE.Color(0x333333);
    selected = rec;
    document.getElementById("sel-info").innerHTML = `<strong>${rec.dept.name}</strong>`;
    document.getElementById("sel-controls").style.display = "block";
    document.getElementById("hSlide").value = rec.h;
    document.getElementById("hVal").textContent = rec.h.toFixed(1);
    document.getElementById("aSlide").value = rec.area;
    document.getElementById("aVal").textContent = rec.area;
  }
}

// Height/area live controls
document.getElementById("hSlide").oninput = e => {
  if (!selected) return;
  const h = +e.target.value;
  document.getElementById("hVal").textContent = h.toFixed(1);
  selected.h = h;
  selected.mesh.scale.y = h / selected.mesh.geometry.parameters.height;
  selected.mesh.position.y = h/2;
  selected.label.position.y = h + 1.5;
  RLOAnalytics.track("3d_height_change", { id: selected.dept.id, h });
};
document.getElementById("aSlide").oninput = e => {
  if (!selected) return;
  const a = +e.target.value; const s = Math.sqrt(a);
  document.getElementById("aVal").textContent = a;
  selected.area = a;
  const base = selected.mesh.geometry.parameters.width;
  selected.mesh.scale.x = s/base;
  selected.mesh.scale.z = s/base;
};

document.getElementById("clearBtn3d").onclick = () => {
  placed.forEach(p => { scene.remove(p.mesh); scene.remove(p.label); });
  placed.length = 0; selected = null;
  document.getElementById("sel-info").innerHTML = `<p class="empty">${t("d3_none")}</p>`;
  document.getElementById("sel-controls").style.display = "none";
  updateSummary();
};

// Load optimized layout: auto-place all 28 in optimizer output shape
document.getElementById("loadOpt").onclick = () => {
  // simple: run a small gradient descent once and populate
  placed.forEach(p => { scene.remove(p.mesh); scene.remove(p.label); });
  placed.length = 0;
  const pos = runSimpleOpt(DEPARTMENTS, true, W_STORE, H_STORE);
  DEPARTMENTS.forEach((d, i) => addDept(d, pos[i].x, pos[i].y, d.height, d.area));
};

function runSimpleOpt(depts, hyper, W, H) {
  const n = depts.length;
  const ideal = Array.from({length:n},() => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) {
    const v = Math.abs(depts[i].categories - depts[j].categories);
    let d = optimalDistance({ nonIdentical:(i+j)%2===1, variety:v, hyper });
    d = Math.min(d, Math.sqrt(W*W + H*H)*0.75);
    ideal[i][j] = ideal[j][i] = d;
  }
  const pos = depts.map(() => ({ x:Math.random()*W, y:Math.random()*H }));
  const LR = 0.02;
  for (let it = 0; it < 400; it++) {
    const g = pos.map(() => ({ x:0, y:0 }));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy) + 1e-6;
      const err = dist - ideal[i][j];
      g[i].x += err * dx / dist; g[i].y += err * dy / dist;
    }
    for (let i = 0; i < n; i++) {
      pos[i].x -= LR * g[i].x; pos[i].y -= LR * g[i].y;
      pos[i].x = Math.max(3, Math.min(W-3, pos[i].x));
      pos[i].y = Math.max(3, Math.min(H-3, pos[i].y));
    }
  }
  return pos;
}

function updateSummary() {
  document.getElementById("dep3dCount").textContent = placed.length;
  if (placed.length < 2) { document.getElementById("pred3dRev").textContent = "–"; return; }
  let total = 0;
  for (let i = 0; i < placed.length; i++) for (let j = i+1; j < placed.length; j++) {
    const dx = placed[i].x - placed[j].x, dy = placed[i].z - placed[j].z;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const v = Math.abs(placed[i].dept.categories - placed[j].dept.categories);
    total += predictJointSales({ idd: dist, nonIdentical:false, variety:v, hyper:true });
  }
  document.getElementById("pred3dRev").textContent = formatCurrency(total);
}

document.getElementById("downloadBtn3d").onclick = () => {
  const data = placed.map(p => ({ id:p.dept.id, name:p.dept.name, x:p.x, z:p.z, height:p.h, area:p.area }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "store-3d.json"; a.click();
  RLOAnalytics.track("export_json", { page:"3d", n: placed.length });
};

document.getElementById("screenshot3dBtn").onclick = () => {
  const img = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = img; a.download = "store-3d.png"; a.click();
  RLOAnalytics.track("screenshot_export", { page:"designer3d" });
};

// Animate
(function loop() {
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene, camera);
})();

// Resize
window.addEventListener("resize", () => {
  const w = container.clientWidth;
  renderer.setSize(w, 600);
  camera.aspect = w/600;
  camera.updateProjectionMatrix();
});