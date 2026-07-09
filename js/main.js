// ============================================
// INFOPLOMBERIE.CA — interactions
// ============================================

const PHONE_DISPLAY = "(514) 700-7100";
const PHONE_TEL = "tel:+15147007100";

// Nav: scrolled state + burger menu
const nav = document.querySelector(".nav");
const burger = document.querySelector(".nav-burger");
const links = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

if (burger) {
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.textContent = open ? "✕" : "☰";
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

// Ticker: duplicate track content for a seamless loop
const track = document.querySelector(".ticker-track");
if (track) track.innerHTML += track.innerHTML;

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Card cursor glow
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Back to top
const toTop = document.querySelector(".to-top");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Reading progress bar (article pages)
const progress = document.querySelector(".progress-bar");
if (progress) {
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + "%";
  }, { passive: true });
}

// Newsletter form
const newsForm = document.querySelector(".news-form");
if (newsForm) {
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = newsForm.querySelector("button");
    btn.textContent = "Merci! 💧";
    btn.disabled = true;
    newsForm.querySelector("input").value = "";
  });
}

// FAQ: only one open at a time
const faqs = document.querySelectorAll(".faq-item");
faqs.forEach((d) => {
  d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
  });
});

// ============================================
// Blog: search + category filters combined
// ============================================

const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("blogSearch");

if (filterBtns.length) {
  const cards = document.querySelectorAll("[data-cat]");
  const noResults = document.querySelector(".no-results");
  let activeCat = "tous";

  const apply = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const matchCat = activeCat === "tous" || card.dataset.cat === activeCat;
      const matchText = !q || card.textContent.toLowerCase().includes(q);
      const show = matchCat && matchText;
      card.style.display = show ? "" : "none";
      if (show) shown++;
    });
    if (noResults) noResults.style.display = shown === 0 ? "block" : "none";
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.filter;
      apply();
    });
  });

  if (searchInput) searchInput.addEventListener("input", apply);
}

// ============================================
// Diagnostic express — wizard
// ============================================

const stage = document.getElementById("wizStage");

if (stage) {
  const CALL = `<a class="btn btn-hot" href="${PHONE_TEL}">📞 Appelez : ${PHONE_DISPLAY}</a>`;
  const SOUMISSION = `<a class="btn btn-ghost" href="contact.html">Soumission gratuite →</a>`;

  const SEV = {
    diy:    { chip: "sev-diy",    label: "🟢 Réparable vous-même" },
    pro:    { chip: "sev-pro",    label: "🟠 Un pro s'impose" },
    urgent: { chip: "sev-urgent", label: "🔴 Urgence — agissez maintenant" },
  };

  const PROBLEMS = [
    {
      em: "🚽", label: "Toilette bouchée",
      q: "Est-ce que l'eau monte et menace de déborder?",
      opts: [
        { em: "😱", t: "Oui, ça monte!", r: {
          sev: "urgent", title: "Stoppez l'eau, tout de suite",
          body: "Fermez la petite valve derrière la toilette (sens horaire) ou soulevez le couvercle du réservoir et remontez le flotteur. Ne tirez plus la chasse! Ensuite, suivez notre méthode de débouchage — et si ça refoule ailleurs, appelez-nous.",
          guide: "articles/toilette-bouchee.html" } },
        { em: "🐢", t: "Non, elle se vide lentement", r: {
          sev: "diy", title: "Bonne nouvelle : c'est très faisable",
          body: "Un bouchon simple se règle avec une ventouse à fond conique dans 8 cas sur 10. Notre guide vous montre le geste exact, puis le furet de toilette si ça résiste.",
          guide: "articles/toilette-bouchee.html" } },
        { em: "🏠", t: "Plusieurs drains bloquent en même temps", r: {
          sev: "pro", title: "C'est le drain principal",
          body: "Quand la toilette, la douche et l'évier refoulent ensemble, le bouchon est dans le drain principal ou l'égout. Ça demande une caméra d'inspection et un équipement de débouchage professionnel.",
          call: true } },
      ],
    },
    {
      em: "💧", label: "Fuite ou dégât d'eau",
      q: "Quelle est l'ampleur de la fuite?",
      opts: [
        { em: "💦", t: "Ça goutte doucement (évier, tuyau…)", r: {
          sev: "diy", title: "Fermez la valve locale et respirez",
          body: "Une goutte lente n'est pas une urgence, mais elle ne se réparera pas toute seule. Fermez la valve d'arrêt la plus proche et suivez notre protocole pour évaluer la suite.",
          guide: "articles/fuite-eau-urgence.html" } },
        { em: "🌊", t: "Ça coule fort / le plafond gonfle", r: {
          sev: "urgent", title: "Protocole d'urgence : maintenant",
          body: "Valve d'entrée d'eau principale FERMÉE, électricité coupée dans les zones touchées, robinets du bas ouverts. Notre guide vous accompagne minute par minute — puis appelez-nous, on répond 24/7.",
          guide: "articles/fuite-eau-urgence.html", call: true } },
        { em: "🕵️", t: "Je vois de l'eau, mais pas la source", r: {
          sev: "pro", title: "Il faut une détection de fuite",
          body: "Une fuite invisible (dans un mur, une dalle, un plafond) demande des outils de détection thermique et acoustique. Plus on attend, plus la moisissure s'installe — elle démarre en 24 à 48 h.",
          call: true } },
      ],
    },
    {
      em: "🌀", label: "Drain ou évier lent",
      q: "C'est un drain… ou toute la maison?",
      opts: [
        { em: "1️⃣", t: "Un seul drain, depuis peu", r: {
          sev: "diy", title: "90 % de chances de le régler vous-même",
          body: "Eau chaude, ventouse, siphon, furet : la méthode en escalade vient à bout de presque tous les bouchons — sans produits chimiques qui rongent vos tuyaux.",
          guide: "articles/deboucher-drain.html" } },
        { em: "🔁", t: "Ça revient sans cesse, ou plusieurs drains", r: {
          sev: "pro", title: "Le problème est plus profond",
          body: "Un bouchon récurrent ou généralisé pointe vers le drain principal : racines d'arbre, affaissement de conduite ou accumulation de graisse. Une inspection par caméra donne l'heure juste.",
          call: true } },
      ],
    },
    {
      em: "🔥", label: "Pas d'eau chaude",
      q: "Votre chauffe-eau a quel âge?",
      opts: [
        { em: "👶", t: "Moins de 8 ans", r: {
          sev: "diy", title: "Vérifiez d'abord les suspects faciles",
          body: "Disjoncteur déclenché, élément chauffant grillé, thermostat déréglé : souvent réparable à peu de frais. Notre guide d'entretien vous montre quoi inspecter en sécurité.",
          guide: "articles/entretien-chauffe-eau.html" } },
        { em: "👴", t: "Plus de 10 ans, ou il fuit", r: {
          sev: "pro", title: "C'est l'heure du remplacement",
          body: "Une cuve qui fuit ne se répare pas, et passé 10 ans, plusieurs assureurs québécois limitent la couverture. Remplacer de façon planifiée coûte bien moins cher qu'un dégât d'eau un dimanche soir.",
          call: true } },
        { em: "🤷", t: "Aucune idée", r: {
          sev: "pro", title: "Regardez la plaque signalétique",
          body: "La date de fabrication est sur l'étiquette du réservoir. Plus de 10 ans? Parlez-nous-en. Moins? Consultez notre guide d'entretien — et appelez si l'eau reste froide.",
          guide: "articles/entretien-chauffe-eau.html", call: true } },
      ],
    },
    {
      em: "🥶", label: "Tuyau gelé",
      q: "Le tuyau gelé est-il accessible?",
      opts: [
        { em: "👀", t: "Oui, je peux le voir et le toucher", r: {
          sev: "diy", title: "Dégelez-le graduellement — jamais de flamme",
          body: "Robinet ouvert, séchoir à cheveux, on progresse du robinet vers la zone gelée. Notre guide détaille la technique et les pièges (le pire : la torche au propane).",
          guide: "articles/tuyaux-gel-hiver.html" } },
        { em: "🧱", t: "Non, il est dans un mur ou un plafond", r: {
          sev: "urgent", title: "Risque d'éclatement — faites vite",
          body: "Un tuyau gelé inaccessible peut fendre et inonder le mur au dégel. Fermez l'entrée d'eau principale par précaution et appelez : l'équipement de dégel professionnel évite d'ouvrir le mur au hasard.",
          call: true } },
      ],
    },
    {
      em: "🚰", label: "Robinet qui goutte",
      q: "D'où vient la goutte?",
      opts: [
        { em: "💧", t: "Du bec, goutte à goutte", r: {
          sev: "diy", title: "Une cartouche à 15 $ règle ça",
          body: "Le goutte-à-goutte du bec vient presque toujours d'une cartouche ou d'un joint usé. Une heure de travail, des outils de base, et le silence revient (avec ~10 000 litres d'eau économisés par année).",
          guide: "articles/robinet-qui-goutte.html" } },
        { em: "⬇️", t: "De la base ou sous l'évier", r: {
          sev: "pro", title: "Là, c'est un joint d'étanchéité",
          body: "Une fuite à la base ou sous le comptoir peut abîmer l'armoire et le plancher en silence. Ça se répare bien, mais le diagnostic vaut la peine d'être fait par un œil expert.",
          guide: "articles/robinet-qui-goutte.html", call: true } },
      ],
    },
    {
      em: "🚾", label: "Toilette qui coule sans arrêt",
      q: "Quel est le comportement exact?",
      opts: [
        { em: "🎶", t: "Le bruit d'eau est constant", r: {
          sev: "diy", title: "Clapet ou flotteur : 20 minutes de travail",
          body: "Une toilette qui coule gaspille jusqu'à 750 litres par jour. Le coupable est presque toujours le clapet ou le niveau du flotteur — deux réparations à moins de 25 $.",
          guide: "articles/toilette-qui-coule.html" } },
        { em: "👻", t: "Elle repart toute seule par moments", r: {
          sev: "diy", title: "La « chasse fantôme » : clapet usé",
          body: "Le réservoir fuit lentement vers la cuvette et se remplit tout seul. Notre test au colorant confirme le diagnostic en 15 minutes, et le clapet se remplace sans outil.",
          guide: "articles/toilette-qui-coule.html" } },
      ],
    },
    {
      em: "⛈️", label: "Eau au sous-sol / pompe de puisard",
      q: "Il y a de l'eau en ce moment?",
      opts: [
        { em: "🌊", t: "Oui, et ça monte", r: {
          sev: "urgent", title: "Sécurité d'abord, pompe ensuite",
          body: "Ne marchez pas dans l'eau si des prises ou appareils y touchent — coupez le courant au panneau d'abord. Vérifiez si la pompe est débranchée ou bloquée, puis appelez : on se déplace 24/7.",
          guide: "articles/pompe-puisard.html", call: true } },
        { em: "🛡️", t: "Non, je veux prévenir", r: {
          sev: "diy", title: "Le test du seau d'eau : 10 minutes",
          body: "Une pompe de puisard se teste AVANT la fonte des neiges, pas pendant. Notre guide couvre le test, le nettoyage de la fosse et la batterie de secours qui sauve votre sous-sol en panne de courant.",
          guide: "articles/pompe-puisard.html" } },
      ],
    },
    {
      em: "❓", label: "Autre problème",
      r: {
        sev: "pro", title: "Décrivez-nous ça de vive voix",
        body: "Chaque maison a ses mystères. Appelez-nous ou demandez une soumission gratuite : un plombier certifié vous dira honnêtement si c'est réparable vous-même — oui, on le dit quand ça l'est.",
        call: true,
      },
    },
  ];

  // ---- Stabilité visuelle entre les étapes ----
  const wiz = stage.closest(".wiz") || stage;

  // La boîte garde la hauteur de la vue la plus haute déjà affichée :
  // changer d'étape ne fait plus sauter la mise en page.
  const lockHeight = () => {
    const h = stage.offsetHeight;
    const cur = parseFloat(stage.style.minHeight) || 0;
    if (h > cur) stage.style.minHeight = h + "px";
  };

  // Si le haut du diagnostic est sorti de l'écran (grille haute sur mobile),
  // on ramène doucement la vue au même point de repère à chaque étape.
  const realign = () => {
    if (wiz.getBoundingClientRect().top < 70) {
      wiz.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  window.addEventListener("resize", () => {
    stage.style.minHeight = "";
    lockHeight();
  });

  const renderTiles = () => {
    stage.innerHTML = `
      <div class="wiz-anim">
        <span class="wiz-step-label">Étape 1 / 2 — Choisissez votre problème</span>
        <div class="wiz-tiles">
          ${PROBLEMS.map((p, i) => `
            <button class="wiz-tile" data-i="${i}">
              <span class="em">${p.em}</span>${p.label}
            </button>`).join("")}
        </div>
      </div>`;
    stage.querySelectorAll(".wiz-tile").forEach((b) =>
      b.addEventListener("click", () => {
        const p = PROBLEMS[+b.dataset.i];
        p.q ? renderQuestion(p) : renderResult(p.r);
      })
    );
    lockHeight();
    realign();
  };

  const renderQuestion = (p) => {
    stage.innerHTML = `
      <div class="wiz-anim wiz-q">
        <span class="wiz-step-label">Étape 2 / 2 — ${p.em} ${p.label}</span>
        <h3>${p.q}</h3>
        <div class="wiz-opts">
          ${p.opts.map((o, i) => `
            <button class="wiz-opt" data-i="${i}">
              <span class="em">${o.em}</span>${o.t}
            </button>`).join("")}
        </div>
        <button class="wiz-back">← Changer de problème</button>
      </div>`;
    stage.querySelectorAll(".wiz-opt").forEach((b) =>
      b.addEventListener("click", () => renderResult(p.opts[+b.dataset.i].r))
    );
    stage.querySelector(".wiz-back").addEventListener("click", renderTiles);
    lockHeight();
    realign();
  };

  const renderResult = (r) => {
    const sev = SEV[r.sev];
    const guideBtn = r.guide
      ? `<a class="btn btn-primary" href="${r.guide}">📖 Guide étape par étape</a>` : "";
    const callBtn = r.call || r.sev !== "diy" ? CALL : "";
    stage.innerHTML = `
      <div class="wiz-anim wiz-result">
        <span class="sev-chip ${sev.chip}">${sev.label}</span>
        <h3>${r.title}</h3>
        <p>${r.body}</p>
        <div class="wiz-actions">${guideBtn}${callBtn}${r.sev !== "diy" ? SOUMISSION : ""}</div>
        <button class="wiz-back">↺ Recommencer le diagnostic</button>
      </div>`;
    stage.querySelector(".wiz-back").addEventListener("click", renderTiles);
    lockHeight();
    realign();
  };

  renderTiles();
}

// ============================================
// Contact form → BâtiCRM (webhook d'intake des leads)
// ============================================

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  const LEAD_WEBHOOK = "https://baticrm.ca/api/leads/9464866e77571d450688eb09c65b4ffc85dea9229862453e";

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(quoteForm);
    const btn = quoteForm.querySelector("button[type=submit]");

    // Payload aligné sur les champs reconnus par le CRM (nom, courriel, tel,
    // ville, service, message + honeypot "website").
    const payload = new FormData();
    payload.set("nom", f.get("nom") || "");
    payload.set("courriel", f.get("courriel") || "");
    payload.set("tel", f.get("tel") || "");
    payload.set("ville", f.get("ville") || "");
    payload.set("service", `Plomberie — ${f.get("urgence") || "demande web"}`);
    payload.set("message", `${f.get("message") || ""}\n\n[Source : infoplomberie.ca]`);
    payload.set("website", f.get("website") || "");

    btn.disabled = true;
    btn.textContent = "Envoi en cours…";

    try {
      // mode no-cors : requête « simple », livrée au CRM sans préflight.
      await fetch(LEAD_WEBHOOK, { method: "POST", body: payload, mode: "no-cors" });
      window.location.href = "merci.html";
    } catch {
      // Panne réseau : on retombe sur le courriel prérempli pour ne perdre aucun lead.
      const subject = `Demande de soumission — ${f.get("urgence")} — ${f.get("ville")}`;
      const body = [
        `Nom : ${f.get("nom")}`,
        `Téléphone : ${f.get("tel")}`,
        `Courriel : ${f.get("courriel")}`,
        `Ville : ${f.get("ville")}`,
        `Niveau d'urgence : ${f.get("urgence")}`,
        ``,
        `Description du problème :`,
        f.get("message"),
      ].join("\n");
      window.location.href =
        `mailto:contact@gciconstruction.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      btn.disabled = false;
      btn.textContent = "Envoyer ma demande 📨";
    }
  });
}
