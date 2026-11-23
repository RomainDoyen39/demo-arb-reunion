function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
function selectUserFilter(userType) {
      // Boutons styles
      const filters = ['collectivite', 'entreprise', 'association'];
      filters.forEach(type => {
        const btn = document.getElementById('filter-' + type);
        if (!btn) return;
        if (type === userType) {
          btn.className = 'group flex items-start gap-space-sm p-space-md rounded-DEFAULT bg-secondary-container text-primary transition-all text-left';
          const iconContainer = btn.querySelector('div:first-child');
          if (iconContainer) iconContainer.className = 'w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0';
        } else {
          btn.className = 'group flex items-start gap-space-sm p-space-md rounded-DEFAULT bg-surface-container-high hover:bg-surface-variant text-on-surface transition-all text-left';
          const iconContainer = btn.querySelector('div:first-child');
          if (iconContainer) iconContainer.className = 'w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary group-hover:scale-105 transition-transform flex-shrink-0';
        }
      });

      // Filtrer ou mettre en exergue les cartes
      const cards = document.querySelectorAll('.dispositif-card');
      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (categories.includes(userType)) {
          card.style.opacity = '1';
          card.classList.remove('grayscale');
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0.55';
          card.classList.add('grayscale');
          card.style.transform = 'scale(0.99)';
        }
      });

      // Mettre à jour pré-sélection dans le formulaire
      const formSelect = document.getElementById('form-structure');
      if (formSelect) {
        if (userType === 'collectivite') formSelect.value = 'commune';
        else if (userType === 'entreprise') formSelect.value = 'entreprise';
        else if (userType === 'association') formSelect.value = 'association';
      }
    }

    function submitForm() {
      const successMsg = document.getElementById('form-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
window.selectUserFilter = selectUserFilter;
window.submitForm = submitForm;

