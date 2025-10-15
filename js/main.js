document.addEventListener('DOMContentLoaded', () => {
  loadPartials();
  initializeAccordion();
  updateCopyrightYear(); // Call this immediately on load
});

async function loadPartials() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  // Only proceed if placeholders exist
  if (!headerPlaceholder || !footerPlaceholder) return;

  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('partials/header.html'),
      fetch('partials/footer.html'),
    ]);

    const headerHtml = await headerRes.text();
    const footerHtml = await footerRes.text();

    headerPlaceholder.innerHTML = headerHtml;
    footerPlaceholder.innerHTML = footerHtml;
  } catch (error) {
    console.error('Error loading partials:', error);
  }
}

function initializeAccordion() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.addEventListener('click', (event) => {
    const button = event.target.closest('.accordion-button');
    if (button) {
      const content = button.nextElementSibling;
      const icon = button.querySelector('.accordion-icon');

      button.classList.toggle('active');
      icon.classList.toggle('rotate-180');

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }
  });
}

function updateCopyrightYear() {
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
}
