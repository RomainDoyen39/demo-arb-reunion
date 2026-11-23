import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

const norm = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const COORDS = {
  parc: [-21.136, 55.628],
  cbnm: [-21.178, 55.292],
  kelonia: [-21.151, 55.286],
  seor: [-20.963, 55.65],
  rnmr: [-21.087, 55.236],
  genie: [-20.897, 55.549],
  etang: [-20.997, 55.294],
  gceip: [-20.882, 55.451],
  sentinelles: [-21.135, 55.472],
};

const COLORS = {
  public: '#114e4a',
  gest: '#1e6f5c',
  recherche: '#2f5d8c',
  bureau: '#c07d32',
  asso: '#c84b31',
  pepiniere: '#6b8f3c',
};

const TYPE_LABELS = {
  public: 'Établissement public',
  gest: 'Parc & réserve',
  recherche: 'Recherche',
  bureau: "Bureau d'études",
  asso: 'Association',
  pepiniere: 'Pépinière',
};

const activeType =
  'px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-inverse-on-surface shadow-sm transition-all';
const idleType =
  'px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-high text-on-surface hover:bg-secondary-container hover:text-primary-container transition-all';
const activeToggle =
  'px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface text-primary-container shadow-sm flex items-center gap-1.5 transition-all';
const idleToggle =
  'px-space-md py-1.5 rounded-full font-label-md text-label-md text-secondary hover:text-primary-container flex items-center gap-1.5 transition-all';
const activeExpertise =
  'px-3 py-1 rounded-full text-xs font-label-md bg-primary-container text-inverse-on-surface transition-colors';
const idleExpertise =
  'px-3 py-1 rounded-full text-xs font-label-md bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-primary-container transition-colors';
const regionBase =
  'flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer group';

const state = {
  q: '',
  type: '',
  regions: [],
  expertises: new Set(),
  sort: 'pertinence',
  view: 'map',
  page: 1,
};

const PAGE_SIZE = 6;
const pageOn =
  'w-9 h-9 rounded-full flex items-center justify-center bg-primary-container text-inverse-on-surface font-label-md text-label-md shadow-sm';
const pageOff =
  'w-9 h-9 rounded-full flex items-center justify-center bg-surface-container hover:bg-secondary-container text-on-surface font-label-md text-label-md transition-colors';
const pageNav =
  'w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-high text-secondary hover:bg-secondary-container hover:text-primary-container transition-colors disabled:opacity-40';

function tokens(value) {
  return (value || '').split(/\s+/).filter(Boolean);
}

function pin(color) {
  return L.divIcon({
    className: 'reunion-pin',
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(28,28,22,.35)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });
}

onReady(() => {
  const grid = document.getElementById('actor-grid');
  const mapEl = document.getElementById('reunion-map');
  if (!grid || !mapEl) return;

  const actors = [...grid.querySelectorAll('[data-actor]')].map((el, index) => ({
    el,
    index,
    id: el.dataset.id,
    types: tokens(el.dataset.types),
    regions: tokens(el.dataset.regions),
    expertises: tokens(el.dataset.expertises),
    name: el.dataset.name || '',
    place: el.dataset.place || '',
    updated: Number(el.dataset.updated || 0),
    text: norm(el.textContent),
  }));

  const map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: true,
  });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const island = L.latLngBounds([-21.42, 55.2], [-20.86, 55.85]);
  map.fitBounds(island, { padding: [16, 16] });
  map.setMinZoom(9);
  map.setMaxBounds(island.pad(0.6));

  const markers = new Map();
  actors.forEach((actor) => {
    const coords = COORDS[actor.id];
    if (!coords) return;
    const color = COLORS[actor.types[0]] || '#114e4a';
    const marker = L.marker(coords, { icon: pin(color), title: actor.name });
    marker.bindPopup(
      `<div style="min-width:190px;font-family:inherit">
        <p style="margin:0;font-weight:700;color:#114e4a">${actor.name}</p>
        <p style="margin:4px 0 8px;color:#4d635e">${actor.place}</p>
        <button type="button" data-goto="${actor.id}" style="border:0;background:#114e4a;color:#fdf9ef;border-radius:9999px;padding:6px 12px;cursor:pointer">Voir la fiche</button>
      </div>`
    );
    marker.addTo(map);
    markers.set(actor.id, marker);
  });

  map.on('popupopen', (event) => {
    const button = event.popup.getElement()?.querySelector('[data-goto]');
    if (!button) return;
    button.addEventListener('click', () => focusCard(button.getAttribute('data-goto')));
  });

  const typeButtons = [...document.querySelectorAll('#filter-types button, #map-legend button')];
  const expertiseButtons = [...document.querySelectorAll('#filter-expertises button')];
  const regionItems = [...document.querySelectorAll('#region-list [data-region]')];
  const typeSelect = document.getElementById('filter-type');
  const regionSelect = document.getElementById('filter-region');
  const sortSelect = document.getElementById('filter-sort');
  const searchForm = document.getElementById('annuaire-search');
  const searchInput = document.getElementById('search-input');
  const mapView = document.getElementById('map-view');
  const syntheseView = document.getElementById('synthese-view');
  const btnMap = document.getElementById('btn-toggle-map');
  const btnList = document.getElementById('btn-toggle-list');

  function focusCard(id) {
    const actor = actors.find((item) => item.id === id);
    if (!actor) return;
    actor.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    actor.el.classList.add('ring-2', 'ring-primary-container');
    window.setTimeout(() => actor.el.classList.remove('ring-2', 'ring-primary-container'), 1600);
  }

  function matches(actor, ignoreType = false) {
    if (state.q) {
      const query = norm(state.q);
      const haystack = `${actor.text} ${norm(actor.name)} ${norm(actor.place)}`;
      if (!haystack.includes(query)) return false;
    }
    if (!ignoreType && state.type && !actor.types.includes(state.type)) return false;
    if (state.regions.length && !actor.regions.some((region) => state.regions.includes(region))) return false;
    if (state.expertises.size && !actor.expertises.some((item) => state.expertises.has(item))) return false;
    return true;
  }

  function paintTypeButtons() {
    document.querySelectorAll('#filter-types button').forEach((button) => {
      const on = (button.dataset.type || '') === state.type;
      button.className = on ? activeType : idleType;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('#map-legend button').forEach((button) => {
      const on = button.dataset.type === state.type && state.type !== '';
      button.classList.toggle('bg-secondary-container', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (typeSelect && typeSelect.value !== state.type) typeSelect.value = state.type;
  }

  function paintRegions() {
    const key = state.regions.join(' ');
    regionItems.forEach((item) => {
      const on = item.dataset.region === key && key !== '';
      item.className = `${regionBase} ${on ? 'bg-secondary-container' : 'bg-surface-container-low hover:bg-secondary-container/40'}`;
      item.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (!regionSelect) return;
    const single = state.regions.length === 1 ? state.regions[0] : '';
    const allowed = [...regionSelect.options].some((option) => option.value === single);
    regionSelect.value = allowed ? single : '';
  }

  function paintExpertises() {
    expertiseButtons.forEach((button) => {
      const on = state.expertises.has(button.dataset.expertise);
      button.className = on ? activeExpertise : idleExpertise;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setView(view) {
    state.view = view;
    if (mapView) mapView.hidden = view !== 'map';
    if (syntheseView) syntheseView.hidden = view !== 'list';
    if (btnMap && btnList) {
      btnMap.className = view === 'map' ? activeToggle : idleToggle;
      btnList.className = view === 'list' ? activeToggle : idleToggle;
      btnMap.setAttribute('aria-pressed', view === 'map' ? 'true' : 'false');
      btnList.setAttribute('aria-pressed', view === 'list' ? 'true' : 'false');
    }
    if (view === 'map') {
      window.requestAnimationFrame(() => map.invalidateSize());
    }
  }

  function paintPager(pages) {
    const pager = document.getElementById('actor-pager');
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
        ? `<span class="material-symbols-outlined text-[18px]">chevron_${icon}</span>`
        : String(page);
      button.addEventListener('click', () => {
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
    if (!fromPager) state.page = 1;
    const visible = actors.filter((actor) => matches(actor));
    const ordered = [...visible].sort((a, b) => {
      if (state.sort === 'alpha') return a.name.localeCompare(b.name, 'fr');
      if (state.sort === 'recent') return b.updated - a.updated;
      if (state.sort === 'commune') return a.place.localeCompare(b.place, 'fr');
      return a.index - b.index;
    });

    const pages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * PAGE_SIZE;
    const slice = new Set(ordered.slice(start, start + PAGE_SIZE));

    actors.forEach((actor) => {
      actor.el.hidden = !slice.has(actor);
    });
    ordered.forEach((actor) => grid.appendChild(actor.el));

    const points = [];
    actors.forEach((actor) => {
      const marker = markers.get(actor.id);
      if (!marker) return;
      const show = visible.includes(actor);
      if (show) {
        if (!map.hasLayer(marker)) marker.addTo(map);
        points.push(COORDS[actor.id]);
      } else if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    if (points.length === 1) map.setView(points[0], 12);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 11 });
    else map.fitBounds(island, { padding: [16, 16] });

    const count = visible.length;
    const results = document.getElementById('results-count');
    if (results) results.textContent = `${count} résultat${count > 1 ? 's' : ''}`;
    const range = document.getElementById('actor-range');
    if (range) {
      const end = start + slice.size;
      range.innerHTML = count
        ? `Affichage de <span class="font-bold text-on-surface">${start + 1} à ${end}</span> sur <span class="font-bold text-on-surface">${count}</span> structures affichées`
        : 'Aucune structure affichée';
    }
    paintPager(count ? pages : 1);
    if (fromPager) grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const empty = document.getElementById('actor-empty');
    if (empty) empty.classList.toggle('hidden', count !== 0);
    const mapEmpty = document.getElementById('map-empty');
    if (mapEmpty) mapEmpty.classList.toggle('hidden', count !== 0);

    const pool = actors.filter((actor) => matches(actor, true));
    document.querySelectorAll('#filter-types [data-count]').forEach((slot) => {
      const type = slot.parentElement?.dataset.type || '';
      const total = type ? pool.filter((actor) => actor.types.includes(type)).length : pool.length;
      slot.textContent = `(${total})`;
    });

    const list = document.getElementById('synthese-list');
    const syntheseCount = document.getElementById('synthese-count');
    const syntheseEmpty = document.getElementById('synthese-empty');
    if (list) {
      list.innerHTML = ordered
        .map((actor) => {
          const color = COLORS[actor.types[0]] || '#114e4a';
          const label = TYPE_LABELS[actor.types[0]] || 'Structure';
          return `<button type="button" data-focus="${actor.id}" class="w-full text-left py-3 flex items-start justify-between gap-4">
            <span>
              <span class="block font-semibold text-primary">${actor.name}</span>
              <span class="block text-sm text-secondary">${actor.place} · ${label}</span>
            </span>
            <span class="mt-1.5 w-3 h-3 rounded-full shrink-0" style="background:${color}"></span>
          </button>`;
        })
        .join('');
      list.querySelectorAll('[data-focus]').forEach((button) => {
        button.addEventListener('click', () => focusCard(button.getAttribute('data-focus')));
      });
    }
    if (syntheseCount) {
      syntheseCount.textContent = count
        ? `${count} structure${count > 1 ? 's' : ''} correspondant aux filtres en cours.`
        : '';
    }
    if (syntheseEmpty) syntheseEmpty.classList.toggle('hidden', count !== 0);

    paintTypeButtons();
    paintRegions();
    paintExpertises();
  }

  function setType(type) {
    state.type = state.type === type ? '' : type;
    apply();
  }

  typeButtons.forEach((button) => {
    button.addEventListener('click', () => setType(button.dataset.type || ''));
  });

  expertiseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.expertise;
      if (state.expertises.has(key)) state.expertises.delete(key);
      else state.expertises.add(key);
      apply();
    });
  });

  regionItems.forEach((item) => {
    const choose = () => {
      const next = tokens(item.dataset.region);
      const same = next.join(' ') === state.regions.join(' ');
      state.regions = same ? [] : next;
      apply();
    };
    item.addEventListener('click', choose);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });
  });

  typeSelect?.addEventListener('change', () => {
    state.type = typeSelect.value;
    apply();
  });
  regionSelect?.addEventListener('change', () => {
    state.regions = regionSelect.value ? [regionSelect.value] : [];
    apply();
  });
  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    apply();
  });
  searchInput?.addEventListener('input', () => {
    state.q = searchInput.value.trim();
    apply();
  });
  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.q = searchInput?.value.trim() || '';
    if (typeSelect) state.type = typeSelect.value;
    if (regionSelect) state.regions = regionSelect.value ? [regionSelect.value] : state.regions;
    apply();
    document.getElementById('annuaire-console')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnMap?.addEventListener('click', () => setView('map'));
  btnList?.addEventListener('click', () => setView('list'));

  apply();
});
