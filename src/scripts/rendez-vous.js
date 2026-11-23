function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
window.validateAndConfirmBooking = function() {
    const toast = document.getElementById('confirmationToast');
    if (toast) {
      toast.classList.remove('hidden');
    }
  };

  // Interactions visuelles douces sur le calendrier des jours
  onReady( () => {
    const dayButtons = document.querySelectorAll('.day-btn:not([disabled])');
    dayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dayButtons.forEach(b => {
          b.classList.remove('border-2', 'border-primary-container');
        });
        btn.classList.add('border-2', 'border-primary-container');
      });
    });
  });
