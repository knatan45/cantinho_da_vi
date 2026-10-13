/* ALECRIM — lógica da interface.
   Dados: sites.js. Textos: config.js. Aqui não há links nem textos pessoais. */
(function () {
  'use strict';

  var DATA = window.RECEITAS_DATA;
  var CFG = window.RECEITAS_CONFIG;
  var STORAGE_KEY = 'alecrim.v1';

  /* ---------- utilidades ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }

  // Cria elementos sem innerHTML: todo texto entra via textContent.
  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) node.className = opts.cls;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.attrs) Object.keys(opts.attrs).forEach(function (k) { node.setAttribute(k, opts.attrs[k]); });
    if (opts.on) Object.keys(opts.on).forEach(function (k) { node.addEventListener(k, opts.on[k]); });
    [].concat(children || []).forEach(function (c) { if (c) node.append(c); });
    return node;
  }

  function normalize(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function clearNode(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  // Aceita apenas https, sem usuário/senha e, quando informado, dentro do domínio oficial.
  function safeUrl(raw, domain) {
    try {
      var u = new URL(String(raw));
      if (u.protocol !== 'https:') return null;
      if (u.username || u.password) return null;
      if (domain) {
        var host = u.hostname.toLowerCase();
        var d = String(domain).toLowerCase();
        if (host !== d && host.slice(-(d.length + 1)) !== '.' + d) return null;
      }
      return u.href;
    } catch (e) { return null; }
  }

  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : null;
  }

  /* ---------- dados validados ---------- */
  var categories = DATA.categories;
  var catById = {};
  categories.forEach(function (c) { catById[c.id] = c; });

  var invalidSites = [];
  var sites = DATA.sites.filter(function (s) {
    var href = safeUrl(s.url, s.domain);
    if (!href || !s.id || !s.name) {
      invalidSites.push(s && s.name ? s.name : '(sem nome)');
      if (window.console) console.warn('[Alecrim] Fonte ignorada por link inválido:', s && s.id);
      return false;
    }
    s._href = href;
    s._tone = 'tone-' + (sites_index_hash(s.id) % 5);
    s._search = normalize([
      s.name, s.description, s.type, s.language, s.domain,
      (s.keywords || []).join(' '),
      (s.categories || []).map(function (id) { return catById[id] ? catById[id].name : ''; }).join(' ')
    ].join(' '));
    return true;
  });

  function sites_index_hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  var siteById = {};
  sites.forEach(function (s) { siteById[s.id] = s; });

  /* ---------- armazenamento local ---------- */
  var state = loadState();

  function loadState() {
    var base = { favorites: [], tried: {}, notes: {}, wishlist: [] };
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      var p = JSON.parse(raw);
      if (Array.isArray(p.favorites)) base.favorites = p.favorites.filter(function (x) { return typeof x === 'string'; });
      if (p.tried && typeof p.tried === 'object') base.tried = p.tried;
      if (p.notes && typeof p.notes === 'object') base.notes = p.notes;
      if (Array.isArray(p.wishlist)) base.wishlist = p.wishlist.filter(function (w) { return w && typeof w.title === 'string'; });
      return base;
    } catch (e) { return base; }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      $('#storage-warning').hidden = false;
    }
  }

  function isFav(id) { return state.favorites.indexOf(id) !== -1; }
  function toggleFav(id) {
    var i = state.favorites.indexOf(id);
    if (i === -1) state.favorites.push(id); else state.favorites.splice(i, 1);
    saveState();
    renderAll();
  }

  /* ---------- cartão de fonte ---------- */
  function buildCard(site, withNotes) {
    var fav = isFav(site.id);
    var review = site.status === 'reviewed' && formatDate(site.lastReview);
    var badge = review
      ? el('span', { cls: 'badge badge-ok', text: 'Revisado em ' + review })
      : el('span', { cls: 'badge badge-pending', text: 'Revisão pendente' });

    var tags = el('ul', { cls: 'tags', attrs: { 'aria-label': 'Categorias' } },
      (site.categories || []).filter(function (id) { return catById[id]; }).map(function (id) {
        return el('li', { cls: 'tag', text: catById[id].name });
      }));

    var link = el('a', {
      cls: 'btn',
      text: 'Visitar site',
      attrs: { href: site._href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Visitar ' + site.name + ' (abre em nova aba)' }
    });

    var favBtn = el('button', {
      cls: 'btn btn-ghost fav-btn',
      text: fav ? '♥ Salvo' : '♡ Salvar',
      attrs: { type: 'button', 'aria-pressed': String(fav), 'aria-label': (fav ? 'Remover dos favoritos: ' : 'Salvar nos favoritos: ') + site.name },
      on: { click: function () { toggleFav(site.id); } }
    });

    var body = el('div', { cls: 'card-body' }, [
      el('div', {}, badge),
      el('p', { text: site.description }),
      el('p', { cls: 'meta', text: site.language + ' · ' + site.type }),
      tags,
      el('p', { cls: 'meta', text: 'Domínio oficial cadastrado: ' + site.domain }),
      site.note ? el('p', { cls: 'card-note', text: site.note }) : null,
      el('div', { cls: 'card-actions' }, [link, favBtn])
    ]);

    if (withNotes && fav) body.append(buildNotes(site));

    return el('article', { cls: 'card' }, [
      el('div', { cls: 'card-top' }, [
        el('div', { cls: 'mono ' + site._tone, text: site.name.charAt(0).toUpperCase(), attrs: { 'aria-hidden': 'true' } }),
        el('div', {}, [
          el('h3', { cls: 'card-title', text: site.name }),
          el('div', { cls: 'card-domain', text: site.domain })
        ])
      ]),
      body
    ]);
  }

  function buildNotes(site) {
    var tid = 'tried-' + site.id;
    var nid = 'note-' + site.id;
    var tried = el('input', { attrs: { type: 'checkbox', id: tid }, on: { change: function (e) {
      if (e.target.checked) state.tried[site.id] = true; else delete state.tried[site.id];
      saveState();
    } } });
    tried.checked = !!state.tried[site.id];

    var area = el('textarea', { attrs: { id: nid, maxlength: '1000', placeholder: 'Ex.: o bolo de cenoura ficou ótimo, usar menos açúcar' }, on: { input: function (e) {
      var v = e.target.value.slice(0, 1000);
      if (v) state.notes[site.id] = v; else delete state.notes[site.id];
      saveState();
    } } });
    area.value = state.notes[site.id] || '';

    var details = el('details', {}, [
      el('summary', { text: 'Anotações e “já experimentei”' }),
      el('label', { cls: 'check', attrs: { 'for': tid } }, [tried, document.createTextNode(' Já experimentei receitas daqui')]),
      el('label', { cls: 'sr-only', text: 'Anotações sobre ' + site.name, attrs: { 'for': nid } }),
      area
    ]);
    if (state.notes[site.id] || state.tried[site.id]) details.open = true;
    return details;
  }

  function fillCards(container, list, withNotes) {
    clearNode(container);
    list.forEach(function (s) { container.append(buildCard(s, withNotes)); });
  }

  /* ---------- navegação ---------- */
  var views = ['inicio', 'fontes', 'salvos', 'nosso-espaco'];

  function currentView() {
    var h = (location.hash || '').replace('#', '');
    return views.indexOf(h) !== -1 ? h : 'inicio';
  }

  function showView(focusHeading) {
    var v = currentView();
    document.querySelectorAll('.view').forEach(function (sec) { sec.hidden = sec.getAttribute('data-view') !== v; });
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    closeNav();
    if (focusHeading) {
      var h1 = $('.view[data-view="' + v + '"] h1');
      if (h1) h1.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function goTo(view) {
    if (location.hash === '#' + view) showView(true); else location.hash = view;
  }

  function closeNav() {
    var nav = $('#main-nav'), btn = $('#nav-toggle');
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  /* ---------- filtros da página de fontes ---------- */
  var filters = { q: '', cat: '', lang: '', onlyFav: false };

  function filteredSites() {
    var q = normalize(filters.q);
    var terms = q ? q.split(/\s+/) : [];
    return sites.filter(function (s) {
      if (filters.cat && (s.categories || []).indexOf(filters.cat) === -1) return false;
      if (filters.lang && s.language !== filters.lang) return false;
      if (filters.onlyFav && !isFav(s.id)) return false;
      return terms.every(function (t) { return s._search.indexOf(t) !== -1; });
    });
  }

  function renderChips() {
    var box = $('#cat-chips');
    clearNode(box);
    var all = [{ id: '', name: 'Todas' }].concat(categories);
    all.forEach(function (c) {
      box.append(el('button', {
        cls: 'chip', text: c.name,
        attrs: { type: 'button', 'aria-pressed': String(filters.cat === c.id) },
        on: { click: function () { filters.cat = c.id; renderResults(); renderChips(); } }
      }));
    });
  }

  function renderResults() {
    var list = filteredSites();
    fillCards($('#results'), list, false);
    $('#empty').hidden = list.length !== 0;
    $('#result-count').textContent = list.length === 1 ? '1 fonte encontrada' : list.length + ' fontes encontradas';
  }

  function resetFilters() {
    filters = { q: '', cat: '', lang: '', onlyFav: false };
    $('#q').value = ''; $('#lang').value = ''; $('#only-fav').checked = false;
    renderChips(); renderResults();
  }

  /* ---------- início ---------- */
  function renderHome() {
    var cats = $('#home-categories');
    clearNode(cats);
    categories.forEach(function (c) {
      cats.append(el('li', {}, el('button', {
        cls: 'cat-btn', attrs: { type: 'button' },
        on: { click: function () { filters.cat = c.id; syncFilterInputs(); renderChips(); renderResults(); goTo('fontes'); } }
      }, [el('strong', { text: c.name }), el('span', { text: c.hint })])));
    });

    fillCards($('#home-featured'), sites.filter(function (s) { return s.featured; }), false);

    var favBox = $('#home-favs');
    clearNode(favBox);
    var favs = state.favorites.filter(function (id) { return siteById[id]; });
    if (!favs.length) {
      favBox.append(el('p', { cls: 'muted', text: 'Quando você favoritar uma fonte, ela aparece aqui.' }));
    } else {
      var ul = el('ul', {});
      favs.slice(0, 5).forEach(function (id) { ul.append(el('li', { text: siteById[id].name })); });
      favBox.append(ul);
    }
  }

  function syncFilterInputs() {
    $('#q').value = filters.q;
    $('#lang').value = filters.lang;
    $('#only-fav').checked = filters.onlyFav;
  }

  /* ---------- salvos ---------- */
  function renderSaved() {
    var q = normalize($('#saved-q').value);
    var favs = state.favorites.map(function (id) { return siteById[id]; }).filter(Boolean).filter(function (s) {
      return !q || s._search.indexOf(q) !== -1 || normalize(state.notes[s.id]).indexOf(q) !== -1;
    });
    fillCards($('#fav-list'), favs, true);
    $('#fav-empty').hidden = favs.length !== 0;
    $('#fav-empty').textContent = state.favorites.length
      ? 'Nenhum favorito corresponde à pesquisa.'
      : 'Você ainda não favoritou nenhuma fonte. Toque em “Salvar” em um cartão de “Fontes”.';

    var listEl = $('#wish-list');
    clearNode(listEl);
    var items = state.wishlist.filter(function (w) {
      return !q || normalize(w.title + ' ' + (w.note || '')).indexOf(q) !== -1;
    });
    items.forEach(function (w) { listEl.append(buildWish(w)); });
    $('#wish-empty').hidden = items.length !== 0;
    $('#wish-empty').textContent = state.wishlist.length ? 'Nada na lista corresponde à pesquisa.' : 'Sua lista está vazia.';
  }

  function buildWish(w) {
    var cb = el('input', { attrs: { type: 'checkbox', 'aria-label': 'Marcar como experimentada: ' + w.title }, on: { change: function (e) {
      w.done = e.target.checked; saveState(); renderSaved();
    } } });
    cb.checked = !!w.done;

    var main = el('div', { cls: 'wish-main' }, [el('div', { cls: 'wish-title', text: w.title })]);
    var href = w.link ? safeUrl(w.link) : null;
    if (href) {
      var u = new URL(href);
      main.append(el('a', { text: u.hostname, attrs: { href: href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Abrir link de ' + w.title + ' (nova aba)' } }));
    }
    if (w.note) main.append(el('div', { cls: 'meta', text: w.note }));

    var rm = el('button', { cls: 'btn btn-ghost btn-small', text: 'Remover', attrs: { type: 'button', 'aria-label': 'Remover ' + w.title }, on: { click: function () {
      state.wishlist = state.wishlist.filter(function (x) { return x.id !== w.id; });
      saveState(); renderSaved();
    } } });

    return el('li', { cls: 'wish-item' + (w.done ? ' done' : '') }, [cb, main, rm]);
  }

  function onWishSubmit(e) {
    e.preventDefault();
    var msg = $('#wish-msg');
    var title = $('#wish-title').value.trim().slice(0, 120);
    var link = $('#wish-link').value.trim();
    var note = $('#wish-note').value.trim().slice(0, 300);
    msg.textContent = '';
    if (!title) { msg.textContent = 'Escreva o nome da receita.'; return; }
    if (link && !safeUrl(link)) { msg.textContent = 'O link precisa começar com https:// e ser um endereço válido.'; return; }
    state.wishlist.unshift({ id: String(Date.now()) + Math.random().toString(16).slice(2, 6), title: title, link: link ? safeUrl(link) : '', note: note, done: false });
    saveState();
    $('#wish-form').reset();
    renderSaved();
    $('#wish-title').focus();
  }

  /* ---------- nosso espaço ---------- */
  function setupLetter() {
    $('#letter-title').textContent = CFG.letterTitle;
    var body = $('#letter-body');
    clearNode(body);
    CFG.letterParagraphs.forEach(function (p) { body.append(el('p', { text: p })); });
    $('#letter-sign').textContent = CFG.letterSignature + (CFG.fromName ? '\n' + CFG.fromName : '');
    $('#surprise-title').textContent = CFG.surpriseTitle;
    $('#surprise-text').textContent = CFG.surpriseText;

    $('#envelope').addEventListener('click', function () {
      var letter = $('#letter');
      var open = letter.hidden;
      letter.hidden = !open;
      this.setAttribute('aria-expanded', String(open));
      $('#envelope-label').textContent = open ? 'Toque para fechar' : 'Toque para abrir';
      if (open) $('#letter-title').scrollIntoView({ block: 'start' });
    });
    $('#surprise-btn').addEventListener('click', function () {
      var s = $('#surprise');
      var open = s.hidden;
      s.hidden = !open;
      this.setAttribute('aria-expanded', String(open));
    });
    $('#go-adois').addEventListener('click', function () {
      filters = { q: '', cat: 'a-dois', lang: '', onlyFav: false };
      syncFilterInputs(); renderChips(); renderResults(); goTo('fontes');
    });
  }

  /* ---------- PWA ---------- */
  function setupPwa() {
    var deferred = null;
    var btn = $('#install-btn');
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); deferred = e; btn.hidden = false;
    });
    btn.addEventListener('click', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; btn.hidden = true; });
    });
    window.addEventListener('appinstalled', function () { btn.hidden = true; });

    var secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if ('serviceWorker' in navigator && secure) {
      navigator.serviceWorker.register('service-worker.js').catch(function () { /* o site funciona sem ele */ });
    }
  }

  /* ---------- montagem ---------- */
  function renderAll() {
    renderHome();
    renderResults();
    renderSaved();
  }

  function greeting() {
    var h = new Date().getHours();
    var part = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    return part + (CFG.herName ? ', ' + CFG.herName : '');
  }

  function init() {
    $('#brand-name').textContent = CFG.projectName;
    $('#tagline').textContent = CFG.tagline;
    $('#greeting').textContent = greeting();
    document.title = CFG.projectName + ' — receitas com carinho';

    // idiomas disponíveis vêm dos próprios dados
    var langs = [];
    sites.forEach(function (s) { if (langs.indexOf(s.language) === -1) langs.push(s.language); });
    langs.forEach(function (l) { $('#lang').append(el('option', { text: l, attrs: { value: l } })); });

    if (invalidSites.length) {
      var n = $('#invalid-notice');
      n.textContent = 'Algumas fontes foram ocultadas porque o link cadastrado não é um HTTPS válido do domínio oficial: ' + invalidSites.join(', ') + '.';
      n.hidden = false;
    }

    $('#nav-toggle').addEventListener('click', function () {
      var open = !$('#main-nav').classList.contains('open');
      $('#main-nav').classList.toggle('open', open);
      this.setAttribute('aria-expanded', String(open));
    });

    $('#home-search').addEventListener('submit', function (e) {
      e.preventDefault();
      filters = { q: $('#home-q').value.trim(), cat: '', lang: '', onlyFav: false };
      syncFilterInputs(); renderChips(); renderResults(); goTo('fontes');
    });

    $('#filters').addEventListener('submit', function (e) { e.preventDefault(); });
    $('#q').addEventListener('input', function (e) { filters.q = e.target.value; renderResults(); });
    $('#lang').addEventListener('change', function (e) { filters.lang = e.target.value; renderResults(); });
    $('#only-fav').addEventListener('change', function (e) { filters.onlyFav = e.target.checked; renderResults(); });
    $('#clear-filters').addEventListener('click', resetFilters);
    $('#empty-clear').addEventListener('click', resetFilters);

    $('#saved-q').addEventListener('input', renderSaved);
    $('#wish-form').addEventListener('submit', onWishSubmit);

    window.addEventListener('hashchange', function () { showView(true); });

    renderChips();
    renderAll();
    setupLetter();
    showView(false);
    setupPwa();
  }

  init();
})();
