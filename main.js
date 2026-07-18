/* ==========================================================
   main.js — nav, reveals, typewriter, clock, likes, chat,
   terminal & WORLD52 overlay wiring (single-page site)
   ========================================================== */
(function () {

  /* ---------- scroll-spy nav ---------- */
  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = [...links].map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => spy.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

  /* ---------- typewriter ---------- */
  const LINES = [
    "i'm farbot, the resident ai. i translate his work.",
    "he ships ai that watches, reads, and schedules.",
    "sih grand finalist. 6+ projects. 1 live client.",
    "ask me anything — i keep the archive."
  ];
  const typer = document.getElementById('typer');
  if (typer) {
    let li = 0, ci = 0, deleting = false;
    function tick() {
      const line = LINES[li];
      if (!deleting) {
        ci++;
        if (ci === line.length) { deleting = true; setTimeout(tick, 2600); render(); return; }
      } else {
        ci--;
        if (ci === 0) { deleting = false; li = (li + 1) % LINES.length; }
      }
      render();
      setTimeout(tick, deleting ? 18 : 42);
    }
    function render() {
      typer.innerHTML = LINES[li].slice(0, ci) + '<span class="caret">▌</span>';
    }
    setTimeout(tick, 1200);
  }

  /* ---------- IST clock ---------- */
  function updateClock() {
    const t = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    const el1 = document.getElementById('ist-time');
    const el2 = document.getElementById('ist-time-2');
    if (el1) el1.textContent = t;
    if (el2) el2.textContent = t + ' IST';
  }
  updateClock(); setInterval(updateClock, 30000);

  /* ---------- likes (L key) ---------- */
  let likes = 0;
  const likeEl = document.getElementById('like-count');
  const likeHint = document.querySelector('.like-hint');
  function like() {
    likes++;
    if (likeEl) likeEl.textContent = '♥ ' + likes;
    burst();
  }
  function burst() {
    const h = document.createElement('div');
    h.textContent = '♥';
    h.style.cssText = 'position:fixed;left:' + (100 + Math.random() * 120) + 'px;bottom:60px;z-index:99;font-size:22px;color:#14b8a6;pointer-events:none;transition:all 1.1s ease-out;';
    document.body.appendChild(h);
    requestAnimationFrame(() => { h.style.transform = 'translateY(-140px) rotate(' + (Math.random() * 40 - 20) + 'deg)'; h.style.opacity = '0'; });
    setTimeout(() => h.remove(), 1200);
  }
  if (likeHint) likeHint.addEventListener('click', like);

  /* ---------- WORLD52 overlay ---------- */
  const worldOpen = () => window.WORLD52 && window.WORLD52.open();
  document.getElementById('open-world').addEventListener('click', worldOpen);
  const ow2 = document.getElementById('open-world-2');
  if (ow2) ow2.addEventListener('click', worldOpen);

  /* ---------- chat ---------- */
  const chatOverlay = document.getElementById('chat-overlay');
  const chatLog = document.getElementById('chat-log');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  function openChat(seedQuestion) {
    chatOverlay.hidden = false;
    if (!chatLog.childElementCount) {
      addMsg('bot', "Back from the work — I saw you looking. What brings you here?");
    }
    if (seedQuestion) ask(seedQuestion);
    chatInput.focus();
  }
  function closeChat() { chatOverlay.hidden = true; }

  function addMsg(who, text) {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
    return d;
  }
  function ask(q) {
    addMsg('user', q);
    const th = addMsg('bot', '…');
    setTimeout(() => {
      th.textContent = window.FARBOT.answer(q);
      chatLog.scrollTop = chatLog.scrollHeight;
    }, 450 + Math.random() * 500);
  }

  document.getElementById('open-chat').addEventListener('click', () => openChat());
  document.getElementById('close-chat').addEventListener('click', closeChat);
  chatOverlay.addEventListener('click', e => { if (e.target === chatOverlay) closeChat(); });
  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = chatInput.value.trim();
    if (!q) return;
    chatInput.value = '';
    ask(q);
  });
  document.querySelectorAll('.ask-chip').forEach(c =>
    c.addEventListener('click', () => openChat(c.dataset.q)));
  document.querySelectorAll('.open-chat-opt').forEach(c =>
    c.addEventListener('click', () => openChat(c.dataset.q)));

  /* ---------- terminal ---------- */
  const termOverlay = document.getElementById('term-overlay');
  const termLog = document.getElementById('term-log');
  const termForm = document.getElementById('term-form');
  const termInput = document.getElementById('term-input');

  function openTerm() {
    termOverlay.hidden = false;
    // focus after the browser finishes processing the click that opened it
    setTimeout(() => termInput.focus(), 0);
  }
  function closeTerm() { termOverlay.hidden = true; }

  document.getElementById('open-terminal-hint').addEventListener('click', openTerm);
  document.getElementById('close-term').addEventListener('click', closeTerm);
  termOverlay.addEventListener('click', e => { if (e.target === termOverlay) closeTerm(); });

  // clicking anywhere inside the terminal keeps the prompt focused
  document.getElementById('term-box').addEventListener('click', e => {
    if (e.target.closest('.term-close')) return;
    termInput.focus();
  });
  // if focus is ever lost while the terminal is open, typing any character re-routes to the prompt
  addEventListener('keydown', e => {
    if (termOverlay.hidden) return;
    if (document.activeElement === termInput) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') termInput.focus();
  });

  function tPrint(cls, text) {
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    termLog.appendChild(d);
    termLog.scrollTop = termLog.scrollHeight;
    return d;
  }

  const COMMANDS = {
    '/work':    () => { closeTerm(); location.hash = '#work'; },
    '/resume':  () => { closeTerm(); location.hash = '#resume'; },
    '/about':   () => { closeTerm(); location.hash = '#about'; },
    '/contact': () => { closeTerm(); location.hash = '#contact'; },
    '/world':   () => { closeTerm(); worldOpen(); },
    '/idea52':  () => { closeTerm(); worldOpen(); },
    '/cv':      () => { window.open('assets/Farhan_Sargath_Resume.pdf', '_blank'); },
    '/clear':   () => { termLog.innerHTML = ''; }
  };

  termForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = termInput.value.trim();
    if (!q) return;
    termInput.value = '';
    tPrint('t-in', q);
    const cmd = q.toLowerCase();
    if (COMMANDS[cmd]) {
      tPrint('t-out', '> ok. executing ' + cmd + ' …');
      setTimeout(COMMANDS[cmd], 350);
      return;
    }
    const proc = tPrint('t-proc', '> processing…');
    setTimeout(() => {
      proc.remove();
      tPrint('t-out', window.FARBOT.answer(q));
    }, 550 + Math.random() * 500);
  });

  /* ---------- global keys ---------- */
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      termOverlay.hidden ? openTerm() : closeTerm();
      return;
    }
    if (e.key === 'Escape') {
      if (window.WORLD52 && window.WORLD52.isOpen()) { window.WORLD52.close(); return; }
      closeChat(); closeTerm();
      return;
    }
    if (typing) return;
    if (!termOverlay.hidden || !chatOverlay.hidden) return; // overlays own the keys
    if (window.WORLD52 && window.WORLD52.isOpen()) return;  // world uses its own keys
    if (e.key.toLowerCase() === 'l') like();
  });

})();
