document.addEventListener('DOMContentLoaded', function () {

  // ── Scroll Animations (Intersection Observer) ──
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(function (el, i) {
      var parent = el.parentElement;
      if (parent && (parent.classList.contains('project-grid') ||
                     parent.classList.contains('cert-grid') ||
                     parent.classList.contains('timeline'))) {
        el.dataset.delay = i * 100;
      }
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Sticky Nav ──
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  }

  // ── Mobile Menu ──
  var hamburger = document.getElementById('navHamburger');
  var overlay = document.getElementById('navOverlay');
  var mobileMenu = document.getElementById('navMobile');
  var closeBtn = document.getElementById('navClose');

  function openMenu() {
    if (overlay) overlay.classList.add('open');
    if (mobileMenu) mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (overlay) overlay.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ── Certificate Lightbox ──
  var certModal    = document.getElementById('certModal');
  var certModalImg = document.getElementById('certModalImg');
  var certClose    = document.getElementById('certModalClose');
  var certBackdrop = document.getElementById('certModalBackdrop');

  function openCertModal(src, label) {
    certModalImg.src = src;
    certModalImg.alt = label;
    certModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    certModal.classList.remove('is-open');
    certModalImg.src = '';
    document.body.style.overflow = '';
  }

  if (certModal) {
    document.querySelectorAll('.cert-card--has-image').forEach(function (card) {
      card.addEventListener('click', function () {
        openCertModal(card.dataset.certSrc, card.dataset.certLabel);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCertModal(card.dataset.certSrc, card.dataset.certLabel);
        }
      });
    });

    if (certClose)    certClose.addEventListener('click', closeCertModal);
    if (certBackdrop) certBackdrop.addEventListener('click', closeCertModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && certModal.classList.contains('is-open')) {
        closeCertModal();
      }
    });

    // Block right-click on all certificate images (thumbnails + modal)
    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest('.cert-card__preview') ||
          e.target.closest('.cert-modal__container')) {
        e.preventDefault();
      }
    });
  }

  // ── Portfolio Filter (only on portfolio page) ──
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        projectCards.forEach(function (card) {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            card.style.display = '';
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});
