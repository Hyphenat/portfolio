/* ==========================================================
   WORLD52 — in-page walkable 3D world overlay
   Lazy-initialized on first open. window.WORLD52 = {open, close, isOpen}
   ========================================================== */
window.WORLD52 = (function () {
  if (typeof THREE === 'undefined') return { open: function(){}, close: function(){}, isOpen: function(){ return false; } };

  const overlay = document.getElementById('world-overlay');
  let initialized = false, running = false;

  /* ---------- beacon data (12) ---------- */
  const BEACONS = [
    { kind: 'AI PRODUCT', title: 'Cognify — EngageAI', desc: 'Real-time classroom engagement analytics. PyTorch vision scores attention live; teachers see it on WebSocket dashboards.', link: 'https://github.com/Hyphenat/Cognify-Classroom-Engagement-Analysis', pos: [14, 0, -10] },
    { kind: 'LEGAL TECH · NLP', title: 'Court Summarizer', desc: 'Full-stack platform that compresses hours of legal document review into seconds — summaries, parties, citations, dates.', link: 'https://github.com/Hyphenat/Court-Summarizer', pos: [-16, 0, -14] },
    { kind: 'CLIENT · LIVE 2026', title: 'General Brass Industries', desc: 'Deployed business website for a brass components manufacturer — reaching buyers beyond referral networks.', link: 'https://generalbrassind.com', pos: [4, 0, -26] },
    { kind: 'AUTOMATION', title: 'Schedulify', desc: 'Conflict-free college timetables in minutes. No double-booked faculty, no clashing rooms, full history.', link: 'https://github.com/Hyphenat/Automated-Timetable-Generator-----Schedulify', pos: [-8, 0, 18] },
    { kind: 'ML · E-COMMERCE', title: 'CompareKart', desc: 'Buy now or wait? Random Forest models read historical price patterns and predict what comes next.', link: 'https://github.com/Hyphenat', pos: [22, 0, 8] },
    { kind: 'ENTERPRISE · .NET', title: 'Employee Management System', desc: 'Records, departments, roles and HR workflows from one organized C#/.NET dashboard.', link: 'https://github.com/Hyphenat/Employee-Management-System', pos: [-24, 0, 4] },
    { kind: 'FINTECH · .NET', title: 'Payroll Management System', desc: 'Automated salary processing, tax calculation and reporting — payroll errors cost trust, not just time.', link: 'https://github.com/Hyphenat', pos: [10, 0, 24] },
    { kind: 'HACKATHON', title: 'SIH — Grand Finalist', desc: "Smart India Hackathon: grand finalist at India's biggest hackathon.", link: '', pos: [-4, 0, -40] },
    { kind: 'HACKATHON', title: 'Intellify 4.0 — Finalist', desc: 'Finalist at Intellify 4.0.', link: '', pos: [32, 0, -22] },
    { kind: 'HACKATHON', title: 'Project Morpheus 2026 — Finalist', desc: 'Finalist at Project Morpheus 2026.', link: '', pos: [-34, 0, -26] },
    { kind: 'CERTIFICATION', title: 'Cisco CCNA ×2', desc: 'CCNA: Introduction to Networks + Switching, Routing & Wireless Essentials (2025).', link: '', pos: [-30, 0, 22] },
    { kind: 'CERTIFICATION', title: 'Linux · Cybersecurity · Packet Tracer', desc: 'Linux Essentials, Introduction to Cybersecurity, and Cisco Packet Tracer — Cisco Networking Academy 2025.', link: '', pos: [28, 0, 26] },
  ];

  /* ---------- shared state ---------- */
  let scene, camera, renderer, player, clock;
  const beaconMeshes = [];
  const found = new Set();
  const state = { x: 0, z: 6, yaw: 0, pitch: 0.32, vx: 0, vz: 0, entered: false };
  const keys = {};

  function init() {
    if (initialized) return;
    initialized = true;

    const canvas = document.getElementById('world');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b11);
    scene.fog = new THREE.FogExp2(0x070b11, 0.022);

    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    scene.add(new THREE.AmbientLight(0x33445a, 0.9));
    const moon = new THREE.DirectionalLight(0x8fb6d9, 0.5);
    moon.position.set(10, 30, -10);
    scene.add(moon);

    // ground + grid
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: 0x0a121c }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    const grid = new THREE.GridHelper(400, 120, 0x14303c, 0x0e1d28);
    grid.position.y = 0.01;
    scene.add(grid);

    // stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const r = 120 + Math.random() * 120, th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 0.45;
      starPos[i * 3] = r * Math.cos(th) * Math.sin(ph);
      starPos[i * 3 + 1] = r * Math.cos(ph) * 0.6 + 12;
      starPos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x6fa8c9, size: 0.35 })));

    // rocks
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x101b28 });
    for (let i = 0; i < 60; i++) {
      const s = 0.5 + Math.random() * 2.2;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), rockMat);
      const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 130;
      rock.position.set(Math.cos(a) * d, s * 0.4, Math.sin(a) * d);
      rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      scene.add(rock);
    }

    // beacons
    BEACONS.forEach((b, i) => {
      const g = new THREE.Group();
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.55, 16, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x38e1cf, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
      );
      pillar.position.y = 8;
      g.add(pillar);
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.MeshPhongMaterial({ color: 0x0f2f2c, emissive: 0x38e1cf, emissiveIntensity: 0.9, shininess: 120 })
      );
      core.position.y = 1.6;
      g.add(core);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.3, 1.7, 40),
        new THREE.MeshBasicMaterial({ color: 0x38e1cf, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      g.add(ring);
      const light = new THREE.PointLight(0x38e1cf, 0.9, 14);
      light.position.y = 2;
      g.add(light);
      g.position.set(b.pos[0], 0, b.pos[2]);
      scene.add(g);
      beaconMeshes.push({ group: g, core, ring, pillar, light, data: b, idx: i });
    });

    // player marker (mini farbot)
    player = new THREE.Group();
    const glossy = new THREE.MeshPhongMaterial({ color: 0x0c0d10, shininess: 150, specular: 0x8899aa });
    const pBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), glossy);
    pBody.scale.set(1, 1.25, 1); pBody.position.y = 0.75;
    player.add(pBody);
    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), glossy);
    pHead.position.y = 1.35;
    player.add(pHead);
    const pVisor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.05), new THREE.MeshBasicMaterial({ color: 0x38e1cf }));
    pVisor.position.set(0, 1.38, 0.21);
    player.add(pVisor);
    const pGlow = new THREE.PointLight(0x38e1cf, 0.5, 6);
    pGlow.position.y = 1.2;
    player.add(pGlow);
    scene.add(player);

    clock = new THREE.Clock();
    bindControls();
    buildMap();
    animate();
  }

  /* ---------- controls (scoped: only act while overlay open) ---------- */
  function bindControls() {
    addEventListener('keydown', e => {
      if (!isOpen()) return;
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
      if (k === 'm' && state.entered) toggleMap();
    });
    addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

    let dragging = false, lx = 0, ly = 0;
    overlay.addEventListener('mousedown', e => {
      if (!state.entered) return;
      dragging = true; lx = e.clientX; ly = e.clientY;
    });
    addEventListener('mouseup', () => dragging = false);
    addEventListener('mousemove', e => {
      if (!dragging || !isOpen()) return;
      state.yaw -= (e.clientX - lx) * 0.004;
      state.pitch = Math.min(1.1, Math.max(0.08, state.pitch + (e.clientY - ly) * 0.003));
      lx = e.clientX; ly = e.clientY;
    });
    overlay.addEventListener('touchstart', e => { if (e.touches[0]) { lx = e.touches[0].clientX; ly = e.touches[0].clientY; } }, { passive: true });
    overlay.addEventListener('touchmove', e => {
      if (!e.touches[0] || !state.entered) return;
      state.yaw -= (e.touches[0].clientX - lx) * 0.005;
      keys['w'] = true;
      lx = e.touches[0].clientX; ly = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener('touchend', () => { keys['w'] = false; });

    addEventListener('resize', () => {
      if (!initialized) return;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  }

  /* ---------- unlock toast ---------- */
  const unlockEl = document.getElementById('unlock');
  let toastTimer = null;
  function showUnlock(b) {
    document.getElementById('u-kind').textContent = '◈ UNLOCKED · ' + b.kind;
    document.getElementById('u-title').textContent = b.title;
    document.getElementById('u-desc').textContent = b.desc;
    const link = document.getElementById('u-link');
    if (b.link) { link.href = b.link; link.hidden = false; } else link.hidden = true;
    unlockEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => unlockEl.classList.remove('show'), 6000);
  }

  /* ---------- map ---------- */
  const mapWrap = document.getElementById('map-wrap');
  function buildMap() {
    const mapGrid = document.getElementById('map-grid');
    BEACONS.forEach((b, i) => {
      const btn = document.createElement('button');
      btn.className = 'map-item';
      btn.id = 'map-item-' + i;
      btn.textContent = (i + 1 < 10 ? '0' : '') + (i + 1) + ' · ' + b.title;
      btn.addEventListener('click', () => {
        state.x = b.pos[0] + 3; state.z = b.pos[2] + 3;
        closeMap();
      });
      mapGrid.appendChild(btn);
    });
    document.getElementById('map-btn').addEventListener('click', toggleMap);
    document.getElementById('map-close').addEventListener('click', closeMap);
    mapWrap.addEventListener('click', e => { if (e.target === mapWrap) closeMap(); });
  }
  function toggleMap() { mapWrap.hidden = !mapWrap.hidden; }
  function closeMap() { mapWrap.hidden = true; }
  function mapOpen() { return !mapWrap.hidden; }

  /* ---------- loop ---------- */
  function animate() {
    if (running) requestAnimationFrame(animate);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    if (state.entered) {
      const run = keys['shift'] ? 2 : 1;
      const sp = 9 * run;
      let fx = 0, fz = 0;
      if (keys['w'] || keys['arrowup']) { fx += Math.sin(state.yaw); fz += Math.cos(state.yaw); }
      if (keys['s'] || keys['arrowdown']) { fx -= Math.sin(state.yaw); fz -= Math.cos(state.yaw); }
      if (keys['a'] || keys['arrowleft']) { fx += Math.cos(state.yaw); fz -= Math.sin(state.yaw); }
      if (keys['d'] || keys['arrowright']) { fx -= Math.cos(state.yaw); fz += Math.sin(state.yaw); }
      const len = Math.hypot(fx, fz) || 1;
      state.vx += (fx / len * sp - state.vx) * 0.12;
      state.vz += (fz / len * sp - state.vz) * 0.12;
      state.x -= state.vx * dt;
      state.z -= state.vz * dt;
      state.x = Math.max(-160, Math.min(160, state.x));
      state.z = Math.max(-160, Math.min(160, state.z));

      if (Math.hypot(state.vx, state.vz) > 0.4) {
        player.rotation.y = Math.atan2(-state.vx, -state.vz);
        player.position.y = Math.abs(Math.sin(t * 9)) * 0.12;
      } else {
        player.position.y = Math.sin(t * 2) * 0.03;
      }
    }

    player.position.x = state.x;
    player.position.z = state.z;

    const camDist = 9, camH = 3.5 + state.pitch * 6;
    camera.position.x += (state.x + Math.sin(state.yaw) * camDist - camera.position.x) * 0.08;
    camera.position.z += (state.z + Math.cos(state.yaw) * camDist - camera.position.z) * 0.08;
    camera.position.y += (camH - camera.position.y) * 0.08;
    camera.lookAt(state.x, 1.4, state.z);

    beaconMeshes.forEach(b => {
      b.core.rotation.y = t * 0.8 + b.idx;
      b.core.position.y = 1.6 + Math.sin(t * 1.5 + b.idx) * 0.25;
      const s = 1 + Math.sin(t * 2 + b.idx) * 0.12;
      b.ring.scale.set(s, s, 1);
      const d = Math.hypot(state.x - b.group.position.x, state.z - b.group.position.z);
      if (state.entered && d < 3 && !found.has(b.idx)) {
        found.add(b.idx);
        b.core.material.emissive.setHex(0xf5c518);
        b.pillar.material.color.setHex(0xf5c518);
        b.light.color.setHex(0xf5c518);
        document.getElementById('found-count').textContent = found.size;
        const mi = document.getElementById('map-item-' + b.idx);
        if (mi) mi.classList.add('found');
        showUnlock(b.data);
      }
    });

    renderer.render(scene, camera);
  }

  /* ---------- public api ---------- */
  function open() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    init();
    if (!running) { running = true; clock.getDelta(); animate(); }
  }
  function close() {
    if (mapOpen()) { closeMap(); return; }
    overlay.hidden = true;
    running = false;
    document.body.style.overflow = '';
  }
  function isOpen() { return !overlay.hidden; }

  // wire enter + exit buttons
  document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('intro-wrap').classList.add('hide');
    state.entered = true;
  });
  document.getElementById('world-exit').addEventListener('click', close);

  return { open, close, isOpen };
})();
