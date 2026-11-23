function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

const norm = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const activeTab =
  'px-5 py-2.5 rounded-full bg-primary-container text-inverse-on-surface font-label-lg text-label-lg whitespace-nowrap shadow-sm transition-all';
const idleTab =
  'px-5 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-secondary-container transition-colors font-label-lg text-label-lg whitespace-nowrap';
const pageOn =
  'w-9 h-9 rounded-full bg-primary-container text-inverse-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold';
const pageOff =
  'w-9 h-9 rounded-full bg-surface-container hover:bg-secondary-container text-on-surface font-label-sm text-label-sm flex items-center justify-center transition-colors';
const pageNav =
  'w-9 h-9 rounded-full bg-surface-container hover:bg-secondary-container text-on-surface flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

const state = {
  q: '',
  type: 'all',
  theme: 'all',
  collection: '',
  sort: 'recent',
  page: 1,
  perPage: 6,
};

function readDoc(el) {
  return {
    el,
    type: el.dataset.type || '',
    themes: (el.dataset.theme || '').split(/\s+/).filter(Boolean),
    collection: el.dataset.collection || '',
    date: el.dataset.date || '',
    downloads: Number(el.dataset.downloads || 0),
    title: el.dataset.title || '',
    org: el.dataset.org || '',
    cite: el.dataset.cite || el.dataset.title || '',
    text: norm(`${el.dataset.title || ''} ${el.dataset.org || ''} ${el.textContent}`),
    featured: el.hasAttribute('data-featured'),
  };
}

function toast(message) {
  let el = document.getElementById('ressource-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ressource-toast';
    el.setAttribute('role', 'status');
    el.className =
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] max-w-[90vw] px-5 py-3 rounded-full bg-primary-container text-inverse-on-surface font-label-md shadow-lg';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.hidden = false;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

function downloadDoc(title) {
  const blob = new Blob(
    [
      `${title}\n\nFiche de démonstration — Centre de ressources ARB Réunion.\nCe document illustratif ne remplace pas la publication officielle.\n`,
    ],
    { type: 'text/plain;charset=utf-8' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  link.href = url;
  link.download = `${slug || 'ressource-arb'}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Téléchargement lancé');
}

onReady(() => {
  const grid = document.getElementById('doc-grid');
  if (!grid) return;

  const docs = [...document.querySelectorAll('[data-doc]')].map(readDoc);
  const catalog = docs.filter((doc) => grid.contains(doc.el));
  const featured = docs.filter((doc) => doc.featured);
  const search = document.getElementById('search-input');
  const typeSelect = document.getElementById('filter-type');
  const themeSelect = document.getElementById('filter-theme');
  const sortSelect = document.getElementById('doc-sort');
  const perPage = document.getElementById('per-page');
  const tabs = [...document.querySelectorAll('#doc-collections button')];
  const pager = document.getElementById('doc-pager');
  const range = document.getElementById('doc-range');
  const empty = document.getElementById('doc-empty');
  const featuredEmpty = document.getElementById('featured-empty');

  function matches(doc, { useCollection }) {
    if (state.q && !doc.text.includes(norm(state.q))) return false;
    if (state.type !== 'all' && doc.type !== state.type) return false;
    if (state.theme !== 'all' && !doc.themes.includes(state.theme)) return false;
    if (useCollection && state.collection && doc.collection !== state.collection) return false;
    return true;
  }

  function paintTabs(pool) {
    tabs.forEach((button) => {
      const key = button.dataset.collection || '';
      const total = key ? pool.filter((doc) => doc.collection === key).length : pool.length;
      const slot = button.querySelector('[data-count]');
      if (slot) slot.textContent = `(${total})`;
      const on = key === state.collection;
      button.className = on ? activeTab : idleTab;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function paintPager(pages) {
    if (!pager) return;
    pager.innerHTML = '';
    const make = (label, page, { current = false, disabled = false, icon = '' } = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = icon ? pageNav : current ? pageOn : pageOff;
      button.disabled = disabled;
      button.setAttribute('aria-label', icon === 'left' ? 'Page précédente' : icon === 'right' ? 'Page suivante' : `Page ${page}`);
      if (current) button.setAttribute('aria-current', 'page');
      button.innerHTML = icon
        ? `<span class="material-symbols-outlined text-[18px]">chevron_${icon}</span>`
        : String(label);
      button.addEventListener('click', () => {
        state.page = page;
        apply(true);
      });
      pager.appendChild(button);
    };
    make('', state.page - 1, { icon: 'left', disabled: state.page <= 1 });
    for (let page = 1; page <= pages; page += 1) {
      make(page, page, { current: page === state.page });
    }
    make('', state.page + 1, { icon: 'right', disabled: state.page >= pages });
  }

  function apply(fromPager = false) {
    if (!fromPager) state.page = 1;

    featured.forEach((doc) => {
      doc.el.hidden = !matches(doc, { useCollection: false });
    });
    featuredEmpty?.toggleAttribute('hidden', featured.some((doc) => !doc.el.hidden));

    const pool = catalog.filter((doc) => matches(doc, { useCollection: false }));
    const visible = pool.filter((doc) => matches(doc, { useCollection: true }));
    const ordered = [...visible].sort((a, b) => {
      if (state.sort === 'downloads') return b.downloads - a.downloads;
      if (state.sort === 'alpha') return a.title.localeCompare(b.title, 'fr');
      if (state.sort === 'org') return a.org.localeCompare(b.org, 'fr') || a.title.localeCompare(b.title, 'fr');
      return b.date.localeCompare(a.date);
    });

    const pages = Math.max(1, Math.ceil(ordered.length / state.perPage));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.perPage;
    const slice = new Set(ordered.slice(start, start + state.perPage));

    catalog.forEach((doc) => {
      doc.el.hidden = !slice.has(doc);
    });
    ordered.forEach((doc) => grid.appendChild(doc.el));

    if (range) {
      range.innerHTML = ordered.length
        ? `Affichage de <strong>${start + 1} à ${start + slice.size}</strong> sur <strong>${ordered.length}</strong> document${ordered.length > 1 ? 's' : ''}`
        : 'Aucun document affiché';
    }
    empty?.toggleAttribute('hidden', ordered.length !== 0);
    paintTabs(pool);
    paintPager(ordered.length ? pages : 1);

    if (fromPager) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  search?.addEventListener('input', () => {
    state.q = search.value.trim();
    apply();
  });
  document.getElementById('search-clear')?.addEventListener('click', () => {
    if (search) search.value = '';
    state.q = '';
    apply();
    search?.focus();
  });
  document.querySelectorAll('[data-query]').forEach((button) => {
    button.addEventListener('click', () => {
      const query = button.dataset.query || '';
      if (search) search.value = query;
      state.q = query;
      apply();
      document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  typeSelect?.addEventListener('change', () => {
    state.type = typeSelect.value || 'all';
    apply();
  });
  themeSelect?.addEventListener('change', () => {
    state.theme = themeSelect.value || 'all';
    apply();
  });
  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value || 'recent';
    apply();
  });
  perPage?.addEventListener('change', () => {
    state.perPage = Number(perPage.value) || 6;
    apply();
  });
  tabs.forEach((button) => {
    button.addEventListener('click', () => {
      state.collection = button.dataset.collection || '';
      apply();
    });
  });
  document.getElementById('ressources-search')?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.q = search?.value.trim() || '';
    state.type = typeSelect?.value || 'all';
    state.theme = themeSelect?.value || 'all';
    apply();
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.js-download').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const card = link.closest('[data-doc]');
      downloadDoc(card?.dataset.title || link.textContent.trim() || 'Ressource ARB');
    });
  });
  document.querySelectorAll('.js-cite').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('[data-doc]');
      const text = card?.dataset.cite || card?.dataset.title || '';
      try {
        await navigator.clipboard.writeText(text);
        toast('Citation copiée');
      } catch {
        toast('Citation : ' + text);
      }
    });
  });

  apply();
});
