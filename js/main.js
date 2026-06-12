document.addEventListener('DOMContentLoaded', function () {

  // ── Sidebar navigation ──
  var sidebar    = document.getElementById('sidebar');
  var overlay    = document.getElementById('sidebarOverlay');
  var hamburger  = document.getElementById('sidebarHamburger');

  function openSidebar() {
    if (sidebar)  sidebar.classList.add('mobile-open');
    if (overlay)  overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar)  sidebar.classList.remove('mobile-open');
    if (overlay)  overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger)  hamburger.addEventListener('click', openSidebar);
  if (overlay)    overlay.addEventListener('click', closeSidebar);

  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 769) closeSidebar();
      });
    });
  }

  // ── Active nav link on scroll ──
  var navLinks = document.querySelectorAll('.sidebar__nav .nav-link');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').replace('#', '');
    var el = document.getElementById(id);
    if (el) sections.push({ el: el, link: link });
  });

  function updateActiveLink() {
    var scrollY = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= scrollY) current = s;
    });
    navLinks.forEach(function (l) { l.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  if (sections.length) {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // ── Scroll Animations ──
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, Number(delay));
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeEls.forEach(function (el, i) {
      var parent = el.parentElement;
      if (parent && (parent.classList.contains('cert-grid') ||
                     parent.classList.contains('education-grid') ||
                     parent.classList.contains('project-scroll'))) {
        el.dataset.delay = i * 80;
      }
      fadeObserver.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Legacy top-nav scroll (project detail pages) ──
  var topNav = document.getElementById('nav');
  if (topNav) {
    window.addEventListener('scroll', function () {
      topNav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Legacy mobile menu (project detail pages) ──
  var hamburgerLegacy = document.getElementById('navHamburger');
  var overlayLegacy   = document.getElementById('navOverlay');
  var mobileMenu      = document.getElementById('navMobile');
  var closeBtn        = document.getElementById('navClose');

  function openLegacyMenu() {
    if (overlayLegacy) overlayLegacy.classList.add('open');
    if (mobileMenu)    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLegacyMenu() {
    if (overlayLegacy) overlayLegacy.classList.remove('open');
    if (mobileMenu)    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerLegacy) hamburgerLegacy.addEventListener('click', openLegacyMenu);
  if (closeBtn)        closeBtn.addEventListener('click', closeLegacyMenu);
  if (overlayLegacy)   overlayLegacy.addEventListener('click', closeLegacyMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeLegacyMenu);
    });
  }

  // ── Portfolio Filter ──
  var filterBtns    = document.querySelectorAll('.filter-btn');
  var projectCards  = document.querySelectorAll('.project-card[data-category]');
  var filterEmpty   = document.getElementById('filterEmpty');

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var visible = 0;
        projectCards.forEach(function (card) {
          if (filter === 'all' || card.dataset.category === filter) {
            visible++;
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            card.style.display = '';
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 40);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(function () { card.style.display = 'none'; }, 280);
          }
        });

        if (filterEmpty) {
          filterEmpty.style.display = visible === 0 ? 'block' : 'none';
        }
      });
    });
  }

  // ── Radar / Spider Chart ──
  var radarCanvas = document.getElementById('skillsRadar');
  if (radarCanvas && typeof Chart !== 'undefined') {
    new Chart(radarCanvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['GIS / Geospatial', 'Data Analysis', 'Visualization', 'Policy Research', 'Languages', 'Diplomacy'],
        datasets: [{
          label: 'Proficiency',
          data: [9, 8, 8, 9, 7, 9],
          backgroundColor: 'rgba(26, 92, 56, 0.12)',
          borderColor: '#1a5c38',
          borderWidth: 1.75,
          pointBackgroundColor: '#1a5c38',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 5,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.raw + ' / 10';
              }
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              display: false,
              stepSize: 2,
            },
            grid: {
              color: '#ddd6c6',
              lineWidth: 1,
            },
            angleLines: {
              color: '#ddd6c6',
            },
            pointLabels: {
              font: { size: 11, family: "'Inter', sans-serif" },
              color: '#5a5446',
            }
          }
        }
      }
    });
  }

  // ── Story Map Timeline ──
  (function initStoryMap() {
    var outer   = document.getElementById(‘storyScrollOuter’);
    var track   = document.getElementById(‘storyTrack’);
    var fillEl  = document.getElementById(‘storyTrailFill’);
    var dotsEl  = document.getElementById(‘storyTrailDots’);
    var counterEl = document.getElementById(‘storyCounter’);

    if (!outer || !track) return;

    var panels   = track.querySelectorAll(‘.story-panel’);
    var numPanels = panels.length;
    var dots     = dotsEl ? dotsEl.querySelectorAll(‘.story-dot’) : [];
    var isMobile = window.innerWidth <= 768;

    function getPanelWidth() {
      var sidebarW = window.innerWidth > 768 ? 240 : 0;
      return window.innerWidth - sidebarW;
    }

    function setContainerHeight() {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        outer.style.height = ‘’;
        return;
      }
      var vh = window.innerHeight;
      outer.style.height = ((numPanels - 1) * 0.75 * vh + vh) + ‘px’;
    }

    setContainerHeight();
    window.addEventListener(‘resize’, setContainerHeight);

    var currentX = 0;
    var targetX  = 0;
    var rafId    = null;
    var activeIdx = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateChrome(idx) {
      var progress = numPanels > 1 ? idx / (numPanels - 1) : 0;
      if (fillEl)    fillEl.style.width = (progress * 100) + ‘%’;
      if (counterEl) counterEl.textContent = idx + 1;
      dots.forEach(function (d, i) {
        d.classList.toggle(‘active’, i === idx);
      });
    }

    function tick() {
      currentX = lerp(currentX, targetX, 0.1);
      if (Math.abs(currentX - targetX) < 0.5) { currentX = targetX; rafId = null; }
      track.style.transform = ‘translateX(‘ + currentX + ‘px)’;

      var pw = getPanelWidth();
      var newIdx = Math.max(0, Math.min(numPanels - 1, Math.round(-currentX / pw)));
      if (newIdx !== activeIdx) {
        activeIdx = newIdx;
        updateChrome(activeIdx);
      }

      if (rafId !== null) requestAnimationFrame(tick);
    }

    function onScroll() {
      if (window.innerWidth <= 768) return;
      var rect = outer.getBoundingClientRect();
      var scrolled = -rect.top;
      var totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;

      var progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      var pw = getPanelWidth();
      targetX = -progress * (numPanels - 1) * pw;

      if (rafId === null) {
        rafId = 1;
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener(‘scroll’, onScroll, { passive: true });

    dots.forEach(function (dot) {
      dot.addEventListener(‘click’, function () {
        var idx = Number(dot.dataset.stop);
        if (window.innerWidth <= 768) return;
        var totalScroll = outer.offsetHeight - window.innerHeight;
        var progress = numPanels > 1 ? idx / (numPanels - 1) : 0;
        var containerTop = outer.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: containerTop + progress * totalScroll, behavior: ‘smooth’ });
      });
    });

    updateChrome(0);
  }());

  // ── Credential Lightbox ──
  var lightbox      = document.getElementById('credLightbox');
  var lightboxInner = document.getElementById('credLightboxInner');
  var lightboxClose = document.getElementById('credLightboxClose');

  function openLightbox(card) {
    var type   = card.dataset.credType;
    var src    = card.dataset.credSrc;
    var name   = card.dataset.credName   || '';
    var org    = card.dataset.credOrg    || '';
    var member = card.dataset.credMember || '';
    var desc   = card.dataset.credDesc   || '';

    // Clear previous content (keep close button)
    while (lightboxInner.children.length > 1) {
      lightboxInner.removeChild(lightboxInner.lastChild);
    }

    if (type === 'image') {
      var img = document.createElement('img');
      img.src = src;
      img.alt = name;
      img.className = 'cred-lightbox__img';
      lightboxInner.appendChild(img);
    } else {
      var view = document.createElement('div');
      view.className = 'cred-lightbox__badge-view';
      view.innerHTML =
        '<img src="' + src + '" alt="' + name + '" class="cred-lightbox__badge-img">' +
        '<h3 class="cred-lightbox__badge-title">' + name + '</h3>' +
        '<p class="cred-lightbox__badge-org">' + org + '</p>' +
        '<p class="cred-lightbox__badge-member">' + member + '</p>' +
        '<div class="cred-lightbox__badge-rule"></div>' +
        '<p class="cred-lightbox__badge-desc">' + desc + '</p>';
      lightboxInner.appendChild(view);
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-card[data-cred-type]').forEach(function (card) {
    card.addEventListener('click', function () { openLightbox(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

});
