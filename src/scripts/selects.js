const menus = new WeakMap();
let openSelect = null;

const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
if (valueDescriptor?.set) {
  Object.defineProperty(HTMLSelectElement.prototype, 'value', {
    configurable: true,
    get() {
      return valueDescriptor.get.call(this);
    },
    set(next) {
      valueDescriptor.set.call(this, next);
      this.dispatchEvent(new Event('arb-select-sync'));
    },
  });
}

function optionsOf(select) {
  return [...select.options];
}

function paint(select) {
  const menu = menus.get(select);
  if (!menu) return;
  const current = select.value;
  menu.querySelectorAll('.arb-select-option').forEach((button) => {
    const selected = button.dataset.value === current;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

function place(select) {
  const menu = menus.get(select);
  if (!menu) return;
  const rect = select.getBoundingClientRect();
  const gap = 6;
  const width = Math.max(rect.width, 220);
  menu.style.width = `${width}px`;
  menu.hidden = false;

  let left = rect.left;
  let top = rect.bottom + gap;
  const menuRect = menu.getBoundingClientRect();
  if (top + menuRect.height > window.innerHeight - 12) {
    const above = rect.top - gap - menuRect.height;
    if (above >= 12) top = above;
  }
  if (left + width > window.innerWidth - 12) {
    left = Math.max(12, window.innerWidth - 12 - width);
  }
  menu.style.left = `${Math.max(12, left)}px`;
  menu.style.top = `${Math.max(12, top)}px`;
}

function close(select) {
  const menu = menus.get(select);
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  select.classList.remove('is-open');
  select.setAttribute('aria-expanded', 'false');
  if (openSelect === select) openSelect = null;
}

function closeOpen() {
  if (openSelect) close(openSelect);
}

function open(select) {
  if (select.disabled) return;
  if (openSelect && openSelect !== select) close(openSelect);
  place(select);
  select.classList.add('is-open');
  select.setAttribute('aria-expanded', 'true');
  openSelect = select;
  paint(select);
  const selected = menus.get(select)?.querySelector('.is-selected');
  selected?.focus({ preventScroll: true });
}

function choose(select, value) {
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  close(select);
  select.focus();
}

function build(select) {
  const menu = document.createElement('div');
  menu.className = 'arb-select-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'listbox');
  menu.id = `${select.id || 'select'}-menu`;
  select.setAttribute('aria-controls', menu.id);
  select.setAttribute('aria-expanded', 'false');

  optionsOf(select).forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'arb-select-option';
    button.setAttribute('role', 'option');
    button.dataset.value = option.value;
    button.disabled = option.disabled;
    if (option.value === '') button.dataset.placeholder = 'true';

    const mark = document.createElement('span');
    mark.className = 'arb-select-check material-symbols-outlined';
    mark.textContent = 'check';
    mark.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.textContent = option.textContent.trim();

    button.append(mark, label);
    button.addEventListener('click', () => choose(select, option.value));
    button.addEventListener('keydown', (event) => {
      const items = [...menu.querySelectorAll('.arb-select-option:not(:disabled)')];
      const index = items.indexOf(button);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        items[(index + 1) % items.length]?.focus({ preventScroll: true });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus({ preventScroll: true });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close(select);
        select.focus();
      }
    });
    menu.appendChild(button);
  });

  document.body.appendChild(menu);
  menus.set(select, menu);
  paint(select);
}

function addChevron(select) {
  const next = select.nextElementSibling;
  if (next?.classList.contains('material-symbols-outlined') && next.textContent.trim() === 'expand_more') {
    next.remove();
  }

  const wrap = document.createElement('span');
  wrap.className = 'arb-select-wrap';
  if (select.classList.contains('w-full')) wrap.classList.add('is-block');
  select.before(wrap);
  wrap.append(select);

  const chevron = document.createElement('span');
  chevron.className = 'arb-select-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML =
    '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  wrap.append(chevron);
  select.classList.add('arb-select');
}

function enhance(select) {
  if (select.multiple || select.dataset.arbSelect === 'on') return;
  select.dataset.arbSelect = 'on';
  addChevron(select);
  build(select);

  select.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    select.focus();
    if (openSelect === select) close(select);
    else open(select);
  });

  select.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open(select);
    } else if (event.key === 'Escape') {
      close(select);
    }
  });

  select.addEventListener('arb-select-sync', () => paint(select));
  select.form?.addEventListener('reset', () => {
    requestAnimationFrame(() => paint(select));
  });
}

function start() {
  document.querySelectorAll('select').forEach(enhance);
}

document.addEventListener('pointerdown', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('.arb-select-menu')) return;
  if (target instanceof HTMLSelectElement && target.dataset.arbSelect === 'on') return;
  closeOpen();
});

window.addEventListener('resize', () => {
  if (openSelect) place(openSelect);
});

window.addEventListener(
  'scroll',
  (event) => {
    if (event.target instanceof Element && event.target.closest('.arb-select-menu')) return;
    closeOpen();
  },
  true,
);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
