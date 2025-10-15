document.addEventListener('DOMContentLoaded', () => {
  loadPartials();
  initializeAccordion();
  // We remove updateCopyrightYear() from here to prevent the race condition
});

async function loadPartials() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

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

    initializeMobileMenu();
    updateCopyrightYear();
  } catch (error) {
    console.error('Error loading partials:', error);
  }
}

function initializeMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        mobileMenu.classList.add('hidden');
      }
    });
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
