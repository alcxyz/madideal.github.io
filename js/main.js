// --- Google Analytics Logic ---
const GA_MEASUREMENT_ID = 'G-1K7GTVFC96';
const TRACKED_HOSTS = new Set(['madideal.com', 'www.madideal.com']);

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

function extractWhatsAppNumber(href) {
  const waMeMatch = href.match(/wa\.me\/(\d+)/i);
  if (waMeMatch) return waMeMatch[1];

  const apiMatch = href.match(/[?&]phone=(\d+)/i);
  if (apiMatch) return apiMatch[1];

  return '';
}

(function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || !TRACKED_HOSTS.has(window.location.hostname)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
  });
})();

// --- Google Analytics Event Tracking Logic ---
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  const normalizedHref = href.toLowerCase();
  const linkText =
    link.textContent.trim() || link.getAttribute('aria-label') || href;

  let eventName = null;
  const eventParams = {
    link_text: linkText,
    link_url: link.href,
    page_path: window.location.pathname + window.location.search,
  };

  if (normalizedHref.startsWith('tel:')) {
    eventName = 'phone_click';
    eventParams.phone_number = href.replace(/^tel:/i, '').trim();
  } else if (normalizedHref.startsWith('mailto:')) {
    eventName = 'email_click';
  } else if (
    normalizedHref.includes('wa.me/') ||
    normalizedHref.includes('whatsapp')
  ) {
    eventName = 'whatsapp_click';

    const phoneNumber = extractWhatsAppNumber(link.href);
    if (phoneNumber) {
      eventParams.phone_number = phoneNumber;
    }
  } else if (normalizedHref.includes('instagram.com/')) {
    eventName = 'instagram_click';
  } else if (normalizedHref.includes('facebook.com/')) {
    eventName = 'facebook_click';
  } else if (
    normalizedHref.includes('google.com/maps') ||
    normalizedHref.includes('maps.google.') ||
    normalizedHref.includes('maps.app.goo.gl')
  ) {
    eventName = 'map_click';
  }

  if (!eventName) return;

  trackEvent(eventName, eventParams);
});

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
