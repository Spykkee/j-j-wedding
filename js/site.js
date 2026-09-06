/* ---------------------------------------------------------------------------
   Shared site chrome: language state + translation for the nav bar and every
   page's static text. Plain (non-module) script so it can run on every page,
   before the page's own inline or module scripts.

   Markup hooks:
     [data-i18n]        -> element.textContent
     [data-i18n-html]   -> element.innerHTML (for copy containing <strong>, etc.)
     [data-i18n-aria]   -> element aria-label
     .lang-section-content[data-lang]  -> toggled .visible (checklist / action pages)
     .lang-btn[data-lang]              -> language switch buttons (in the nav)

   Language choice persists in localStorage and is shared across all pages.
   On every change a `jj:langchange` event fires on document so page scripts
   (e.g. the colour-coding card renderer) can re-render.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var STORAGE_KEY = 'jj-lang';
  var DEFAULT_LANG = 'en';
  var LANGS = ['en', 'fr', 'ko'];

  var STR = {
    en: {
      /* nav */
      'nav.home': 'Home',
      'nav.colors': 'Color coding',
      'nav.checklist': 'Guest checklist',
      'nav.train': 'Group train',
      'nav.honeymoon': 'Honeymoon',
      'nav.whatsapp': 'WhatsApp',
      'nav.lang': 'Language',
      /* document titles */
      'doc.home': 'J&J Wedding — 10·10·2026',
      'doc.colors': 'J&J Wedding Outfit Cards — 10·10·2026',
      'doc.checklist': 'J&J Wedding — Guest Checklist',
      'doc.train': 'J&J Wedding — Group Train',
      'doc.honeymoon': 'J&J Wedding — Honeymoon Fund',
      'doc.whatsapp': 'J&J Wedding — WhatsApp Community',
      /* shared */
      'sub.date': '10 · 10 · 2026  ·  Provence Autumn Wedding',
      /* homepage hero + countdown */
      'home.h1': 'J & J are getting married',
      'cd.title': 'Counting down to the celebration',
      'cd.days': 'Days',
      'cd.hours': 'Hours',
      'cd.mins': 'Minutes',
      'cd.secs': 'Seconds',
      'cd.foot': 'until we celebrate in Provence',
      'cd.done': 'The weekend is here ✦',
      /* homepage — before the wedding */
      'home.before': 'Before the wedding',
      'home.wa.title': 'WhatsApp Community',
      'home.wa.desc': 'Not in our WhatsApp Community yet? <strong>Now is the time to join.</strong> All future communications will be shared there.',
      'home.wa.link': 'Join the WhatsApp Community',
      'home.cl.title': 'Guest checklist',
      'home.cl.desc': 'Everything to know for the wedding weekend — travel, schedule, and what to bring for Friday’s welcome dinner, Saturday’s ceremony, and Sunday’s brunch.',
      'home.cl.link': 'Explore the guest checklist',
      'home.tr.title': 'Group train',
      'home.tr.desc': 'Booked a seat on our group TGV between Paris Gare de Lyon and Avignon? Look up your coach and seat for both the Friday and Sunday journeys.',
      'home.tr.link': 'Find your seat',
      'home.cc.title': 'Color coding',
      'home.cc.desc': 'Outfit inspiration for the day. Browse the four palettes and see how they work for both gentlemen and ladies.',
      'home.cc.link': 'Explore the color coding',
      'home.hm.title': 'Honeymoon Fund',
      'home.hm.desc': 'We don’t have a wedding registry. If you’d like to contribute to our honeymoon, you can do so here. There will also be a little box on the day if you’d rather drop off a card or envelope in person.',
      'home.hm.link': 'Contribute to our honeymoon',
      'home.other.title': 'Other questions?',
      'home.other.desc': 'Check our wedding website for anything else you might be looking for.',
      'home.other.link': 'Visit our wedding website',
      /* homepage — location + footer */
      'home.loc.title': 'Location',
      'home.loc.town': 'Rochefort-du-Gard, Provence',
      'home.map.link': 'Open in Google Maps',
      'home.foot': 'See you in Provence · J & J',
      /* checklist page */
      'page.cl.h1': 'Guest Checklist',
      'page.cl.sub': 'A few important things to remember for the wedding weekend',
      /* action pages */
      'page.hm.h1': 'Honeymoon Fund',
      'page.wa.h1': 'WhatsApp Community'
    },

    fr: {
      'nav.home': 'Accueil',
      'nav.colors': 'Code couleur',
      'nav.checklist': 'Check-list invités',
      'nav.train': 'Train de groupe',
      'nav.honeymoon': 'Lune de miel',
      'nav.whatsapp': 'WhatsApp',
      'nav.lang': 'Langue',
      'doc.home': 'Mariage J&J — 10·10·2026',
      'doc.colors': 'Tenues de mariage J&J — 10·10·2026',
      'doc.checklist': 'Mariage J&J — Check-list invités',
      'doc.train': 'Mariage J&J — Train de groupe',
      'doc.honeymoon': 'Mariage J&J — Cagnotte lune de miel',
      'doc.whatsapp': 'Mariage J&J — Communauté WhatsApp',
      'sub.date': '10 · 10 · 2026  ·  Mariage d’automne en Provence',
      'home.h1': 'J & J vont se marier',
      'cd.title': 'Le compte à rebours a commencé',
      'cd.days': 'Jours',
      'cd.hours': 'Heures',
      'cd.mins': 'Minutes',
      'cd.secs': 'Secondes',
      'cd.foot': 'avant de célébrer en Provence',
      'cd.done': 'Le week-end est arrivé ✦',
      'home.before': 'Avant le mariage',
      'home.wa.title': 'Communauté WhatsApp',
      'home.wa.desc': 'Vous n’avez pas encore rejoint notre communauté WhatsApp ? <strong>C’est le moment de la rejoindre.</strong> Toutes les communications à venir y seront partagées.',
      'home.wa.link': 'Rejoindre la communauté WhatsApp',
      'home.cl.title': 'Check-list invités',
      'home.cl.desc': 'Tout ce qu’il faut savoir pour le week-end du mariage — le trajet, le programme et quoi prévoir pour le dîner de bienvenue du vendredi, la cérémonie du samedi et le brunch du dimanche.',
      'home.cl.link': 'Voir la check-list invités',
      'home.tr.title': 'Train de groupe',
      'home.tr.desc': 'Vous avez une place dans notre TGV de groupe entre Paris Gare de Lyon et Avignon ? Retrouvez votre voiture et votre place pour les trajets du vendredi et du dimanche.',
      'home.tr.link': 'Trouver votre place',
      'home.cc.title': 'Code couleur',
      'home.cc.desc': 'De l’inspiration tenue pour le jour J. Parcourez les quatre palettes et voyez comment elles fonctionnent pour messieurs comme pour mesdames.',
      'home.cc.link': 'Voir le code couleur',
      'home.hm.title': 'Cagnotte lune de miel',
      'home.hm.desc': 'Nous n’avons pas de liste de mariage. Si vous souhaitez contribuer à notre lune de miel, c’est possible ici. Le jour J, une petite boîte sera aussi prévue si vous préférez déposer une carte ou une enveloppe en personne.',
      'home.hm.link': 'Contribuer à notre lune de miel',
      'home.other.title': 'D’autres questions ?',
      'home.other.desc': 'Consultez notre site de mariage pour tout ce que vous pourriez chercher d’autre.',
      'home.other.link': 'Voir notre site de mariage',
      'home.loc.title': 'Lieu',
      'home.loc.town': 'Rochefort-du-Gard, Provence',
      'home.map.link': 'Ouvrir dans Google Maps',
      'home.foot': 'Rendez-vous en Provence · J & J',
      'page.cl.h1': 'Check-list invités',
      'page.cl.sub': 'Quelques points importants à retenir pour le week-end du mariage',
      'page.hm.h1': 'Cagnotte lune de miel',
      'page.wa.h1': 'Communauté WhatsApp'
    },

    ko: {
      'nav.home': '홈',
      'nav.colors': '컬러 코드',
      'nav.checklist': '게스트 체크리스트',
      'nav.train': '단체 기차',
      'nav.honeymoon': '신혼여행',
      'nav.whatsapp': 'WhatsApp',
      'nav.lang': '언어',
      'doc.home': 'J&J 결혼식 — 2026·10·10',
      'doc.colors': 'J&J 결혼식 의상 카드 — 2026·10·10',
      'doc.checklist': 'J&J 결혼식 — 게스트 체크리스트',
      'doc.train': 'J&J 결혼식 — 단체 기차',
      'doc.honeymoon': 'J&J 결혼식 — 신혼여행 펀드',
      'doc.whatsapp': 'J&J 결혼식 — WhatsApp 커뮤니티',
      'sub.date': '2026 · 10 · 10  ·  프로방스 가을 결혼식',
      'home.h1': 'J & J, 결혼합니다',
      'cd.title': '축하의 날을 향한 카운트다운',
      'cd.days': '일',
      'cd.hours': '시간',
      'cd.mins': '분',
      'cd.secs': '초',
      'cd.foot': '프로방스에서 함께 축하할 때까지',
      'cd.done': '드디어 그 주말이에요 ✦',
      'home.before': '결혼식 전에',
      'home.wa.title': 'WhatsApp 커뮤니티',
      'home.wa.desc': '아직 저희 WhatsApp 커뮤니티에 참여하지 않으셨나요? <strong>지금이 참여할 때입니다.</strong> 앞으로의 모든 안내는 그곳에서 공유됩니다.',
      'home.wa.link': 'WhatsApp 커뮤니티 참여하기',
      'home.cl.title': '게스트 체크리스트',
      'home.cl.desc': '결혼식 주말에 알아둘 모든 것 — 이동, 일정, 그리고 금요일 웰컴 디너·토요일 예식·일요일 브런치에 무엇을 챙겨야 하는지.',
      'home.cl.link': '게스트 체크리스트 보기',
      'home.tr.title': '단체 기차',
      'home.tr.desc': '파리 리옹역과 아비뇽을 오가는 저희 단체 TGV에 좌석을 예약하셨나요? 금요일과 일요일 여정의 객차와 좌석을 확인해 보세요.',
      'home.tr.link': '좌석 확인하기',
      'home.cc.title': '컬러 코드',
      'home.cc.desc': '결혼식 당일을 위한 의상 아이디어. 네 가지 팔레트를 둘러보고 신사와 숙녀 모두에게 어떻게 어울리는지 확인해 보세요.',
      'home.cc.link': '컬러 코드 보기',
      'home.hm.title': '신혼여행 펀드',
      'home.hm.desc': '저희는 웨딩 레지스트리를 준비하지 않았어요. 저희 신혼여행에 보태고 싶으시다면 여기에서 하실 수 있습니다. 카드나 봉투를 직접 전해주고 싶으시다면 당일 현장에도 작은 상자를 준비해 둘게요.',
      'home.hm.link': '신혼여행에 참여하기',
      'home.other.title': '다른 궁금한 점이 있으신가요?',
      'home.other.desc': '그 밖에 찾으시는 것이 있다면 저희 웨딩 웹사이트를 확인해 주세요.',
      'home.other.link': '웨딩 웹사이트 방문하기',
      'home.loc.title': '장소',
      'home.loc.town': '로슈포르드가르, 프로방스',
      'home.map.link': 'Google 지도에서 열기',
      'home.foot': '프로방스에서 만나요 · J & J',
      'page.cl.h1': '게스트 체크리스트',
      'page.cl.sub': '결혼식 주말을 위해 기억해 두면 좋은 몇 가지 중요한 사항',
      'page.hm.h1': '신혼여행 펀드',
      'page.wa.h1': 'WhatsApp 커뮤니티'
    }
  };

  function getStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return LANGS.indexOf(v) !== -1 ? v : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  var currentLang = getStored();

  function store(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function lookup(key) {
    var d = STR[currentLang] || STR.en;
    if (d[key] != null) return d[key];
    if (STR.en[key] != null) return STR.en[key];
    return null;
  }

  function t(key) {
    var v = lookup(key);
    return v == null ? key : v;
  }

  function apply() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = lookup(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = lookup(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = lookup(el.getAttribute('data-i18n-aria'));
      if (v != null) el.setAttribute('aria-label', v);
    });

    document.querySelectorAll('.lang-section-content').forEach(function (el) {
      el.classList.toggle('visible', el.getAttribute('data-lang') === currentLang);
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
    document.querySelectorAll('[data-lang-code]').forEach(function (el) {
      el.textContent = currentLang.toUpperCase();
    });

    document.dispatchEvent(new CustomEvent('jj:langchange', { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1 || lang === currentLang) return;
    currentLang = lang;
    store(lang);
    apply();
  }

  window.JJI18N = {
    get: function () { return currentLang; },
    set: setLang,
    t: t
  };
  window.t = t;

  function closeLangMenus() {
    document.querySelectorAll('.lang-menu[open]').forEach(function (d) { d.open = false; });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest('.lang-btn');
    if (btn) {
      var lang = btn.getAttribute('data-lang');
      if (lang) setLang(lang);
      closeLangMenus();
      return;
    }
    if (!e.target.closest('.lang-menu')) closeLangMenus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLangMenus();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
