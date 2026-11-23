function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
onReady( () => {
      // 1. Profile selector toggle
      const profileButtons = document.querySelectorAll('.profile-btn');
      const profileInput = document.getElementById('userProfileInput');

      profileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          profileButtons.forEach(b => {
            b.classList.remove('bg-primary-container', 'text-inverse-on-surface', 'shadow-sm');
            b.classList.add('bg-surface-container', 'text-on-surface');
          });
          btn.classList.add('bg-primary-container', 'text-inverse-on-surface', 'shadow-sm');
          btn.classList.remove('bg-surface-container', 'text-on-surface');
          if (profileInput) {
            profileInput.value = btn.getAttribute('data-profile');
          }
        });
      });

      // 2. FAQ Accordion
      const triggers = document.querySelectorAll('.faq-trigger');
      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.faq-item');
          const content = item.querySelector('.faq-content');
          const icon = item.querySelector('.faq-icon');
          const isExpanded = !content.classList.contains('hidden');

          // Close other opened FAQs
          document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
          document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

          if (!isExpanded) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
          }
        });
      });

      // 3. Form Submit Feedback Simulation
      const contactForm = document.getElementById('arbContactForm');
      const successToast = document.getElementById('formSuccessToast');

      if (contactForm && successToast) {
        contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          successToast.classList.remove('hidden');
          contactForm.reset();
          successToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            successToast.classList.add('hidden');
          }, 6000);
        });
      }
    });
