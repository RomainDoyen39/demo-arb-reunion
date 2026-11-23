function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

const norm = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const activeType =
  'px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-sm';
const idleType =
  'px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface hover:bg-secondary-container transition-colors font-label-sm text-label-sm';
const activeTheme =
  'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-primary-container font-label-sm text-label-sm';
const idleTheme =
  'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-fixed transition-colors font-label-sm text-label-sm';
const activeSort = 'font-label-md text-label-md text-primary font-bold underline underline-offset-4';
const idleSort = 'font-label-md text-label-md text-secondary hover:text-on-surface';

const PAGE_SIZE = 4;
const pageOn =
  'w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold font-label-md text-label-md';
const pageOff =
  'w-10 h-10 rounded-full bg-surface-container hover:bg-secondary-container text-on-surface font-label-md text-label-md transition-colors';
const pageNav =
  'w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-secondary-container hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

const state = {
  q: '',
  kind: '',
  period: 'all',
  themes: new Set(),
  sort: 'recent',
  page: 1,
  expanded: false,
};

onReady(() => {
  const items = [...document.querySelectorAll('[data-item]')].map((el) => ({
    el,
    kind: el.dataset.kind || '',
    period: el.dataset.period || '',
    themes: (el.dataset.themes || '').split(/\s+/).filter(Boolean),
    date: el.dataset.date || '',
    views: Number(el.dataset.views || 0),
    text: norm(el.textContent),
  }));
  if (!items.length) return;

  const search = document.getElementById('search-news');
  const period = document.getElementById('agenda-period');
  const typeButtons = [...document.querySelectorAll('#agenda-types button')];
  const themeButtons = [...document.querySelectorAll('#agenda-themes button')];
  const newsGrid = document.getElementById('news-grid');
  const eventsList = document.getElementById('events-list');
  const sortRecent = document.getElementById('sort-recent');
  const sortViews = document.getElementById('sort-views');

  function matches(item) {
    if (state.q && !item.text.includes(norm(state.q))) return false;
    if (state.kind && item.kind !== state.kind) return false;
    if (state.period !== 'all' && item.period !== state.period) return false;
    if (state.themes.size && !item.themes.some((theme) => state.themes.has(theme))) return false;
    return true;
  }

  const pager = document.getElementById('news-pager');
  const more = document.getElementById('news-more');

  function paintPager(pages) {
    if (!pager) return;
    pager.innerHTML = '';
    const make = (page, { current = false, disabled = false, icon = '' } = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = icon ? pageNav : current ? pageOn : pageOff;
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      button.setAttribute('aria-label', icon === 'left' ? 'Page précédente' : icon === 'right' ? 'Page suivante' : `Page ${page}`);
      button.innerHTML = icon
        ? `<span class="material-symbols-outlined text-[20px]">chevron_${icon}</span>`
        : String(page);
      button.addEventListener('click', () => {
        state.expanded = false;
        state.page = page;
        apply(true);
      });
      pager.appendChild(button);
    };
    make(state.page - 1, { icon: 'left', disabled: state.page <= 1 });
    for (let page = 1; page <= pages; page += 1) make(page, { current: page === state.page });
    make(state.page + 1, { icon: 'right', disabled: state.page >= pages });
  }

  function apply(fromPager = false) {
    if (!fromPager) {
      state.page = 1;
      state.expanded = false;
    }
    const visible = items.filter(matches);
    const ordered = [...visible].sort((a, b) => {
      if (state.sort === 'views') return b.views - a.views;
      return b.date.localeCompare(a.date);
    });

    const news = ordered.filter((item) => newsGrid?.contains(item.el));
    const events = ordered.filter((item) => eventsList?.contains(item.el));
    const pages = Math.max(1, Math.ceil(news.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    const start = state.expanded ? 0 : (state.page - 1) * PAGE_SIZE;
    const slice = state.expanded ? news : news.slice(start, start + PAGE_SIZE);
    const newsPage = new Set(slice);

    items.forEach((item) => {
      if (newsGrid?.contains(item.el)) item.el.hidden = !newsPage.has(item);
      else item.el.hidden = !visible.includes(item);
    });
    ordered.forEach((item) => {
      if (newsGrid?.contains(item.el)) newsGrid.appendChild(item.el);
      if (eventsList?.contains(item.el)) eventsList.appendChild(item.el);
    });

    const count = visible.length;
    const counter = document.getElementById('agenda-count');
    if (counter) {
      counter.innerHTML = `<strong>${count}</strong> résultat${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}`;
    }

    document.getElementById('news-empty')?.toggleAttribute('hidden', news.length !== 0);
    document.getElementById('events-empty')?.toggleAttribute('hidden', events.length !== 0);
    const range = document.getElementById('news-range');
    if (range) {
      range.textContent = news.length
        ? `Affichage de ${start + 1} à ${start + newsPage.size} sur ${news.length} article${news.length > 1 ? 's' : ''}`
        : 'Aucun article';
    }
    const pageLabel = document.getElementById('news-page-label');
    if (pageLabel) {
      pageLabel.innerHTML = state.expanded
        ? 'Tous les articles'
        : `Page <strong>${news.length ? state.page : 0}</strong> sur <strong>${news.length ? pages : 0}</strong>`;
    }
    paintPager(news.length ? pages : 1);
    if (more) more.disabled = newsPage.size >= news.length;

    typeButtons.forEach((button) => {
      const on = (button.dataset.kind || '') === state.kind;
      button.className = on ? activeType : idleType;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    themeButtons.forEach((button) => {
      const on = state.themes.has(button.dataset.theme);
      button.className = on ? activeTheme : idleTheme;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (sortRecent && sortViews) {
      sortRecent.className = state.sort === 'recent' ? activeSort : idleSort;
      sortViews.className = state.sort === 'views' ? activeSort : idleSort;
    }
  }

  search?.addEventListener('input', () => {
    state.q = search.value.trim();
    apply();
  });
  document.getElementById('agenda-clear')?.addEventListener('click', () => {
    if (search) search.value = '';
    state.q = '';
    apply();
    search?.focus();
  });
  period?.addEventListener('change', () => {
    state.period = period.value || 'all';
    apply();
  });
  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.kind = button.dataset.kind || '';
      apply();
    });
  });
  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.theme;
      if (state.themes.has(theme)) state.themes.delete(theme);
      else state.themes.add(theme);
      apply();
    });
  });
  sortRecent?.addEventListener('click', () => {
    state.sort = 'recent';
    apply();
  });
  sortViews?.addEventListener('click', () => {
    state.sort = 'views';
    apply();
  });
  more?.addEventListener('click', () => {
    state.expanded = true;
    apply(true);
  });

  apply();
});
