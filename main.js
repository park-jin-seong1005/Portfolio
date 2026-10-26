/* =========================================================
   Park JinSeong Portfolio — 공통 스크립트 (바닐라 JS)
========================================================= */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 현재 연도
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // =========================
  // Header: 스크롤 시 배경
  // =========================
  var header = document.getElementById('siteHeader');
  if (header){
    var onScroll = function(){ header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // =========================
  // 모바일 메뉴
  // =========================
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (header && toggle && nav){
    var setMenu = function(open){
      header.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };
    toggle.addEventListener('click', function(){ setMenu(!header.classList.contains('is-open')); });
    nav.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && header.classList.contains('is-open')){ setMenu(false); toggle.focus(); }
    });
    var desktop = window.matchMedia('(min-width: 1081px)');
    var onDesktop = function(m){ if (m.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);
  }

  // =========================
  // 스크롤 등장 효과 (동작 줄이기 설정 시 즉시 표시)
  // =========================
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function(el){ io.observe(el); });
  }

  // =========================
  // 페이지 내 메뉴: 현재 섹션 표시
  // =========================
  var localLinks = document.querySelectorAll('.local-nav a[href^="#"]');
  if (localLinks.length && 'IntersectionObserver' in window){
    var byId = {};
    localLinks.forEach(function(a){ byId[a.getAttribute('href').slice(1)] = a; });
    var setActive = function(id){
      localLinks.forEach(function(a){
        var on = a === byId[id];
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(byId).forEach(function(id){
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // =========================
  // 프로젝트 필터
  // =========================
  var filter = document.querySelector('[data-filter]');
  if (filter){
    var buttons = filter.querySelectorAll('button[data-value]');
    var items = document.querySelectorAll('[data-category]');
    var countEl = document.getElementById('filterCount');
    var apply = function(value){
      var shown = 0;
      items.forEach(function(item){
        var cats = item.getAttribute('data-category').split(' ');
        var match = value === 'all' || cats.indexOf(value) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === value)); });
      if (countEl) countEl.innerHTML = '<b>' + shown + '</b> / ' + items.length + ' PROJECTS';
    };
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ apply(b.getAttribute('data-value')); });
    });
    apply('all');
  }
})();
