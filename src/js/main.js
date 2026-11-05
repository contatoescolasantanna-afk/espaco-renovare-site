/* Espaço Renovare — interações do site (sem dependências) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var cfg = window.RENOVARE || {};

  /* ---------- Consentimento (LGPD): métricas só depois do "Aceitar" ---------- */
  function lerConsentimento() { try { return localStorage.getItem("renovare_cookies"); } catch (e) { return null; } }
  function salvarConsentimento(v) { try { localStorage.setItem("renovare_cookies", v); } catch (e) {} }
  function carregarMetricas() {
    if (cfg.ga && !window.gtag) {
      var g = document.createElement("script");
      g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.ga;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", cfg.ga);
    }
    if (cfg.pixel && !window.fbq) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", cfg.pixel); window.fbq("track", "PageView");
    }
  }
  if (cfg.ga || cfg.pixel) {
    var escolha = lerConsentimento();
    if (escolha === "sim") carregarMetricas();
    else if (escolha !== "nao") {
      var aviso = document.createElement("div");
      aviso.className = "aviso-cookies";
      aviso.setAttribute("role", "dialog");
      aviso.setAttribute("aria-label", "Aviso de cookies");
      aviso.innerHTML = '<p>Usamos cookies de medição para entender como o site é usado e melhorar a experiência. <a href="/politica-de-privacidade/">Saiba mais</a></p><div><button type="button" class="botao botao--pequeno botao--contorno" data-cookies="nao">Recusar</button><button type="button" class="botao botao--pequeno botao--primario" data-cookies="sim">Aceitar</button></div>';
      document.body.appendChild(aviso);
      aviso.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-cookies]"); if (!b) return;
        var v = b.getAttribute("data-cookies"); salvarConsentimento(v);
        if (v === "sim") carregarMetricas();
        aviso.remove();
      });
    }
  }

  /* ---------- Medição de contatos (GA4 / Meta Pixel, se configurados e aceitos) ---------- */
  function medir(evento, dados) {
    dados = dados || {};
    try { if (window.gtag) window.gtag("event", evento, dados); } catch (e) {}
    try {
      if (window.fbq) {
        if (evento === "generate_lead") window.fbq("track", "Lead");
        else if (evento === "contact") window.fbq("track", "Contact");
      }
    } catch (e) {}
  }
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-evento]");
    if (!el) return;
    var tipo = el.getAttribute("data-evento");
    var origem = el.getAttribute("data-origem") || "";
    if (tipo === "whatsapp") medir("contact", { method: "whatsapp", origem: origem });
    else if (tipo === "telefone") medir("contact", { method: "telefone", origem: origem });
    else if (tipo === "cta-visita") medir("select_content", { content_type: "cta_visita", origem: origem });
    else if (tipo === "agenda-online") medir("generate_lead", { origem: "agenda_online" });
  });

  /* ---------- Menu do celular ---------- */
  var botaoMenu = document.querySelector("[data-menu]");
  var faixa = document.querySelector(".faixa-matricula");
  if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = doc.classList.toggle("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
      if (faixa) doc.style.setProperty("--faixa", Math.max(0, faixa.getBoundingClientRect().bottom) + "px");
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && doc.classList.contains("menu-aberto")) {
        doc.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.focus();
      }
    });
    document.querySelectorAll(".topo__nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        doc.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Topo com sombra + barra de ação no celular ---------- */
  var topo = document.querySelector("[data-topo]");
  var barra = document.querySelector(".barra-acao");
  var agendar = document.getElementById("agendar");
  var formNaTela = false;
  function aoRolar() {
    var y = window.scrollY;
    if (topo) topo.classList.toggle("rolou", y > 8);
    if (barra) barra.classList.toggle("visivel", y > 480 && !formNaTela);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  if ("IntersectionObserver" in window) {
    if (agendar && barra) {
      new IntersectionObserver(function (ents) {
        formNaTela = ents[0].isIntersecting;
        aoRolar();
      }, { threshold: 0.15 }).observe(agendar);
    }
    /* Revelar blocos ao rolar */
    var alvos = document.querySelectorAll(".cartao-dif, .cartao-turma, .espaco, .rotina li, .extra, .mosaico li, .pilares li, .passos li, .faq details");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px 15% 0px" });
    alvos.forEach(function (el, i) {
      el.classList.add("revelar");
      el.style.transitionDelay = (i % 4) * 40 + "ms";
      io.observe(el);
    });
  }

  /* ---------- Fonte manuscrita carregada depois (não atrasa a abertura da página) ---------- */
  function carregarFonteMao() {
    if (!("FontFace" in window)) return;
    var f = new FontFace("Caveat", "url(/fonts/caveat-600.woff2) format('woff2')", { weight: "600", display: "swap" });
    f.load().then(function (ff) { document.fonts.add(ff); }).catch(function () {});
  }
  if (document.readyState === "complete") carregarFonteMao();
  else window.addEventListener("load", carregarFonteMao);

  /* ---------- Balãozinho do WhatsApp ---------- */
  var flutuante = document.querySelector(".whats-flutuante");
  if (flutuante) {
    setTimeout(function () { flutuante.classList.add("mostrar-balao"); }, 6000);
    setTimeout(function () { flutuante.classList.remove("mostrar-balao"); }, 14000);
  }

  /* ---------- Vídeo do YouTube só carrega ao clicar ---------- */
  document.querySelectorAll("[data-youtube]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-youtube");
      btn.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Vídeo do Espaço Renovare" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      medir("video_start", { video: id });
    }, { once: true });
  });

  /* ---------- Máscara de telefone ---------- */
  document.querySelectorAll("[data-mascara-tel]").forEach(function (inp) {
    inp.addEventListener("input", function () {
      var d = inp.value.replace(/\D/g, "").slice(0, 11);
      var r = d;
      if (d.length > 6) r = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      else if (d.length > 2) r = "(" + d.slice(0, 2) + ") " + d.slice(2);
      else if (d.length > 0) r = "(" + d;
      inp.value = r;
    });
  });

  /* ---------- Formulário de visita -> WhatsApp (+ envio opcional) ---------- */
  document.querySelectorAll("[data-form-visita]").forEach(function (form) {
    var erro = form.querySelector(".form-visita__erro");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = form.elements;
      if (f.site && f.site.value) return; // robô
      var faltando = [];
      [["nome", "seu nome"], ["whatsapp", "seu WhatsApp"], ["idade", "a idade da criança"]].forEach(function (c) {
        var el = f[c[0]];
        var vazio = !el.value.trim() || (c[0] === "whatsapp" && el.value.replace(/\D/g, "").length < 10);
        el.setAttribute("aria-invalid", vazio ? "true" : "false");
        if (vazio) faltando.push(c[1]);
      });
      if (faltando.length) {
        erro.textContent = "Falta preencher: " + faltando.join(", ") + ".";
        erro.hidden = false;
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      erro.hidden = true;

      var d = {
        nome: f.nome.value.trim(),
        whatsapp: f.whatsapp.value.trim(),
        crianca: f.crianca.value.trim(),
        idade: f.idade.value,
        periodo: f.periodo.value,
        quando: f.quando.value,
        origem: f.origem.value,
        pagina: location.pathname
      };
      var linhas = [
        "Olá! Gostaria de agendar uma visita ao Espaço Renovare.",
        "",
        "*Meu nome:* " + d.nome,
        d.crianca ? "*Criança:* " + d.crianca + " (" + d.idade + ")" : "*Idade da criança:* " + d.idade,
        d.periodo ? "*Período de interesse:* " + d.periodo : "",
        d.quando ? "*Melhor horário para visitar:* " + d.quando : "",
        d.origem ? "*Conheci a escola por:* " + d.origem : ""
      ].filter(function (l, i) { return l !== "" || i === 1; });
      var url = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));

      // Cópia do pedido por e-mail/planilha (se configurado no painel)
      if (cfg.endpoint) {
        try {
          if (/web3forms/.test(cfg.endpoint)) {
            fetch(cfg.endpoint, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(Object.assign({ access_key: cfg.chave, subject: "Novo pedido de visita – site Renovare", from_name: "Site Espaço Renovare" }, d)) });
          } else {
            // Ex.: Google Apps Script que grava numa planilha (ver docs/planilha-de-visitas.gs)
            fetch(cfg.endpoint, { method: "POST", mode: "no-cors", keepalive: true, body: new URLSearchParams(d) });
          }
        } catch (e) {}
      }

      medir("generate_lead", { origem: d.origem || "nao_informado", idade: d.idade, periodo: d.periodo });
      try { sessionStorage.setItem("renovare_whats", url); } catch (e) {}

      var janela = window.open(url, "_blank");
      if (janela) { try { janela.opener = null; } catch (e) {} location.href = "/obrigado/"; }
      else location.href = url;
    });
  });

  /* Página de obrigado: botão reabre o WhatsApp com a mensagem pronta */
  var retomar = document.querySelector("[data-whats-retomar]");
  if (retomar) {
    var salvo = null;
    try { salvo = sessionStorage.getItem("renovare_whats"); } catch (e) {}
    retomar.href = salvo || "https://wa.me/" + cfg.whatsapp;
    retomar.target = "_blank";
    retomar.rel = "noopener";
  }
})();
