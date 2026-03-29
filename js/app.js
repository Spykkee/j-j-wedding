import { suits } from './data.js';
import { T } from './translations.js';

let currentLang = 'en';
let selectedHim = 0;
let selectedHer = 0;
let selectedPieceTab = 'him';

const t = () => T[currentLang];

// ---------------------------------------------------------------------------
// SVG builders
// ---------------------------------------------------------------------------

function buildSVG(s) {
  return `<svg viewBox="0 0 120 200" width="120" height="200" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="28" rx="18" ry="20" fill="#D4A98A"/>
    <rect x="30" y="48" width="60" height="90" rx="8" fill="${s.suitColor}"/>
    <rect x="50" y="48" width="20" height="75" fill="${s.shirtColor}" opacity=".9"/>
    <polygon points="50,48 60,70 50,90" fill="${s.suitColor}"/>
    <polygon points="70,48 60,70 70,90" fill="${s.suitColor}"/>
    <rect x="56" y="54" width="8" height="48" rx="2" fill="${s.tieColor}"/>
    <rect x="56" y="54" width="8" height="6" rx="1" fill="${s.tieColor}" opacity=".7"/>
    <circle cx="42" cy="64" r="5" fill="${s.squareColor}" opacity=".85"/>
    <circle cx="78" cy="64" r="4" fill="${s.boutColor}" opacity=".8"/>
    <rect x="18" y="48" width="14" height="72" rx="5" fill="${s.suitColor}"/>
    <rect x="88" y="48" width="14" height="72" rx="5" fill="${s.suitColor}"/>
    <rect x="38" y="136" width="20" height="50" rx="4" fill="#555"/>
    <rect x="62" y="136" width="20" height="50" rx="4" fill="#555"/>
    <rect x="37" y="175" width="22" height="12" rx="3" fill="${s.shoeColor}"/>
    <rect x="61" y="175" width="22" height="12" rx="3" fill="${s.shoeColor}"/>
  </svg>`;
}

function buildSVGWoman(s) {
  return `<svg viewBox="0 0 120 200" width="120" height="200" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="28" rx="18" ry="20" fill="#D4A98A"/>
    <rect x="55" y="47" width="10" height="12" rx="3" fill="#D4A98A"/>
    <rect x="22" y="57" width="16" height="52" rx="6" fill="${s.wDressColor}"/>
    <rect x="82" y="57" width="16" height="52" rx="6" fill="${s.wDressColor}"/>
    <rect x="38" y="57" width="44" height="46" rx="4" fill="${s.wDressColor}"/>
    <polygon points="51,57 69,57 60,80" fill="${s.wAccentColor}" opacity=".30"/>
    <rect x="36" y="100" width="48" height="7" rx="2" fill="${s.wAccentColor}" opacity=".65"/>
    <polygon points="36,107 84,107 98,183 22,183" fill="${s.wDressColor}"/>
    <circle cx="40" cy="39" r="3.5" fill="${s.wAccentColor}" opacity=".9"/>
    <circle cx="80" cy="39" r="3.5" fill="${s.wAccentColor}" opacity=".9"/>
    <circle cx="73" cy="63" r="5" fill="${s.wAccentColor}" opacity=".80"/>
    <rect x="8" y="107" width="8" height="7" rx="3" fill="${s.wBagColor}" opacity=".85"/>
    <rect x="3" y="113" width="18" height="20" rx="4" fill="${s.wBagColor}" opacity=".9"/>
    <ellipse cx="46" cy="189" rx="14" ry="7" fill="${s.wShoeColor}"/>
    <ellipse cx="74" cy="189" rx="14" ry="7" fill="${s.wShoeColor}"/>
  </svg>`;
}

// ---------------------------------------------------------------------------
// Colour dot builders
// ---------------------------------------------------------------------------

function buildDots(s) {
  const cols = [s.suitColor, s.shirtColor, s.tieColor, s.squareColor, s.shoeColor];
  return (
    '<div class="dots-group">' +
    '<div class="dots-who">' + t().him + '</div>' +
    '<div class="colour-dots">' +
    cols.map((c, i) =>
      `<div class="cdot-wrap"><div class="cdot" style="background:${c}"></div><span class="cdot-label">${t().dotLabels[i]}</span></div>`
    ).join('') +
    '</div></div>'
  );
}

function buildDotsWoman(s) {
  const cols = [s.wDressColor, s.wAccentColor, s.wBagColor, s.wShoeColor];
  return (
    '<div class="dots-group">' +
    '<div class="dots-who">' + t().her + '</div>' +
    '<div class="colour-dots">' +
    cols.map((c, i) =>
      `<div class="cdot-wrap"><div class="cdot" style="background:${c}"></div><span class="cdot-label">${t().wDotLabels[i]}</span></div>`
    ).join('') +
    '</div></div>'
  );
}

// ---------------------------------------------------------------------------
// Card HTML builder
// ---------------------------------------------------------------------------

function buildCardHtml(himIdx, herIdx) {
  const him = suits[himIdx];
  const her = suits[herIdx];
  const himT = t().suits[himIdx];
  const herT = t().suits[herIdx];
  const mixed = himIdx !== herIdx;

  const pieces = himT.pieces.map((p, i) =>
    `<div class="piece-card">
      <div class="piece-swatch" style="background:${him.pieceColors[i]}"></div>
      <div class="piece-text">
        <div class="piece-name">${p.name}</div>
        <div class="piece-desc">${p.desc}</div>
      </div>
    </div>`
  ).join('');

  const wPieces = herT.wPieces.map((p, i) =>
    `<div class="piece-card">
      <div class="piece-swatch" style="background:${her.wPieceColors[i]}"></div>
      <div class="piece-text">
        <div class="piece-name">${p.name}</div>
        <div class="piece-desc">${p.desc}</div>
      </div>
    </div>`
  ).join('');

  const badge = mixed
    ? `<span class="badge ${suits[himIdx].badgeClass}">${himT.badge}</span><span class="badge ${suits[herIdx].badgeClass}" style="margin-left:4px">${herT.badge}</span>`
    : `<span class="badge ${suits[himIdx].badgeClass}">${himT.badge}</span>`;

  const heroName = mixed ? `${himT.badge} × ${herT.badge}` : himT.name;
  const heroTagline = mixed ? t().mixedTagline : himT.tagline;
  const verdict = mixed
    ? ''
    : `<div class="verdict">
        <div class="verdict-title">${t().ourTake}</div>
        <div class="verdict-text">${himT.verdict}</div>
      </div>`;

  return `${badge}
    <div class="outfit-hero">
      <div class="fig-wrap">
        <div class="avatar-col">${buildSVG(him)}<div class="avatar-label">${t().him}</div></div>
        <div class="avatar-col">${buildSVGWoman(her)}<div class="avatar-label">${t().her}</div></div>
      </div>
      <div class="hero-text">
        <div class="hero-name">${heroName}</div>
        <div class="hero-tagline">${heroTagline}</div>
        ${buildDots(him)}${buildDotsWoman(her)}
      </div>
    </div>
    <div class="pieces-header">
      <div class="pieces-title">${t().pieceByPiece}</div>
      <div class="ptabs">
        <button class="ptab active" data-target="him">${t().him}</button>
        <button class="ptab" data-target="her">${t().her}</button>
      </div>
    </div>
    <div class="piece-list him-pieces">${pieces}</div>
    <div class="piece-list her-pieces hidden">${wPieces}</div>
    ${verdict}`;
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderCard() {
  document.getElementById('suit-card').innerHTML = buildCardHtml(selectedHim, selectedHer);

  if (selectedPieceTab === 'her') {
    const card = document.getElementById('suit-card');
    card.querySelectorAll('.ptab').forEach(btn => btn.classList.remove('active'));
    card.querySelector('[data-target="her"]').classList.add('active');
    card.querySelector('.him-pieces').classList.add('hidden');
    card.querySelector('.her-pieces').classList.remove('hidden');
  }
}

// ---------------------------------------------------------------------------
// Language
// ---------------------------------------------------------------------------

function updateStaticText() {
  document.getElementById('page-title').textContent = t().title;
  document.getElementById('page-sub').textContent = t().sub;
  document.getElementById('him-row-label').textContent = t().him;
  document.getElementById('her-row-label').textContent = t().her;
  document.querySelectorAll('#him-tabs .tab').forEach((btn, i) => {
    btn.querySelector('.tab-text').textContent = t().suits[i].badge;
  });
  document.querySelectorAll('#her-tabs .tab').forEach((btn, i) => {
    btn.querySelector('.tab-text').textContent = t().suits[i].badge;
  });
}

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.lang === lang)
  );
  updateStaticText();
  renderCard();
}

// ---------------------------------------------------------------------------
// Tab styling helpers
// ---------------------------------------------------------------------------

function activateTabBtn(btn) {
  const swatch = btn.querySelector('.tab-swatch');
  const color = swatch ? swatch.style.background : '#722F37';
  btn.style.borderColor = color;
  btn.style.borderWidth = '1.5px';
  btn.style.color = color;
}

function deactivateTabBtn(btn) {
  btn.style.borderColor = '';
  btn.style.borderWidth = '';
  btn.style.color = '';
}

// ---------------------------------------------------------------------------
// Init + event listeners
// ---------------------------------------------------------------------------

document.querySelectorAll('.tab.active').forEach(activateTabBtn);
updateStaticText();
renderCard();

document.getElementById('lang-switch').addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  setLanguage(btn.dataset.lang);
});

document.getElementById('him-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('#him-tabs .tab').forEach(b => { b.classList.remove('active'); deactivateTabBtn(b); });
  btn.classList.add('active');
  activateTabBtn(btn);
  selectedHim = parseInt(btn.dataset.him);
  renderCard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('her-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('#her-tabs .tab').forEach(b => { b.classList.remove('active'); deactivateTabBtn(b); });
  btn.classList.add('active');
  activateTabBtn(btn);
  selectedHer = parseInt(btn.dataset.her);
  renderCard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('suits').addEventListener('click', e => {
  const btn = e.target.closest('.ptab');
  if (!btn) return;
  const card = btn.closest('.outfit-wrap');
  card.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const target = btn.dataset.target;
  selectedPieceTab = target;
  card.querySelector('.him-pieces').classList.toggle('hidden', target !== 'him');
  card.querySelector('.her-pieces').classList.toggle('hidden', target !== 'her');
});
