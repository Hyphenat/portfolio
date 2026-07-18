/* ==========================================================
   Farbot — glossy 3D robot that follows the cursor (Three.js r128)
   ========================================================== */
(function () {
  const canvas = document.getElementById('robot-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.1, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfeee8, 0.7);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffffff, 0.4);
  fill.position.set(0, -2, 5);
  scene.add(fill);

  /* ---------- materials ---------- */
  const blackGloss = new THREE.MeshPhongMaterial({ color: 0x0c0d10, shininess: 160, specular: 0x8899aa });
  const chrome     = new THREE.MeshPhongMaterial({ color: 0xd9dde2, shininess: 200, specular: 0xffffff });
  const visorGlow  = new THREE.MeshBasicMaterial({ color: 0x36e2cf });
  const amberGlow  = new THREE.MeshBasicMaterial({ color: 0xffb347 });

  /* ---------- robot ---------- */
  const robot = new THREE.Group();
  scene.add(robot);

  // --- head (helmet) ---
  const head = new THREE.Group();
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 40), blackGloss);
  helmet.scale.set(1, 1.12, 1.02);
  helmet.castShadow = true;
  head.add(helmet);
  // crest ridge
  const crest = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), blackGloss);
  crest.scale.set(0.28, 1.16, 1.02);
  crest.position.y = 0.06;
  head.add(crest);
  // visor — glowing angled bracket shape (two bars)
  const visorL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.34, 0.05), visorGlow);
  visorL.position.set(-0.16, -0.02, 0.66);
  visorL.rotation.z = 0.25;
  head.add(visorL);
  const visorT = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.075, 0.05), visorGlow);
  visorT.position.set(0.02, 0.15, 0.66);
  head.add(visorT);
  const eyeDot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), amberGlow);
  eyeDot.position.set(0.18, -0.07, 0.685);
  head.add(eyeDot);
  head.position.y = 1.55;
  robot.add(head);

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.28, 20), chrome);
  neck.position.y = 1.05;
  robot.add(neck);

  // --- torso ---
  const torso = new THREE.Group();
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.62, 36, 36), blackGloss);
  chest.scale.set(1, 1.18, 0.78);
  chest.castShadow = true;
  torso.add(chest);
  // chest emblem
  const emblem = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 4, 1), visorGlow);
  emblem.position.set(0, 0.18, 0.51);
  emblem.rotation.z = Math.PI / 4;
  torso.add(emblem);
  torso.position.y = 0.35;
  robot.add(torso);

  // pelvis
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 28), chrome);
  pelvis.scale.set(1, 0.8, 0.9);
  pelvis.position.y = -0.55;
  robot.add(pelvis);

  // --- arms ---
  function makeArm(side) {
    const g = new THREE.Group();
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), chrome);
    g.add(shoulder);
    const upper = new THREE.Mesh(new THREE.SphereGeometry(0.24, 26, 26), blackGloss);
    upper.scale.set(0.75, 1.5, 0.75);
    upper.position.y = -0.42;
    upper.castShadow = true;
    g.add(upper);
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chrome);
    elbow.position.y = -0.82;
    g.add(elbow);
    const fore = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 24), blackGloss);
    fore.scale.set(0.7, 1.4, 0.7);
    fore.position.y = -1.12;
    fore.castShadow = true;
    g.add(fore);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), chrome);
    hand.scale.set(1, 1.2, 0.7);
    hand.position.y = -1.44;
    g.add(hand);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.05), amberGlow);
    stripe.position.set(side * 0.13, -0.42, 0.12);
    g.add(stripe);
    g.position.set(side * 0.78, 0.72, 0);
    g.rotation.z = side * -0.18;
    return g;
  }
  const armL = makeArm(-1), armR = makeArm(1);
  robot.add(armL, armR);

  // --- legs ---
  function makeLeg(side) {
    const g = new THREE.Group();
    const hip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), chrome);
    g.add(hip);
    const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 26, 26), blackGloss);
    thigh.scale.set(0.8, 1.5, 0.8);
    thigh.position.y = -0.45;
    thigh.castShadow = true;
    g.add(thigh);
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), chrome);
    knee.position.y = -0.85;
    g.add(knee);
    const shin = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), blackGloss);
    shin.scale.set(0.85, 1.5, 0.85);
    shin.position.y = -1.2;
    shin.castShadow = true;
    g.add(shin);
    const boot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 22), blackGloss);
    boot.scale.set(1, 0.6, 1.5);
    boot.position.set(0, -1.55, 0.1);
    boot.castShadow = true;
    g.add(boot);
    g.position.set(side * 0.32, -0.72, 0);
    return g;
  }
  robot.add(makeLeg(-1), makeLeg(1));

  // soft ground shadow catcher
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.18 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.75;
  ground.receiveShadow = true;
  scene.add(ground);

  // smaller robot — a companion, not a giant
  robot.position.y = 0.1;
  robot.scale.set(0.68, 0.68, 0.68);

  /* ---------- cursor tracking ---------- */
  const mouse = { x: 0, y: 0 };       // normalized -1..1
  const smooth = { x: 0, y: 0 };
  addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });
  addEventListener('touchmove', (e) => {
    if (!e.touches[0]) return;
    mouse.x = (e.touches[0].clientX / innerWidth) * 2 - 1;
    mouse.y = (e.touches[0].clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  /* ---------- animate ---------- */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // smooth-follow the cursor
    smooth.x += (mouse.x - smooth.x) * 0.06;
    smooth.y += (mouse.y - smooth.y) * 0.06;

    // head looks at cursor (stronger), body turns gently
    head.rotation.y = smooth.x * 0.85;
    head.rotation.x = smooth.y * 0.45;
    robot.rotation.y = smooth.x * 0.35;
    robot.rotation.x = smooth.y * 0.08;

    // idle life: bob + breathing + arm sway
    robot.position.y = 0.1 + Math.sin(t * 1.6) * 0.06;
    torso.scale.y = 1 + Math.sin(t * 2.2) * 0.012;
    armL.rotation.x = Math.sin(t * 1.6) * 0.08;
    armR.rotation.x = -Math.sin(t * 1.6) * 0.08;

    // visor flicker
    visorGlow.color.setHSL(0.47, 0.75, 0.55 + Math.sin(t * 3) * 0.06);

    renderer.render(scene, camera);
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
