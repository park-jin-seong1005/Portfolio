/* =========================================================
   Park JinSeong Portfolio — 공통 스크립트 (바닐라 JS)
   헤더 · 모바일 메뉴 · 스크롤 등장 · 숫자 카운트업 · 캐러셀 · 필터
========================================================= */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.documentElement.classList.add('no-motion');

  // 현재 연도
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // =========================
  // 헤더: 스크롤 시 경계선
  // =========================
  var gnb = document.getElementById('gnb');
  if (gnb){
    var onScroll = function(){ gnb.classList.toggle('is-scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // =========================
  // 모바일 메뉴
  // =========================
  var toggle = document.getElementById('gnbToggle');
  var nav = document.getElementById('gnbNav');
  if (gnb && toggle && nav){
    var setMenu = function(open){
      gnb.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };
    toggle.addEventListener('click', function(){ setMenu(!gnb.classList.contains('is-open')); });
    nav.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && gnb.classList.contains('is-open')){ setMenu(false); toggle.focus(); }
    });
    var desktop = window.matchMedia('(min-width: 961px)');
    var onDesktop = function(m){ if (m.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);
  }

  // =========================
  // 숫자 카운트업
  // =========================
  var countUp = function(el){
    var target = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion || isNaN(target)){ el.textContent = el.getAttribute('data-count'); return; }
    var start = null, dur = 1400;
    var step = function(t){
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // =========================
  // 스크롤 등장 효과
  // =========================
  var reveals = document.querySelectorAll('.reveal, .reveal-scale');
  var counters = document.querySelectorAll('[data-count]');
  if (reduceMotion || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
    document.querySelectorAll('.bars').forEach(function(el){ el.classList.add('is-on'); });
    counters.forEach(function(el){ el.textContent = el.getAttribute('data-count'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        if (el.classList.contains('bars')) el.classList.add('is-on');
        io.unobserve(el);
        // 등장이 끝나면 등장용 클래스를 떼어 호버 효과가 지연 없이 동작하게
        var d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
        setTimeout(function(){ el.classList.remove('reveal', 'reveal-scale', 'is-visible'); }, 1300 + d * 90);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    reveals.forEach(function(el){ io.observe(el); });

    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function(el){ el.textContent = '0'; cio.observe(el); });
  }

  // =========================
  // 가로 캐러셀
  // =========================
  document.querySelectorAll('[data-carousel]').forEach(function(root){
    var track = root.querySelector('.track');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    if (!track || !prev || !next) return;
    var stepSize = function(){
      var first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + 28 : track.clientWidth;
    };
    var update = function(){
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener('click', function(){ track.scrollBy({ left: -stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function(){ track.scrollBy({ left: stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // =========================
  // 프로젝트 필터
  // =========================
  var filter = document.querySelector('[data-filter]');
  if (filter){
    var buttons = filter.querySelectorAll('button[data-value]');
    var items = document.querySelectorAll('[data-category]');
    var countEl = document.getElementById('filterCount');
    var apply = function(value, byUser){
      var shown = 0;
      items.forEach(function(item){
        var cats = item.getAttribute('data-category').split(' ');
        var match = value === 'all' || cats.indexOf(value) !== -1;
        item.hidden = !match;
        if (match){
          shown++;
          if (byUser) item.classList.remove('reveal');   // 필터로 다시 나타난 카드는 바로 표시
        }
      });
      buttons.forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === value)); });
      if (countEl) countEl.innerHTML = '<b>' + shown + '</b>개 프로젝트';
    };
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ apply(b.getAttribute('data-value'), true); });
    });
    apply('all');
  }
})();
