/* Bandeau de consentement - visites360immobilier.com
   Aucun outil de mesure n'est charge avant l'accord explicite du visiteur.
   Le refus est aussi simple que l'acceptation (exigence CNIL).
   Le choix est conserve 6 mois, puis la question est reposee. */
(function () {
  "use strict";
  var GA_ID = "G-4P35YLLLH7";
  var CLARITY_ID = ""; /* vide = Clarity non charge */
  var KEY = "consent_mesure";
  var DUREE = 182 * 24 * 60 * 60 * 1000; /* 6 mois */

  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (!v || typeof v.t !== "number") return null;
      if (Date.now() - v.t > DUREE) return null;
      return v.ok === true ? "oui" : "non";
    } catch (e) { return null; }
  }
  function ecrire(ok) {
    try { localStorage.setItem(KEY, JSON.stringify({ ok: ok, t: Date.now() })); } catch (e) {}
  }

  function chargerMesure() {
    if (window.__mesureChargee) return;
    window.__mesureChargee = true;
    if (GA_ID) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gtag("js", new Date());
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
      gtag("config", GA_ID, { anonymize_ip: true });
    }
    if (CLARITY_ID) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", CLARITY_ID);
    }
  }

  var CSS =
    '#ckb{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#0f1b2d;color:#fff;' +
    'padding:18px 20px;box-shadow:0 -8px 40px rgba(0,0,0,.25);font:400 15px/1.55 ' +
    'Inter,system-ui,sans-serif}' +
    '#ckb .ckw{max-width:1140px;margin:0 auto;display:flex;gap:22px;align-items:center;' +
    'flex-wrap:wrap;justify-content:space-between}' +
    '#ckb p{margin:0;max-width:62ch;color:rgba(255,255,255,.88)}' +
    '#ckb a{color:#fff;text-decoration:underline}' +
    '#ckb .ckbtns{display:flex;gap:10px;flex-wrap:wrap}' +
    '#ckb button{font:600 15px/1 Inter,system-ui,sans-serif;padding:13px 22px;border-radius:10px;' +
    'cursor:pointer;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff}' +
    '#ckb button.ok{background:#0e7c66;border-color:#0e7c66}' +
    '#ckb button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '@media(max-width:700px){#ckb .ckw{gap:14px}#ckb .ckbtns{width:100%}' +
    '#ckb button{flex:1 1 140px}}';

  function style() {
    if (document.getElementById("ckb-css")) return;
    var st = document.createElement("style");
    st.id = "ckb-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function afficher() {
    if (document.getElementById("ckb")) return;
    style();
    var d = document.createElement("div");
    d.id = "ckb";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Consentement a la mesure d'audience");
    d.innerHTML =
      '<div class="ckw"><p>Ce site peut mesurer son audience pour savoir quelles pages ' +
      'sont lues. Rien n\'est charge sans votre accord, et le site fonctionne ' +
      'a l\'identique si vous refusez. <a href="/confidentialite/">En savoir plus</a></p>' +
      '<div class="ckbtns"><button type="button" class="no">Refuser</button>' +
      '<button type="button" class="ok">Accepter</button></div></div>';
    document.body.appendChild(d);
    d.querySelector(".ok").addEventListener("click", function () {
      ecrire(true); d.remove(); chargerMesure();
    });
    d.querySelector(".no").addEventListener("click", function () {
      ecrire(false); d.remove();
    });
    d.querySelector(".ok").focus();
  }

  function demarrer() {
    /* Consent Mode : tout est refuse par defaut, avant tout chargement */
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500
    });

    var choix = lire();
    if (choix === "oui") chargerMesure();
    else if (choix === null) afficher();

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('[data-cookies]') : null;
      if (!a) return;
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch (err) {}
      afficher();
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
