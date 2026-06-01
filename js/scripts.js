/* ═══════════════════════════════════════════════════════════════
   LUSCENT'S — scripts.js
   Arquitectura modular. Catálogo en catalog.js, UI aquí.
   Namespace: LS
═══════════════════════════════════════════════════════════════ */

const LS = (() => {

  /* ── CONSTANTES ─────────────────────── */
  const WA_NUM      = "56938861838";
  const IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23F4F1EC'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%23C8BFB5'%3E%F0%9F%AA%B4%3C/text%3E%3C%2Fsvg%3E";
  const COUPONS      = {
   // "LUSCENT10":  { type:"percent", value:10,   label:"10% de descuento" },
    //"BIENVENIDA": { type:"fixed",   value:3000, label:"$3.000 de descuento" },
    //"MAYORISTA":  { type:"percent", value:15,   label:"15% descuento mayorista" },
  };

  /* ── HELPERS ────────────────────────── */
  const $ = id => document.getElementById(id);
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const fmt = n => "$ " + n.toLocaleString("es-CL");
  const imgPath = name => `img/${name}.png`;
  const catLabel = cat => ({ arabe:"Árabe", disenador:"Diseñador", nicho:"Nicho" }[cat] || cat);

  const condLabel = c => ({
    "sellado":     { text:"Sellado",    css:"sellado"    },
    "casi-lleno":  { text:"Casi lleno", css:"casi-lleno" },
    "parcial":     { text:"Parcial",    css:"parcial"    },
  }[c] || { text:c, css:"parcial" });

  function imgFallback(el) {
    if (!el) return;
    el.addEventListener("error", function h() {
      this.src = IMG_FALLBACK;
      this.removeEventListener("error", h);
    }, { once: true });
  }

  function observeCards(container, selector) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }});
    }, { threshold: 0.05 });
    qa(selector, container).forEach(c => io.observe(c));
  }

  /* ── DATOS ──────────────────────────── */
  const allProducts = (typeof products !== "undefined" ? products : []).filter(p => p.active !== false);
  const allHotSales = (typeof hotSales !== "undefined" ? hotSales : []).filter(h => h.active !== false);
  const allSets     = (typeof sets     !== "undefined" ? sets     : []).filter(s => s.active !== false);
  const isCyber     = (typeof CYBER_ACTIVE !== "undefined") && CYBER_ACTIVE;

  /* Exportar activeProducts para solicitud.html */
  window.activeProducts = allProducts;

  /* ── PRECIO CYBER ───────────────────── */
  const decantPrices = p => {
    const has = isCyber && (p.cyberP5 || p.cyberP25);
    return {
      ap5:  has ? (p.cyberP5  || p.p5)  : p.p5,
      ap25: has ? (p.cyberP25 || p.p25) : p.p25,
      xp5:  has ? p.p5  : null,
      xp25: has ? p.p25 : null,
      cyber: has,
    };
  };

  const hotSalePrice = h => {
    const has = isCyber && h.cyberPrice;
    return {
      price:  has ? h.cyberPrice : h.price,
      cross:  has ? h.price : (h.originalPrice || null),
      cyber:  has,
    };
  };

  const setPrice = s => {
    if (isCyber && s.cyberPrice) {
      const cross = Math.round((s.originalPrice || s.price) * 1.65 / 500) * 500;
      return { price: s.cyberPrice, cross, cyber: true };
    }
    return { price: s.price, cross: s.originalPrice || null, cyber: false };
  };

  /* ── CARRITO ────────────────────────── */
  let cart = (() => { try { return JSON.parse(localStorage.getItem("ls_cart")) || []; } catch { return []; }})();
  const saveCart = () => { try { localStorage.setItem("ls_cart", JSON.stringify(cart)); } catch {} };

  /* ── ESTADO DE FILTROS ──────────────── */
  let state = { cat: "all", ocasion: "all", emocion: "all", search: "", sort: null };

  function getFiltered() {
    let list = allProducts.filter(p => {
      const { cat, ocasion, emocion, search } = state;
      const q2 = search.toLowerCase().trim();
      return (cat === "all" || cat === "sets" || p.cat === cat)
        && (ocasion === "all" || p.ocasion.includes(ocasion))
        && (emocion === "all" || p.emocion.includes(emocion))
        && (!q2 || p.name.toLowerCase().includes(q2) || p.brand.toLowerCase().includes(q2) || (p.sim && p.sim.toLowerCase().includes(q2)));
    });
    if (state.sort === "asc")  list = [...list].sort((a,b) => a.p5 - b.p5);
    if (state.sort === "desc") list = [...list].sort((a,b) => b.p5 - a.p5);
    return list;
  }

  function getFilteredSets() {
    const q2 = state.search.toLowerCase().trim();
    let list = allSets.filter(s =>
      !q2 || s.name.toLowerCase().includes(q2) || s.desc.toLowerCase().includes(q2)
           || s.items.some(i => i.name.toLowerCase().includes(q2) || i.brand.toLowerCase().includes(q2))
    );
    if (state.sort === "asc")  list = [...list].sort((a,b) => setPrice(a).price - setPrice(b).price);
    if (state.sort === "desc") list = [...list].sort((a,b) => setPrice(b).price - setPrice(a).price);
    return list;
  }

  /* ── RENDER CATÁLOGO ────────────────── */
  function render() {
    const grid      = $("product-grid");
    const countEl   = $("result-count");
    const decantsEl = $("decants-section");
    const setsSec   = $("sets-inline-section");
    if (!grid || !countEl) return;

    if (state.cat === "sets") {
      if (decantsEl) decantsEl.style.display = "none";
      if (setsSec)   setsSec.style.display   = "";
      const fs = getFilteredSets();
      countEl.textContent = `${fs.length} set${fs.length !== 1 ? "s" : ""}`;
      renderSets(fs);
      return;
    }

    if (decantsEl) decantsEl.style.display = "";
    const filtered     = getFiltered();
    const q2           = state.search.toLowerCase().trim();
    const filteredSets = q2 ? getFilteredSets() : [];
    const showSets     = filteredSets.length > 0;

    if (setsSec) setsSec.style.display = showSets ? "" : "none";
    if (showSets) {
      const setsMeta = $("sets-inline-meta");
      if (setsMeta) setsMeta.textContent = `${filteredSets.length} set${filteredSets.length !== 1 ? "s" : ""} encontrado${filteredSets.length !== 1 ? "s" : ""}`;
      renderSets(filteredSets);
    }

    countEl.textContent = q2
      ? `${filtered.length} fragancia${filtered.length !== 1 ? "s" : ""}${filteredSets.length ? ` + ${filteredSets.length} set${filteredSets.length !== 1 ? "s" : ""}` : ""}`
      : `${filtered.length} fragancia${filtered.length !== 1 ? "s" : ""}`;

    if (!filtered.length) {
      grid.innerHTML = `<p class="empty-state">No encontramos fragancias con esta combinación.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const idx   = allProducts.indexOf(p);
      const beast = p.emocion.includes("proyeccion-atomica");
      const dp    = decantPrices(p);
      return `
        <article class="product-card${dp.cyber ? " product-card--cyber" : ""}" data-idx="${idx}" role="button" tabindex="0" aria-label="${p.brand} ${p.name}">
          <div class="card__img-wrap">
            ${dp.cyber ? `<span class="card__cyber-badge">Cyber</span>` : ""}
            <img src="${imgPath(p.img)}" alt="${p.brand} ${p.name}" loading="lazy"/>
          </div>
          <div class="card__body">
            <span class="card__cat cat--${p.cat}">${catLabel(p.cat)}</span>
            <p class="card__brand">${p.brand}</p>
            <h3 class="card__name">${p.name}${beast ? `<span class="card__tag-beast">Proyección Atómica</span>` : ""}</h3>
            ${p.sim ? `<p class="card__sim">Similar a ${p.sim}</p>` : `<p class="card__sim" aria-hidden="true"></p>`}
            <div class="card__prices">
              <div class="card__price">
                <span class="card__price-size">2,5 ml</span>
                ${dp.xp25 ? `<span class="card__price-crossed">${fmt(dp.xp25)}</span>` : ""}
                <span class="card__price-amount${dp.cyber ? " card__price-amount--cyber" : ""}">${fmt(dp.ap25)}</span>
              </div>
              <div class="card__price">
                <span class="card__price-size">5 ml</span>
                ${dp.xp5 ? `<span class="card__price-crossed">${fmt(dp.xp5)}</span>` : ""}
                <span class="card__price-amount${dp.cyber ? " card__price-amount--cyber" : ""}">${fmt(dp.ap5)}</span>
              </div>
            </div>
          </div>
        </article>`;
    }).join("");

    qa("img", grid).forEach(imgFallback);
    qa(".product-card", grid).forEach(card => {
      const idx = parseInt(card.dataset.idx);
      card.addEventListener("click", () => openDecantModal(idx));
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDecantModal(idx); }});
    });
    observeCards(grid, ".product-card");
  }

  /* ── RENDER HOT SALES ───────────────── */
  function renderHotSales() {
    const section = $("hot-sales-section");
    const grid    = $("hot-sales-grid");
    if (!section || !grid) return;
    if (!allHotSales.length) { section.style.display = "none"; return; }
    section.style.display = "";

    grid.innerHTML = allHotSales.map((h, idx) => {
      const cond = condLabel(h.condition);
      const hp   = hotSalePrice(h);
      const hasCross  = hp.cross && hp.cross > hp.price;
      const discPct   = hasCross ? Math.round((1 - hp.price / hp.cross) * 100) : 0;
      return `
        <article class="hs-card${hp.cyber ? " hs-card--cyber" : ""}" data-hs="${idx}" role="button" tabindex="0" aria-label="${h.brand} ${h.name}">
          <div class="hs-card__img-wrap">
            ${hasCross ? `<span class="hs-card__discount">-${discPct}%</span>` : ""}
            ${hp.cyber ? `<span class="hs-card__cyber-badge">Cyber</span>` : ""}
            <img src="${imgPath(h.img)}" alt="${h.brand} ${h.name}" loading="lazy"/>
          </div>
          <div class="hs-card__body">
            <div class="hs-card__top">
              <span class="hs-card__cond hs-card__cond--${cond.css}">${cond.text}</span>
              <span class="hs-card__size">${h.size}</span>
            </div>
            <p class="hs-card__brand">${h.brand}</p>
            <h3 class="hs-card__name">${h.name}</h3>
            <p class="hs-card__notas">${h.notas}</p>
            <div class="hs-card__prices">
              ${hasCross ? `<span class="hs-card__original">${fmt(hp.cross)}</span>` : ""}
              <span class="hs-card__price${hp.cyber ? " hs-card__price--cyber" : ""}">${fmt(hp.price)}</span>
            </div>
          </div>
        </article>`;
    }).join("");

    qa("img", grid).forEach(imgFallback);
    qa(".hs-card", grid).forEach(card => {
      const idx = parseInt(card.dataset.hs);
      const open = () => openHSModal(idx);
      card.addEventListener("click", open);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }});
    });
    observeCards(grid, ".hs-card");
  }

  /* ── RENDER SETS ────────────────────── */
  function renderSets(list) {
    const grid = $("sets-grid");
    if (!grid) return;
    const theList = list !== undefined ? list : getFilteredSets();

    if (!theList.length) { grid.innerHTML = `<p class="empty-state">No hay sets que coincidan.</p>`; return; }

    grid.innerHTML = theList.map(s => {
      const realIdx    = allSets.indexOf(s);
      const sp         = setPrice(s);
      const hasCross   = sp.cross && sp.cross > sp.price;
      const discPct    = hasCross ? Math.round((1 - sp.price / sp.cross) * 100) : 0;
      const savings    = hasCross ? sp.cross - sp.price : 0;
      const showCount  = s.items.length >= 4;
      const imgs       = s.items.slice(0, 3);

      return `
        <article class="set-card${sp.cyber ? " set-card--cyber" : ""}" data-set="${realIdx}" role="button" tabindex="0" aria-label="Set ${s.name}">
          <div class="set-card__collage">
            ${imgs.map((item, i) => `
              <div class="set-card__collage-item set-card__collage-item--${i+1}">
                <img src="${imgPath(item.img)}" alt="${item.brand} ${item.name}" loading="lazy"/>
              </div>`).join("")}
            ${hasCross ? `<span class="set-card__disc-badge">${sp.cyber ? `Cyber -${discPct}%` : `-${discPct}%`}</span>` : ""}
            ${sp.cyber && !hasCross ? `<span class="set-card__cyber-badge">Cyber</span>` : ""}
            ${showCount ? `<span class="set-card__count-badge">${s.items.length} decants</span>` : ""}
          </div>
          <div class="set-card__body">
            ${s.badge ? `<span class="set-card__badge">${s.badge}</span>` : ""}
            <h3 class="set-card__name">${s.name}</h3>
            <p class="set-card__count">${s.items.length} decants de ${s.size} c/u</p>
            <p class="set-card__desc">${s.desc}</p>
            <div class="set-card__pricing">
              ${hasCross ? `<span class="set-card__original">${fmt(sp.cross)}</span>` : ""}
              <span class="set-card__price${sp.cyber ? " set-card__price--cyber" : ""}">${fmt(sp.price)}</span>
              ${savings ? `<span class="set-card__saving">Ahorras ${fmt(savings)}</span>` : ""}
            </div>
          </div>
        </article>`;
    }).join("");

    qa("img", grid).forEach(imgFallback);
    qa(".set-card", grid).forEach(card => {
      const idx  = parseInt(card.dataset.set);
      const open = () => openSetModal(idx);
      card.addEventListener("click", open);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }});
    });
    observeCards(grid, ".set-card");
  }

  /* ── PILLS BAR ──────────────────────── */
  function initPills() {
    qa(".pills-bar span").forEach(s => { if (s.textContent.includes("fragancias")) s.textContent = `${allProducts.length} fragancias disponibles`; });
    const pb = q(".pills-bar");
    if (!pb) return;
    if (isCyber) {
      pb.classList.add("pills-bar--cyber");
      if (!q(".pill--cyber", pb)) {
        const s = document.createElement("span");
        s.className = "pill--cyber";
        s.textContent = "⚡ Cyber Days — Precios especiales";
        pb.prepend(s);
      }
    }
  }

  /* ── CYBER HERO ─────────────────────── */
  function initCyberHero() {
    if (!isCyber) return;
    const hero = q(".hero");
    if (!hero) return;

    const CYBER_END = (typeof CYBER_END_DATE !== "undefined")
      ? new Date(CYBER_END_DATE)
      : new Date(Date.now() + 3 * 86400000);

    hero.classList.add("hero--cyber");
    hero.innerHTML = `
      <canvas class="cyber-particles" id="cyber-canvas" aria-hidden="true"></canvas>
      <div class="hero__inner hero__inner--cyber">
        <div class="cyber-hero__top">
          <span class="cyber-hero__tag">Cyber Days</span>
          <span class="cyber-hero__tag cyber-hero__tag--alt">Descuentos reales · Solo por tiempo limitado</span>
        </div>
        <h1 class="hero__title cyber-hero__title">Precios que<br><em>no vuelven.</em></h1>
        <p class="hero__sub cyber-hero__sub">Decants originales con descuento en toda la tienda. Aprovecha antes que termine.</p>
        <div class="cyber-countdown" id="cyber-countdown" aria-live="polite">
          <div class="cyber-countdown__block">
            <span class="cyber-countdown__num" id="cd-days">--</span>
            <span class="cyber-countdown__label">días</span>
          </div>
          <span class="cyber-countdown__sep">:</span>
          <div class="cyber-countdown__block">
            <span class="cyber-countdown__num" id="cd-hours">--</span>
            <span class="cyber-countdown__label">horas</span>
          </div>
          <span class="cyber-countdown__sep">:</span>
          <div class="cyber-countdown__block">
            <span class="cyber-countdown__num" id="cd-mins">--</span>
            <span class="cyber-countdown__label">min</span>
          </div>
          <span class="cyber-countdown__sep">:</span>
          <div class="cyber-countdown__block">
            <span class="cyber-countdown__num" id="cd-secs">--</span>
            <span class="cyber-countdown__label">seg</span>
          </div>
        </div>
        <div class="hero__actions">
          <a href="#catalogo" class="btn btn--hero cyber-btn--primary">Ver ofertas Cyber</a>
          <a href="#catalogo" class="btn btn--sets cyber-btn--sets" id="hero-sets-btn">Sets en descuento</a>
        </div>
      </div>`;

    q("#hero-sets-btn", hero)?.addEventListener("click", e => {
      e.preventDefault();
      $("catalogo")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => activateSetsView(), 400);
    });

    const pad = n => String(n).padStart(2, "0");
    const tick = () => {
      const diff = CYBER_END - Date.now();
      if (diff <= 0) { ["cd-days","cd-hours","cd-mins","cd-secs"].forEach(id => { const el = $(id); if (el) el.textContent = "00"; }); return; }
      if ($("cd-days"))  $("cd-days").textContent  = pad(Math.floor(diff / 86400000));
      if ($("cd-hours")) $("cd-hours").textContent = pad(Math.floor((diff % 86400000) / 3600000));
      if ($("cd-mins"))  $("cd-mins").textContent  = pad(Math.floor((diff % 3600000) / 60000));
      if ($("cd-secs"))  $("cd-secs").textContent  = pad(Math.floor((diff % 60000) / 1000));
    };
    tick();
    setInterval(tick, 1000);

    const canvas = $("cyber-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + .4, dx: (Math.random() - .5) * .4, dy: (Math.random() - .5) * .4,
      a: Math.random() * .5 + .15, c: Math.random() > .5 ? "184,147,90" : "22,74,65",
    }));
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ── MOBILE NAV ─────────────────────── */
  function initMobileNav() {
    const nav = $("main-nav");
    if (!nav || $("hamburger-btn")) return;

    const btn = document.createElement("button");
    btn.id = "hamburger-btn"; btn.className = "hamburger-btn";
    btn.setAttribute("aria-label", "Abrir menú");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = "<span></span><span></span><span></span>";
    nav.appendChild(btn);

    const overlay = document.createElement("div");
    overlay.id = "mobile-overlay"; overlay.className = "mobile-overlay";
    document.body.appendChild(overlay);

    const close = () => {
      nav.classList.remove("nav--mobile-open");
      btn.setAttribute("aria-expanded", "false");
      overlay.classList.remove("open");
      if (!anyModalOpen()) document.body.style.overflow = "";
    };
    const toggle = () => {
      const open = nav.classList.toggle("nav--mobile-open");
      btn.setAttribute("aria-expanded", open);
      overlay.classList.toggle("open", open);
      if (open) document.body.style.overflow = "hidden";
      else if (!anyModalOpen()) document.body.style.overflow = "";
    };

    btn.addEventListener("click", toggle);
    overlay.addEventListener("click", close);
    qa(".nav__links a", nav).forEach(a => a.addEventListener("click", close));
  }

  /* ── MODAL DECANT ───────────────────── */
  let currentProduct = null, selectedSize = null;

  function openDecantModal(idx) {
    const p = allProducts[idx];
    if (!p) return;
    currentProduct = p; selectedSize = null;

    const overlay = $("modal-overlay");
    if (!overlay) return;
    const dp = decantPrices(p);

    q(".modal-decant__brand", overlay).textContent = p.brand;
    q(".modal-decant__name", overlay).textContent  = p.name;

    const img = q(".modal-decant__img-wrap img", overlay);
    if (img) { img.src = imgPath(p.img); img.alt = `${p.brand} ${p.name}`; imgFallback(img); }

    const simEl = q(".modal-decant__sim", overlay);
    if (simEl) { simEl.textContent = p.sim ? `≈ Similar a ${p.sim}` : ""; simEl.style.display = p.sim ? "block" : "none"; }

    q(".modal-decant__notas", overlay).innerHTML = `<strong>Notas:</strong> ${p.notas}`;
    q(".modal-decant__desc", overlay).textContent  = p.desc;

    const errEl = q(".modal-decant__note", overlay);
    if (errEl) { errEl.style.display = "none"; errEl.setAttribute("aria-hidden","true"); }

    const sizesEl = q(".modal-decant__sizes", overlay);
    if (sizesEl) {
      sizesEl.innerHTML = `
        <div class="size-opt" id="opt-25" role="radio" aria-checked="false" tabindex="0">
          <span class="size-opt__label">Decant 2,5 ml <small>(~35 atomizaciones)</small></span>
          <span class="size-opt__price">
            ${dp.xp25 ? `<span class="size-opt__crossed">${fmt(dp.xp25)}</span>` : ""}
            <span class="${dp.cyber ? "size-opt__cyber" : ""}">${fmt(dp.ap25)}</span>
          </span>
        </div>
        <div class="size-opt" id="opt-5" role="radio" aria-checked="false" tabindex="0">
          <span class="size-opt__label">Decant 5 ml <small>(~75 atomizaciones)</small></span>
          <span class="size-opt__price">
            ${dp.xp5 ? `<span class="size-opt__crossed">${fmt(dp.xp5)}</span>` : ""}
            <span class="${dp.cyber ? "size-opt__cyber" : ""}">${fmt(dp.ap5)}</span>
          </span>
        </div>`;

      [["opt-25","2.5ml",dp.ap25],["opt-5","5ml",dp.ap5]].forEach(([id,size,price]) => {
        const el = $(id);
        if (!el) return;
        const pick = () => {
          selectedSize = { size, price };
          if (errEl) { errEl.style.display = "none"; errEl.setAttribute("aria-hidden","true"); }
          qa(".size-opt", sizesEl).forEach(o => { o.classList.remove("selected"); o.setAttribute("aria-checked","false"); });
          el.classList.add("selected"); el.setAttribute("aria-checked","true");
        };
        el.addEventListener("click", pick);
        el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }});
      });
    }

    overlay.classList.add("open"); overlay.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    setTimeout(() => q(".modal-close-btn", overlay)?.focus(), 50);
  }

  function closeDecantModal() {
    const ov = $("modal-overlay");
    if (!ov) return;
    ov.classList.remove("open"); ov.setAttribute("aria-hidden","true");
    if (!anyModalOpen()) document.body.style.overflow = "";
    currentProduct = null; selectedSize = null;
  }

  /* ── MODAL HOT SALE ─────────────────── */
  function openHSModal(idx) {
    const h = allHotSales[idx];
    if (!h) return;
    const ov = $("hs-modal-overlay");
    if (!ov) return;
    const cond  = condLabel(h.condition);
    const hp    = hotSalePrice(h);
    const hasCross = hp.cross && hp.cross > hp.price;
    const discPct  = hasCross ? Math.round((1 - hp.price / hp.cross) * 100) : 0;

    const waMsg = encodeURIComponent(
      `Hola LuScent's 👋 Me interesa el siguiente frasco:\n\n` +
      `*${h.brand} — ${h.name}* (${h.size})\n` +
      `Condición: ${cond.text}\nPrecio: ${fmt(hp.price)}\n\n¿Está disponible?`
    );

    q(".modal-hs__brand", ov).textContent  = h.brand;
    q(".modal-hs__name", ov).textContent   = h.name;
    q(".modal-hs__size", ov).textContent   = h.size;
    q(".modal-hs__notas", ov).innerHTML    = `<strong>Notas:</strong> ${h.notas}`;
    q(".modal-hs__desc", ov).textContent   = h.desc;

    const priceEl = q(".modal-hs__price", ov);
    if (priceEl) { priceEl.textContent = fmt(hp.price); priceEl.className = `modal-hs__price${hp.cyber ? " modal-hs__price--cyber" : ""}`; }

    const condEl = q(".modal-hs__cond", ov);
    if (condEl) { condEl.textContent = cond.text; condEl.className = `modal-hs__cond modal-hs__cond--${cond.css}`; }

    const origEl = q(".modal-hs__original", ov);
    if (origEl) { origEl.style.display = hasCross ? "inline" : "none"; if (hasCross) origEl.textContent = fmt(hp.cross); }

    const discEl = q(".modal-hs__disc", ov);
    if (discEl) { discEl.style.display = hasCross ? "inline-block" : "none"; if (hasCross) discEl.textContent = `-${discPct}%`; }

    const imgEl = q(".modal-hs__img", ov);
    if (imgEl) { imgEl.src = imgPath(h.img); imgEl.alt = `${h.brand} ${h.name}`; imgFallback(imgEl); }

    const waEl = q(".modal-hs__wa", ov);
    if (waEl) waEl.href = `https://wa.me/${WA_NUM}?text=${waMsg}`;

    ov.classList.add("open"); ov.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    setTimeout(() => q(".modal-close-btn", ov)?.focus(), 50);
  }

  function closeHSModal() {
    const ov = $("hs-modal-overlay");
    if (!ov) return;
    ov.classList.remove("open"); ov.setAttribute("aria-hidden","true");
    if (!anyModalOpen()) document.body.style.overflow = "";
  }

  /* ── MODAL SET ──────────────────────── */
  function openSetModal(idx) {
    const s  = allSets[idx];
    if (!s) return;
    const ov = $("set-modal-overlay");
    if (!ov) return;
    const sp         = setPrice(s);
    const hasCross   = sp.cross && sp.cross > sp.price;
    const savings    = hasCross ? sp.cross - sp.price : 0;
    const discPct    = hasCross ? Math.round((1 - sp.price / sp.cross) * 100) : 0;
    const modalEl    = q(".modal-set", ov);
    const isLarge    = s.items.length > 6;
    if (modalEl) {
      modalEl.classList.toggle("modal-set--cyber", !!sp.cyber);
      modalEl.classList.toggle("modal-set--large", isLarge);
    }

    q(".modal-set__name", ov).textContent  = s.name;
    q(".modal-set__desc", ov).textContent  = s.desc;
    const priceEl = q(".modal-set__price", ov);
    if (priceEl) { priceEl.textContent = fmt(sp.price); priceEl.className = `modal-set__price${sp.cyber ? " modal-set__price--cyber" : ""}`; }
    const origEl2 = q(".modal-set__original", ov);
    if (origEl2) { origEl2.style.display = hasCross ? "" : "none"; if (hasCross) origEl2.textContent = fmt(sp.cross); }
    const discEl2 = q(".modal-set__disc", ov);
    if (discEl2) { discEl2.style.display = hasCross ? "" : "none"; if (hasCross) discEl2.textContent = `-${discPct}%`; }
    const savEl = q(".modal-set__saving", ov);
    if (savEl) { savEl.style.display = savings ? "" : "none"; if (savings) savEl.textContent = `Ahorras ${fmt(savings)}`; }
    const cyberEl = q(".modal-set__cyber", ov);
    if (cyberEl) cyberEl.style.display = sp.cyber ? "inline-flex" : "none";

    const listEl = q(".modal-set__items", ov);
    if (listEl) {
      if (isLarge) {
        /* Grid de miniaturas para sets grandes */
        listEl.className = "modal-set__items modal-set__items--grid";
        listEl.innerHTML = `<span class="modal-set__items-count" style="grid-column:1/-1">${s.items.length} decants de ${s.size}</span>` +
          s.items.map(item => `
          <div class="modal-set__thumb" title="${item.brand} — ${item.name}">
            <img src="${imgPath(item.img)}" alt="${item.brand} ${item.name}" loading="lazy"/>
            <span class="modal-set__thumb-tip">${item.brand}<br><em>${item.name}</em></span>
          </div>`).join("");
      } else {
        listEl.className = "modal-set__items";
        listEl.innerHTML = s.items.map(item => `
          <div class="modal-set__item">
            <div class="modal-set__item-img">
              <img src="${imgPath(item.img)}" alt="${item.name}" loading="lazy"/>
            </div>
            <div class="modal-set__item-info">
              <span class="modal-set__item-brand">${item.brand}</span>
              <span class="modal-set__item-name">${item.name}</span>
              <span class="modal-set__item-size">${s.size}</span>
            </div>
          </div>`).join("");
      }
      qa("img", listEl).forEach(imgFallback);
    }

    const addBtn = q(".modal-set__add", ov);
    if (addBtn) {
      addBtn.onclick = () => {
        cart.push({ brand:"Set LuScent's", name:s.name, size:`${s.items.length} × ${s.size}`, price:sp.price, img:s.items[0].img, isSet:true });
        saveCart(); updateCartUI();
        closeSetModal();
        showToast({ brand:"Set LuScent's", name:s.name, img:s.items[0].img });
        animateCartBtn();
      };
    }

    const waBtn = q(".modal-set__wa", ov);
    if (waBtn) {
      const msg = encodeURIComponent(
        `Hola LuScent's 👋 Me interesa el siguiente set:\n\n*${s.name}* (${s.items.length} decants de ${s.size})\n` +
        s.items.map(i => `• ${i.brand} — ${i.name}`).join("\n") +
        `\n\nPrecio: ${fmt(sp.price)}\n\n¡Quiero coordinar el pago!`
      );
      waBtn.href = `https://wa.me/${WA_NUM}?text=${msg}`;
    }

    ov.classList.add("open"); ov.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    setTimeout(() => q(".modal-close-btn", ov)?.focus(), 50);
  }

  function closeSetModal() {
    const ov = $("set-modal-overlay");
    if (!ov) return;
    ov.classList.remove("open"); ov.setAttribute("aria-hidden","true");
    if (!anyModalOpen()) document.body.style.overflow = "";
  }

  function anyModalOpen() {
    return !!($("modal-overlay")?.classList.contains("open")
      || $("cart-sidebar")?.classList.contains("open")
      || $("checkout-modal")?.classList.contains("open")
      || $("set-modal-overlay")?.classList.contains("open")
      || $("hs-modal-overlay")?.classList.contains("open"));
  }

  /* ── SETS VIEW ──────────────────────── */
  function activateSetsView() {
    state.cat = "sets";
    qa(".filter-btn").forEach(b => b.classList.remove("active"));
    $("filter-sets-btn")?.classList.add("active");
    render();
  }
  window.setView = dir => { if (dir === "sets") activateSetsView(); };

  /* ── LIMPIAR TODOS LOS FILTROS ──────── */
  function clearAllFilters() {
    state = { cat: "all", ocasion: "all", emocion: "all", search: "", sort: null };

    // Categoría → Todos
    qa(".filter-btn").forEach(b => b.classList.remove("active"));
    $("filter-all-btn")?.classList.add("active");

    // Búsqueda
    const si = $("search-input"); if (si) si.value = "";

    // Orden precio
    const pt = $("price-toggle"), pd = $("price-dd");
    qa(".sort-opt").forEach(b => b.classList.remove("selected"));
    if (pt) {
      pt.classList.remove("open", "active-sort");
      const txt = pt.firstChild;
      if (txt?.nodeType === 3) txt.textContent = "Precio ";
    }
    if (pd) pd.classList.remove("open");

    // Selects ocultos (ocasion / emocion)
    const sOc = $("filter-ocasion"); if (sOc) sOc.value = "all";
    const sEm = $("filter-emocion"); if (sEm) sEm.value = "all";

    // Pills ocasión y emoción → "Todas" / "Todos"
    qa(".adv-pill[data-filter='ocasion']").forEach(p => p.classList.toggle("active", p.dataset.val === "all"));
    qa(".adv-pill[data-filter='emocion']").forEach(p => p.classList.toggle("active", p.dataset.val === "all"));

    // Indicador visual del botón limpiar
    const cb = $("clear-filters-btn");
    if (cb) cb.classList.remove("active");

    render();
  }
  window.clearAllFilters = clearAllFilters;

  /* ── CARRITO ────────────────────────── */
  function toggleCart() {
    const sb = $("cart-sidebar"), ov = $("cart-overlay");
    if (!sb || !ov) return;
    const open = sb.classList.toggle("open");
    ov.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function addToCart() {
    if (!selectedSize || !currentProduct) {
      const errEl = q("#modal-overlay .modal-decant__note");
      if (errEl) { errEl.style.display = "block"; errEl.removeAttribute("aria-hidden"); }
      return;
    }
    const toastData = { brand:currentProduct.brand, name:currentProduct.name, img:currentProduct.img };
    cart.push({ brand:currentProduct.brand, name:currentProduct.name, size:selectedSize.size, price:selectedSize.price, img:currentProduct.img });
    saveCart(); updateCartUI(); closeDecantModal();
    setTimeout(() => { showToast(toastData); animateCartBtn(); }, 50);
  }

  window.removeFromCart = i => { cart.splice(i,1); saveCart(); updateCartUI(); };
  window.clearCart = () => { if (!confirm("¿Vaciar todo el carrito?")) return; cart=[]; saveCart(); updateCartUI(); };
  window.shareCart = () => {
    if (!cart.length) return;
    const data = cart.map(item => {
      const idx = allProducts.findIndex(p => p.brand===item.brand && p.name===item.name);
      return `${idx}-${item.size==="5ml"?5:2}`;
    }).join("_");
    const url = new URL(window.location.href);
    url.searchParams.set("cart_data", data);
    const copy = () => {
      const ta = Object.assign(document.createElement("textarea"), { value: url.toString(), style: "position:fixed;top:-9999px" });
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url.toString()).catch(copy);
    else copy();
    showToast({ brand:"LuScent's", name:"Enlace copiado", img:cart[0]?.img||"" });
  };

  function animateCartBtn() {
    const btn = $("nav-cart-btn");
    if (!btn) return;
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
  }

  function updateCartUI() {
    const itemsEl   = $("cart-items");
    const countEl   = $("nav-cart-count");
    const totalEl   = $("cart-total-price");
    const checkBtn  = $("cart-checkout");
    const navBtn    = $("nav-cart-btn");

    if (countEl) countEl.textContent = cart.length;
    navBtn?.classList.toggle("has-items", cart.length > 0);

    if (!itemsEl) return;
    if (!cart.length) {
      itemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
      if (totalEl) totalEl.textContent = "$ 0";
      if (checkBtn) { checkBtn.style.pointerEvents="none"; checkBtn.style.opacity=".5"; checkBtn.removeAttribute("href"); }
      return;
    }

    if (checkBtn) { checkBtn.style.pointerEvents="auto"; checkBtn.style.opacity="1"; checkBtn.href="#"; }
    let total = 0;
    itemsEl.innerHTML = cart.map((item,i) => {
      total += item.price;
      const sprays = item.size==="5ml" ? "~75 sprays" : "~35 sprays";
      return `
        <div class="cart-item">
          <div class="cart-item__img-wrap"><img src="${imgPath(item.img)}" alt="${item.name}"/></div>
          <div class="cart-item__info">
            <span class="cart-item__brand">${item.brand}</span>
            <span class="cart-item__name">${item.name}</span>
            <span class="cart-item__size">${item.size} <small>(${sprays})</small></span>
            <span class="cart-item__price">${fmt(item.price)}</span>
          </div>
          <button class="cart-item__rm" onclick="removeFromCart(${i})" aria-label="Eliminar ${item.name}">Eliminar</button>
        </div>`;
    }).join("") +
    `<div class="cart-actions">
       <button class="cart-action-btn" onclick="clearCart()">Vaciar carrito</button>
       <button class="cart-action-btn cart-action-btn--share" onclick="shareCart()">Copiar enlace</button>
     </div>`;

    qa("img", itemsEl).forEach(imgFallback);
    if (totalEl) totalEl.textContent = fmt(total);
  }

  /* ── TOAST ──────────────────────────── */
  function showToast(item) {
    let wrap = $("toast-wrap");
    if (!wrap) {
      wrap = Object.assign(document.createElement("div"), { id:"toast-wrap", className:"toast-wrap" });
      wrap.setAttribute("aria-live","polite"); wrap.setAttribute("aria-atomic","true");
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role","status");
    const isCart = item.brand !== "LuScent's";
    t.innerHTML = `
      <div class="toast__img-wrap"><img src="${item.img ? imgPath(item.img) : IMG_FALLBACK}" alt="${item.name}"/></div>
      <div class="toast__info">
        <span class="toast__label">${isCart ? "✓ Añadido al carrito" : item.brand}</span>
        <span class="toast__name">${item.name}</span>
        ${isCart ? `<span class="toast__brand">${item.brand}</span>` : ""}
      </div>`;
    imgFallback(q("img", t));
    wrap.appendChild(t);
    setTimeout(() => {
      t.classList.add("toast--exit");
      setTimeout(() => t.parentNode?.removeChild(t), 350);
    }, 2500);
  }

  /* ── CHECKOUT ───────────────────────── */
  let appliedCoupon = null;

  window.openCheckout = () => {
    if (!cart.length) return;
    closeDecantModal();
    $("cart-sidebar")?.classList.remove("open");
    $("cart-overlay")?.classList.remove("open");
    appliedCoupon = null;
    const ci = $("coupon-code"); if (ci) ci.value = "";
    const cm = $("coupon-msg"); if (cm) cm.style.display = "none";
    renderCheckout();
    $("checkout-overlay")?.classList.add("open");
    const modal = $("checkout-modal");
    if (modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); }
    document.body.style.overflow = "hidden";
    setTimeout(() => $("checkout-close")?.focus(), 50);
  };

  window.closeCheckout = () => {
    $("checkout-overlay")?.classList.remove("open");
    const modal = $("checkout-modal");
    if (modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
    document.body.style.overflow = "";
  };

  function renderCheckout() {
    const subtotal  = cart.reduce((a,i) => a + i.price, 0);
    let   discount  = 0;
    if (appliedCoupon) discount = appliedCoupon.type==="percent" ? subtotal*(appliedCoupon.value/100) : appliedCoupon.value;
    const total     = Math.max(subtotal - discount, 0);

    const sumEl = $("checkout-summary");
    if (sumEl) sumEl.innerHTML = cart.length===1
      ? `Llevas <strong>1 ítem</strong> (${cart[0].brand} — ${cart[0].name}).`
      : `Llevas <strong>${cart.length} ítems</strong> en tu pedido.`;

    if ($("checkout-subtotal")) $("checkout-subtotal").textContent = fmt(subtotal);
    const discRow = $("checkout-discount-row");
    if (discRow) {
      discRow.style.display = discount > 0 ? "flex" : "none";
      const discAmt = $("checkout-discount-amt");
      if (discAmt && discount > 0) discAmt.textContent = `-${fmt(discount)}`;
    }
    if ($("checkout-total")) $("checkout-total").textContent = fmt(total);

    const btn = $("checkout-confirm-btn");
    if (btn) {
      let msg = "Hola LuScent's 👋 Quisiera confirmar el siguiente pedido:\n\n";
      cart.forEach((item,i) => { msg += `${i+1}. ${item.brand} — ${item.name} (${item.size}) — ${fmt(item.price)}\n`; });
      msg += `\nSubtotal: ${fmt(subtotal)}`;
      if (appliedCoupon) msg += `\nDescuento (${appliedCoupon.code}): -${fmt(discount)}`;
      msg += `\n*Total a pagar: ${fmt(total)}*\n\n¡Gracias!`;
      btn.href = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
    }
  }

  /* ── SOLICITUD FORM ─────────────────── */
  function initRequestForm() {
    const form = $("solicitud-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const marca    = (q("#marca", form)?.value    || "").trim();
      const nombre   = (q("#nombre", form)?.value   || "").trim();
      const contacto = (q("#contacto", form)?.value || "").trim();
      if (!marca || !nombre || !contacto) return;

      const msg   = `Hola LuScent's 👋\n\nQuisiera solicitar:\n\n*Marca:* ${marca}\n*Nombre:* ${nombre}\n\n*Contacto:* ${contacto}\n\n¡Avísenme cuando esté disponible!`;
      const btn   = q("button[type=submit]", form);
      const orig  = btn?.textContent;

      if (btn) { btn.textContent = "✓ Abriendo WhatsApp…"; btn.disabled = true; }
      setTimeout(() => {
        window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
        if (btn) { btn.textContent = orig; btn.disabled = false; }
        form.reset();
        showToast({ brand:"Solicitud enviada", name:`${marca} — ${nombre}`, img:"" });
      }, 600);
    });
  }

  /* ── ASISTENTE OLFATIVO ─────────────── */
  function initAssistant() {
    const form = $("assistant-form");
    if (!form) return;
    let baseSet = [], upsell = null;

    form.addEventListener("submit", e => {
      e.preventDefault();
      const profile = $("ai-profile")?.value;
      const budget  = parseInt($("ai-budget")?.value || "0");
      if (!profile || !budget) return;

      const kwMap = {
        dulce:  ["vainilla","caramelo","praliné","miel","coñac","canela","haba tonka"],
        fresco: ["marinas","limón","menta","bergamota","ambroxan","pomelo","manzana verde"],
        oscuro: ["oud","tabaco","incienso","ron","azafrán","maderas ahumadas","café"],
      };
      let pool = allProducts.filter(p => (kwMap[profile]||[]).some(kw => p.notas.toLowerCase().includes(kw)));
      if (!pool.length) pool = [...allProducts];
      pool = pool.sort(() => .5 - Math.random());

      baseSet = []; let total = 0;
      for (const p of pool) {
        let size = "5ml", price = p.p5;
        if (total + price > budget) { size = "2.5ml"; price = p.p25; }
        if (total + price <= budget + 1500) { baseSet.push({ brand:p.brand, name:p.name, size, price, img:p.img, desc:p.desc }); total += price; }
        if (baseSet.length >= 3) break;
      }

      const nichoPool = allProducts.filter(p => p.cat==="nicho" && p.p5>8000).sort(() => Math.random() - .5);
      const up = nichoPool[0] || allProducts[0];
      upsell = { brand:up.brand, name:up.name, size:"5ml", price:up.p5, img:up.img, desc:up.desc };

      $("assistant-intro").style.display   = "none";
      $("assistant-loading").style.display = "block";
      setTimeout(() => renderAI(total, profile), 1500);
    });

    function renderAI(baseTotal, profile) {
      $("assistant-loading").style.display = "none";
      $("assistant-results").style.display = "block";
      const msgs = {
        dulce:  "Fragancias cálidas y envolventes. Notas gourmand y resinosas que generan una estela rica y atractiva.",
        fresco: "Limpieza, energía y versatilidad. Notas cítricas y acuáticas que se mantienen sin resultar invasivas.",
        oscuro: "Autoridad y presencia. Maderas profundas, tabaco y acordes ahumados para una firma sofisticada.",
      };
      const gd = $("ai-global-desc"); if (gd) gd.textContent = msgs[profile]||"";

      const bse = $("ai-base-set");
      if (bse) {
        bse.innerHTML = baseSet.map(item => `
          <div class="ai-item">
            <img src="${imgPath(item.img)}" class="ai-item__img" alt="${item.name}"/>
            <div class="ai-item__info">
              <span class="ai-item__brand">${item.brand}</span>
              <span class="ai-item__name">${item.name} <span style="color:var(--ink-muted);font-size:.75rem">(${item.size})</span></span>
              <p class="ai-item__desc">${item.desc}</p>
            </div>
            <span class="ai-item__price">${fmt(item.price)}</span>
          </div>`).join("");
        qa("img", bse).forEach(imgFallback);
      }
      const bt = $("ai-base-total"); if (bt) bt.textContent = fmt(baseTotal);

      const ue = $("ai-upsell-item");
      if (ue && upsell) {
        ue.innerHTML = `
          <div class="ai-item" style="border-color:var(--green)">
            <img src="${imgPath(upsell.img)}" class="ai-item__img" alt="${upsell.name}"/>
            <div class="ai-item__info">
              <span class="ai-item__brand">${upsell.brand}</span>
              <span class="ai-item__name">${upsell.name}</span>
              <p class="ai-item__desc">${upsell.desc}</p>
            </div>
            <span class="ai-item__price">${fmt(upsell.price)}</span>
          </div>`;
        qa("img", ue).forEach(imgFallback);
      }
    }

    $("btn-add-base")?.addEventListener("click", () => { baseSet.forEach(i=>cart.push(i)); finishAI(); });
    $("btn-add-all")?.addEventListener("click",  () => { baseSet.forEach(i=>cart.push(i)); if(upsell) cart.push(upsell); finishAI(); });

    function finishAI() {
      saveCart(); updateCartUI();
      showToast({ brand:"LuScent's", name:"Set Personalizado añadido", img:baseSet[0]?.img||"" });
      animateCartBtn();
    }
  }

  /* ── INICIALIZACIÓN ─────────────────── */
  function init() {
    /* Carrito compartido via URL */
    const params = new URLSearchParams(window.location.search);
    if (params.has("cart_data")) {
      const loaded = params.get("cart_data").split("_").reduce((acc,chunk) => {
        const [idx,flag] = chunk.split("-");
        const p = allProducts[parseInt(idx)];
        if (!p) return acc;
        const size = flag==="5" ? "5ml" : "2.5ml";
        acc.push({ brand:p.brand, name:p.name, size, price:flag==="5"?p.p5:p.p25, img:p.img });
        return acc;
      }, []);
      if (loaded.length) {
        cart = loaded; saveCart();
        history.replaceState({}, "", `${location.protocol}//${location.host}${location.pathname}`);
        setTimeout(toggleCart, 600);
      }
    }

    initMobileNav();
    initPills();
    initCyberHero();
    renderHotSales();

    /* Filtro Sets */
    $("filter-sets-btn")?.addEventListener("click", () => {
      if (state.cat === "sets") {
        state.cat = "all";
        qa(".filter-btn").forEach(b => b.classList.remove("active"));
        $("filter-all-btn")?.classList.add("active");
      } else {
        activateSetsView();
        updateClearBtn();
        return;
      }
      updateClearBtn();
      render();
    });

    /* Filtros categoría */
    qa(".filter-btn:not(#filter-sets-btn)").forEach(btn => btn.addEventListener("click", () => {
      qa(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.cat = btn.dataset.cat || "all";
      updateClearBtn();
      render();
    }));

    /* Filtros avanzados */
    $("filter-ocasion")?.addEventListener("change", e => { state.ocasion = e.target.value; updateClearBtn(); render(); });
    $("filter-emocion")?.addEventListener("change", e => { state.emocion = e.target.value; updateClearBtn(); render(); });

    /* Búsqueda */
    $("search-input")?.addEventListener("input", e => { state.search = e.target.value; updateClearBtn(); render(); });

    /* Limpiar filtros */
    $("clear-filters-btn")?.addEventListener("click", clearAllFilters);

    function updateClearBtn() {
      const cb = $("clear-filters-btn");
      if (!cb) return;
      const dirty = state.cat !== "all" || state.ocasion !== "all" || state.emocion !== "all" || state.search !== "" || state.sort !== null;
      cb.classList.toggle("active", dirty);
    }

    /* Dropdown precio */
    const pt = $("price-toggle"), pd = $("price-dd");
    if (pt && pd) {
      pt.addEventListener("click", e => { e.stopPropagation(); pt.classList.toggle("open"); pd.classList.toggle("open"); pt.setAttribute("aria-expanded", pd.classList.contains("open")); });
      pd.addEventListener("click", e => e.stopPropagation());
      document.addEventListener("click", () => { pt.classList.remove("open"); pd.classList.remove("open"); pt.setAttribute("aria-expanded","false"); });
    }

    /* Ordenar */
    qa(".sort-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const dir = btn.dataset.dir;
        state.sort = state.sort === dir ? null : dir;
        qa(".sort-opt").forEach(b => b.classList.toggle("selected", b.dataset.dir === state.sort));
        if (pt) {
          pt.classList.toggle("active-sort", !!state.sort);
          const txt = pt.firstChild;
          if (txt?.nodeType === 3) txt.textContent = !state.sort ? "Precio " : (state.sort==="asc" ? "Precio ↑ " : "Precio ↓ ");
          pt.classList.remove("open"); if (pd) pd.classList.remove("open");
        }
        updateClearBtn();
        render();
      });
    });

    /* Modal decant */
    $("modal-overlay")?.addEventListener("click", e => { if (e.target===$("modal-overlay")) closeDecantModal(); });
    q("#modal-overlay .modal-close-btn")?.addEventListener("click", closeDecantModal);
    $("modal-add-cart")?.addEventListener("click", addToCart);

    const modalWa = $("modal-wa");
    if (modalWa) {
      modalWa.addEventListener("click", e => {
        e.preventDefault();
        if (!selectedSize || !currentProduct) {
          const errEl = q("#modal-overlay .modal-decant__note");
          if (errEl) { errEl.style.display="block"; errEl.removeAttribute("aria-hidden"); }
          return;
        }
        cart.push({ brand:currentProduct.brand, name:currentProduct.name, size:selectedSize.size, price:selectedSize.price, img:currentProduct.img });
        saveCart(); updateCartUI(); closeDecantModal(); window.openCheckout();
      });
    }

    /* Modal hot sale */
    const hsOv = $("hs-modal-overlay");
    if (hsOv) {
      hsOv.addEventListener("click", e => { if (e.target===hsOv) closeHSModal(); });
      q(".modal-close-btn", hsOv)?.addEventListener("click", closeHSModal);
    }

    /* Modal set */
    const setOv = $("set-modal-overlay");
    if (setOv) {
      setOv.addEventListener("click", e => { if (e.target===setOv) closeSetModal(); });
      q(".modal-close-btn", setOv)?.addEventListener("click", closeSetModal);
    }

    /* Carrito */
    $("nav-cart-btn")?.addEventListener("click", e => { e.preventDefault(); toggleCart(); });
    $("cart-close-btn")?.addEventListener("click", toggleCart);
    $("cart-overlay")?.addEventListener("click", toggleCart);
    $("cart-checkout")?.addEventListener("click", e => { e.preventDefault(); window.openCheckout(); });

    /* Checkout */
    $("checkout-close")?.addEventListener("click", window.closeCheckout);
    $("checkout-overlay")?.addEventListener("click", window.closeCheckout);
    $("apply-coupon")?.addEventListener("click", () => {
      const code  = $("coupon-code")?.value.trim().toUpperCase() || "";
      const msgEl = $("coupon-msg");
      if (!msgEl) return;
      msgEl.style.display = "block";
      if (!code) {
        appliedCoupon = null; msgEl.textContent="Ingresa un código."; msgEl.className="coupon-msg err";
      } else if (COUPONS[code]) {
        appliedCoupon = { code, ...COUPONS[code] }; msgEl.textContent=`✓ ${appliedCoupon.label}`; msgEl.className="coupon-msg ok";
      } else {
        appliedCoupon = null; msgEl.textContent="Código no válido o expirado."; msgEl.className="coupon-msg err";
      }
      renderCheckout();
    });

    /* Escape global */
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if ($("set-modal-overlay")?.classList.contains("open"))  closeSetModal();
      else if ($("hs-modal-overlay")?.classList.contains("open"))   closeHSModal();
      else if ($("checkout-modal")?.classList.contains("open"))     window.closeCheckout();
      else if ($("modal-overlay")?.classList.contains("open") )     closeDecantModal();
      else if ($("cart-sidebar")?.classList.contains("open"))       toggleCart();
      else if ($("main-nav")?.classList.contains("nav--mobile-open")) {
        $("main-nav").classList.remove("nav--mobile-open");
        $("hamburger-btn")?.setAttribute("aria-expanded","false");
        $("mobile-overlay")?.classList.remove("open");
        if (!anyModalOpen()) document.body.style.overflow = "";
      }
    });

    /* Nav scroll */
    const nav = $("main-nav");
    if (nav?.classList.contains("nav--transparent")) {
      const onScroll = () => {
        nav.classList.toggle("nav--transparent", scrollY <= 50);
        nav.classList.toggle("nav--scrolled", scrollY > 50);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    initRequestForm();
    initAssistant();
    render();
    updateCartUI();

    /* ── Reviews slider — loop infinito con cloneNode ── */
    const track = document.getElementById("reviews-track");
    if (track) {
      // Clonar cada card y añadirla al final (duplicado para loop)
      const origCards = Array.from(track.children);
      origCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
      });
      // Ajustar velocidad después de que el layout se pinte
      const setSpeed = () => {
        // El track tiene 2x las cards; animar translateX(-50%) = desplazar 1x
        const half = track.scrollWidth / 2;
        if (half > 0) {
          const secs = Math.max(18, half / 55);
          track.style.animationDuration = secs.toFixed(1) + "s";
        }
      };
      requestAnimationFrame(() => requestAnimationFrame(setSpeed));
      window.addEventListener("resize", setSpeed, { passive: true });
    }
  }

  return { init, renderSets, activateSetsView, showToast, cart, saveCart, updateCartUI, animateCartBtn, toggleCart };

})();

document.addEventListener("DOMContentLoaded", () => LS.init());
