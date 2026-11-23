function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

const activeClass = 'px-4 py-2 rounded-full bg-primary-container text-surface font-label-sm text-label-sm font-semibold flex items-center gap-2 shadow-sm transition-all hover:bg-primary';
const idleClass = 'px-4 py-2 rounded-full bg-surface-container text-on-surface hover:bg-secondary-container transition-colors font-label-sm text-label-sm font-medium flex items-center gap-2';

const norm = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function downloadReport(title) {
  const blob = new Blob(
    [`${title}\n\nFiche de démonstration — Observatoire ARB Réunion.\nCe document illustratif ne remplace pas la publication officielle.\n`],
    { type: 'text/plain;charset=utf-8' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60)}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

onReady(() => {
  const queryInput = document.getElementById('bio-query');
  const habitats = [...document.querySelectorAll('[data-habitat]')];
  const reports = [...document.querySelectorAll('[data-report]')];
  const yearSelect = document.getElementById('report-year');
  const state = { q: '', year: 'all' };

  const habitatEmpty = document.createElement('p');
  habitatEmpty.id = 'habitat-empty';
  habitatEmpty.className = 'col-span-full text-center font-body-md text-body-md text-secondary py-6';
  habitatEmpty.textContent = 'Aucun sanctuaire ne correspond à cette recherche.';
  habitatEmpty.hidden = true;
  document.getElementById('habitat-grid')?.appendChild(habitatEmpty);

  const reportEmpty = document.createElement('p');
  reportEmpty.id = 'report-empty';
  reportEmpty.className = 'col-span-full text-center font-body-md text-body-md text-secondary py-4';
  reportEmpty.textContent = 'Aucun rapport ne correspond à ces critères.';
  reportEmpty.hidden = true;
  document.getElementById('report-grid')?.appendChild(reportEmpty);

  function applySearch() {
    const q = norm(state.q);
    habitats.forEach((el) => {
      const blob = norm(`${el.dataset.keywords || ''} ${el.textContent}`);
      el.hidden = Boolean(q) && !blob.includes(q);
    });
    habitatEmpty.hidden = habitats.some((el) => !el.hidden);
    reports.forEach((el) => {
      const blob = norm(`${el.dataset.title || ''} ${el.textContent}`);
      const yearOk = state.year === 'all' || el.dataset.year === state.year;
      el.hidden = !yearOk || (Boolean(q) && !blob.includes(q));
    });
    reportEmpty.hidden = reports.some((el) => !el.hidden);
  }

  queryInput?.addEventListener('input', () => {
    state.q = queryInput.value.trim();
    applySearch();
  });
  document.getElementById('bio-search')?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.q = queryInput?.value.trim() || '';
    applySearch();
    document.getElementById('milieux')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelectorAll('button[data-query]').forEach((button) => {
    if (!queryInput) return;
    button.addEventListener('click', () => {
      queryInput.value = button.dataset.query || '';
      state.q = queryInput.value;
      applySearch();
      document.getElementById('milieux')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  yearSelect?.addEventListener('change', () => {
    state.year = yearSelect.value || 'all';
    applySearch();
  });
  document.querySelectorAll('.js-download').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const card = link.closest('[data-report]');
      downloadReport(card?.dataset.title || 'Rapport ARB');
    });
  });

  const bar = document.getElementById('map-filters');
  if (!bar) return;

  const buttons = [...bar.querySelectorAll('button[data-layer]')];
  const markers = [...document.querySelectorAll('[data-map-layer]')];
  const legendItems = [...document.querySelectorAll('[data-legend-layer]')];

  function apply(layer) {
    buttons.forEach((btn) => {
      const on = btn.dataset.layer === layer;
      btn.className = on ? activeClass : idleClass;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    markers.forEach((el) => {
      el.classList.toggle('hidden', layer !== 'generale' && el.dataset.mapLayer !== layer);
    });
    legendItems.forEach((el) => {
      el.classList.toggle('hidden', layer !== 'generale' && el.dataset.legendLayer !== layer);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => apply(btn.dataset.layer));
  });
});
