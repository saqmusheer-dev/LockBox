const app = document.getElementById('app');

const pages = ['welcome','home','create','capture','customize','unlock','share','locked','recipient','reveal','profile'];
const state = {
  page: 'welcome',
  type: 'mixed',
  vibe: 'midnight',
  title: '',
  days: 7,
  unlockAt: Date.now() + 7 * 86400000,
  peek: false,
  reaction: '',
  mediaAdded: false
};

const pageIndex = () => Math.max(0, pages.indexOf(state.page));
const setPage = (name, animate = true) => {
  if (!pages.includes(name)) return;
  state.page = name;
  state.peek = false;
  render(animate);
};

function countdown(target = state.unlockAt) {
  const total = Math.max(0, target - Date.now());
  const d = Math.floor(total / 86400000);
  const h = Math.floor(total / 3600000) % 24;
  const m = Math.floor(total / 60000) % 60;
  const s = Math.floor(total / 1000) % 60;
  return { d, h, m, s };
}
function clock(target = state.unlockAt) {
  const x = countdown(target);
  return `${String(x.d).padStart(2,'0')} : ${String(x.h).padStart(2,'0')} : ${String(x.m).padStart(2,'0')}`;
}
function fullClock(target = state.unlockAt) {
  const x = countdown(target);
  return `${String(x.d).padStart(2,'0')} : ${String(x.h).padStart(2,'0')} : ${String(x.m).padStart(2,'0')} : ${String(x.s).padStart(2,'0')}`;
}

const backButton = () => `<button class="round-btn" data-go="prev" aria-label="Previous page">‹</button>`;
const settingsButton = () => `<button class="round-btn" data-action="toast" aria-label="Settings">⚙</button>`;
const dots = () => `<div class="page-dots">${pages.map((p,i)=>`<span class="dot ${i===pageIndex()?'active':''}"></span>`).join('')}</div>`;
const swipeHint = (text='Swipe to explore') => `<div class="swipe-hint"><span>‹</span>${text}<span>›</span></div>`;

function shell(content, opts={}) {
  return `<section class="screen page ${opts.className||''}" data-page="${state.page}">
    ${opts.top ? `<header class="topbar">${opts.back===false?'<span></span>':backButton()}<b class="brand-small">${opts.top}</b>${opts.right||settingsButton()}</header>` : ''}
    <div class="page-content">${content}</div>
    ${opts.nav ? nav(opts.nav) : ''}
    ${dots()}
  </section>`;
}

function nav(active) {
  return `<nav class="bottom-nav">
    <button class="nav-item ${active==='home'?'active':''}" data-go="home"><span>⌂</span><small>Home</small></button>
    <button class="nav-add" data-go="create">+</button>
    <button class="nav-item ${active==='profile'?'active':''}" data-go="profile"><span>◉</span><small>Profile</small></button>
  </nav>`;
}

function welcome() {
  return shell(`<div class="welcome-card">
    <div class="sparkle s1">✦</div><div class="sparkle s2">✦</div><div class="sparkle s3">✧</div>
    <div class="brand-lockbox">🔐</div><div class="logo-word">LockBox</div>
    <p class="tagline">You can't open it. Yet.</p>
    <div class="hero-box"><div class="box-glow"></div><div class="digital-box"><span>♥</span></div></div>
    <button class="primary-btn" data-go="home">Get Started <span>→</span></button>
    <p class="micro-copy">Some things are worth waiting for.</p>
    ${swipeHint('Swipe or tap to begin')}
  </div>`, {className:'welcome-screen', back:false});
}

function home() {
  return shell(`<div class="greeting"><div class="avatar">👩🏻</div><div><div class="eyebrow">Good evening,</div><h1 class="h1">Sabah 👋</h1></div></div>
    <section class="feature-card">
      <div class="feature-top"><span class="pill">WAITING FOR YOU</span><span>✦</span></div>
      <div class="feature-lock">🔐</div><div class="feature-label">Your next unlock</div>
      <div class="countdown" id="homeTimer">${clock()}</div><div class="countdown-label">DAYS&nbsp;&nbsp; HOURS&nbsp;&nbsp; MINUTES</div>
      <div class="feature-label">Something special is waiting...</div>
    </section>
    <button class="primary-btn create-btn" data-go="create">＋ Create a LockBox <span>→</span></button>
    <div class="section-head"><h2>Your LockBoxes</h2><button data-action="toast">See all</button></div>
    <div class="box-list">
      <article class="mini-box pink"><div class="mini-icon">💗</div><div><div class="mini-name">Sarah</div><div class="mini-time">Opens in 3 days</div></div></article>
      <article class="mini-box blue"><div class="mini-icon">🌅</div><div><div class="mini-name">Ahmed</div><div class="mini-time">Opens tomorrow</div></div></article>
      <article class="mini-box purple"><div class="mini-icon">🌌</div><div><div class="mini-name">Future Me</div><div class="mini-time">Jan 1, 2027</div></div></article>
    </div>
    <div class="section-head recent-head"><h2>What happens next?</h2></div>
    <div class="story-strip"><span>1</span> Lock something <b>→</b><span>2</span> Share it <b>→</b><span>3</span> Wait ✨</div>`, {top:'LockBox', nav:'home'});
}

function create() {
  return shell(`<div class="eyebrow">STEP 1 OF 3</div><h1 class="h1 big-heading">What do you want<br>to lock?</h1>
    <p class="subtext">Pick the feeling. The mystery comes later.</p>
    <div class="choice-grid">
      ${choice('💬','Message','Write something for later','message')}
      ${choice('🖼️','Photo','A memory for later','photo')}
      ${choice('🎙️','Voice Note','Say it, don’t send it','voice')}
      ${choice('🎥','Video','Future you can watch','video')}
      ${choice('🗂️','Mixed Media','Add photos, words & audio','mixed',true)}
    </div>
    <div class="tiny-note">🔒 Your content stays hidden until the unlock moment.</div>`, {top:'Create a LockBox'});
}
function choice(icon,title,sub,type,wide=false) {
  return `<button class="choice-card ${wide?'wide':''}" data-type="${type}" data-action="capture"><span class="choice-icon">${icon}</span><span><b class="choice-title">${title}</b><small class="choice-sub">${sub}</small></span><i>›</i></button>`;
}

function capture() {
  const isText = state.type === 'message';
  const icon = {photo:'📸',voice:'🎙️',video:'🎥',mixed:'🗂️'}[state.type] || '📸';
  return shell(`<div class="eyebrow">YOUR MEMORY</div><h1 class="h1 big-heading">Add something<br>worth waiting for.</h1>
    ${isText ? `<textarea class="memo" id="memo" placeholder="Write something you don't want to send yet... ✍️"></textarea>` : `<div class="capture-card"><div class="capture-glow"></div><div class="capture-icon">${icon}</div><b>${state.type==='mixed'?'Build your little memory box':`Add your ${state.type}`}</b><small>Nothing is shared yet.</small><button class="capture-action" data-action="media">${state.mediaAdded?'✓ Added':'＋ Add'}</button></div>`}
    ${state.type==='mixed'?'<div class="media-row"><button data-action="media">📷 Photo</button><button data-action="media">🎙️ Voice</button><button data-action="media">📝 Note</button></div>':''}
    <button class="primary-btn" data-go="customize">Continue <span>→</span></button>`, {top:'Add your memory'});
}

function customize() {
  const vibes=['midnight','dreamy','soft','neon','birthday','spooky','love','nature','minimal'];
  return shell(`<div class="eyebrow">STEP 2 OF 3</div><h1 class="h1 big-heading">Make it yours ✨</h1><p class="subtext">Choose a vibe they’ll feel before they open it.</p>
    <div class="theme-grid">${vibes.map(v=>`<button class="theme ${v} ${state.vibe===v?'selected':''}" data-vibe="${v}">${v[0].toUpperCase()+v.slice(1)}${state.vibe===v?'<span>✓</span>':''}</button>`).join('')}</div>
    <div class="field"><label>ADD A TITLE <span>OPTIONAL</span></label><input class="input" id="title" placeholder="A message for later..." value="${state.title}"></div>
    <div class="mystery-toggle"><div><b>Mystery Mode</b><small>Hide the content type from the recipient</small></div><button class="toggle on" data-action="toggleMystery"><span></span></button></div>
    <button class="primary-btn" data-go="unlock">Continue <span>→</span></button>`, {top:'Customize your LockBox'});
}

function unlock() {
  return shell(`<div class="eyebrow">STEP 3 OF 3</div><h1 class="h1 big-heading">Choose the<br>moment.</h1><p class="subtext">The waiting is part of the magic.</p>
    <div class="unlock-options">
      ${unlockOption('📅','Specific Date','Choose a date & time','10')}
      ${unlockOption('⏱️','Countdown','7 days from now','7')}
      ${unlockOption('🎂','Birthday','A special day','30')}
      ${unlockOption('👥','Mutual Lock','Everyone contributes before reveal','7')}
    </div>
    <div class="mutual-card"><span>👥</span><div><b>Mutual Lock</b><small>Both sides stay hidden. Both unlock together.</small></div><i>✨</i></div>`, {top:'When should it unlock?'});
}
function unlockOption(icon,title,sub,days) {
  return `<button class="unlock-option" data-days="${days}" data-action="setUnlock"><span>${icon}</span><div><b>${title}</b><small>${sub}</small></div><i>›</i></button>`;
}

function share() {
  return shell(`<div class="eyebrow">LOCKBOX READY ✨</div><h1 class="h1 big-heading">Share it<br>with them 💌</h1><p class="subtext">Don’t spoil the surprise. Let them wonder.</p>
    <div class="share-preview"><span class="share-badge">LOCKED FOR YOU</span><div class="share-lock">🔐</div><h2>Someone locked<br>something for you.</h2><div class="share-count">${clock()}</div><p>Can you wait? 👀</p><div class="share-brand">LOCKBOX</div></div>
    <div class="share-actions"><button data-action="share">◎<small>Instagram Story</small></button><button data-action="share">◉<small>WhatsApp</small></button><button data-action="copy">🔗<small>Copy Link</small></button><button data-action="share">•••<small>More</small></button></div>
    <button class="secondary-btn" data-go="locked">View Locked Box</button>`, {top:'Share your LockBox'});
}

function locked() {
  return shell(`<section class="locked-card"><span class="orbit o1">✦</span><span class="orbit o2">✧</span><div class="big-lock">🔐</div><div class="locked-title">LOCKED</div><div class="locked-count" id="lockedTimer">${fullClock()}</div><div class="locked-sub">DAYS &nbsp; HOURS &nbsp; MINUTES &nbsp; SECONDS</div><p class="locked-message">You know you want to look...</p><button class="peek-btn" data-action="peek">👀 Try to Peek</button>${state.peek?`<div class="peek-overlay"><strong>Nice try. 😈</strong><p>You can’t open it yet.</p><button data-action="closePeek">Okay, I’ll wait 😅</button></div>`:''}<div class="locked-status"><span>✓</span> Your side is locked <span>•</span> Waiting for the moment</div></section>`, {top:'Your LockBox',nav:'home'});
}

function recipient() {
  return shell(`<div class="recipient-card"><div class="recipient-brand">🔐 <b>LockBox</b></div><div class="recipient-avatar">💌</div><div class="eyebrow">YOU HAVE A LOCKBOX</div><h1 class="recipient-title">Someone left<br>something for you.</h1><div class="recipient-lock">🔒</div><div class="public-count">${clock()}</div><p>Can you wait? 👀</p><button class="primary-btn" data-go="capture">Enter the Box <span>→</span></button><p class="no-app">No app required • Browser friendly</p></div>`, {top:false,back:false});
}

function reveal() {
  return shell(`<section class="reveal-card"><div class="confetti">🎉 ✨ 💗</div><div class="eyebrow">THE WAIT IS OVER</div><h1>UNLOCKED!</h1><p class="reveal-sub">You made it. Now open the moment.</p><div class="memory"><div class="memory-top"><span>💗</span><small>${state.title || 'A memory for later'}</small></div><div class="memory-body">Some things feel better<br>when you have to wait for them. ✨</div><div class="memory-footer">LOCKED WITH LOVE</div></div><div class="reaction-title">How did it make you feel?</div><div class="reactions">${['🥹','😍','😂','😳','💗'].map(r=>`<button class="reaction ${state.reaction===r?'picked':''}" data-reaction="${r}">${r}</button>`).join('')}</div><button class="primary-btn" data-go="profile">Create one back <span>→</span></button></section>`, {top:'The Reveal'});
}

function profile() {
  return shell(`<section class="profile-head"><div class="avatar large">👩🏻</div><div class="profile-name">Sabah</div><div class="eyebrow">Making memories that have to wait.</div><div class="stats"><div><strong>12</strong><span>LockBoxes</span></div><div><strong>8</strong><span>Unlocked</span></div><div><strong>4</strong><span>Waiting</span></div></div></section><div class="tabs"><button class="active">My LockBoxes</button><button>Memories</button></div><div class="history">${[['💗','Sarah','Opens in 3 days'],['🌅','Ahmed','Opens tomorrow'],['🌌','Future Me','Jan 1, 2027'],['🎂','Birthday Box','Locked']].map(x=>`<div class="history-row"><div class="history-thumb">${x[0]}</div><div><b>${x[1]}</b><span>${x[2]}</span></div><i>›</i></div>`).join('')}</div><button class="primary-btn" data-go="create">＋ Create another</button>`, {top:'Your Profile',nav:'profile'});
}

function render(animate=true) {
  const views = {welcome,home,create,capture,customize,unlock,share,locked,recipient,reveal,profile};
  app.innerHTML = views[state.page]();
  const page = app.querySelector('.page');
  if (animate) { page.classList.add('enter'); setTimeout(()=>page.classList.remove('enter'),360); }
  bindInputs();
}

function bindInputs() {
  const title = document.getElementById('title');
  if (title) title.addEventListener('input', e => state.title = e.target.value);
  const memo = document.getElementById('memo');
  if (memo) memo.addEventListener('input', e => state.title = e.target.value.slice(0,45));
}

function goRelative(dir) {
  const next = pageIndex() + dir;
  if (next < 0 || next >= pages.length) return;
  setPage(pages[next]);
}

let startX=0,startY=0,tracking=false;
app.addEventListener('touchstart', e=>{ if(e.touches.length!==1)return; startX=e.touches[0].clientX; startY=e.touches[0].clientY; tracking=true; }, {passive:true});
app.addEventListener('touchend', e=>{
  if(!tracking)return; tracking=false;
  const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.25) goRelative(dx<0?1:-1);
}, {passive:true});

app.addEventListener('click', e=>{
  const go=e.target.closest('[data-go]');
  const action=e.target.closest('[data-action]');
  const vibe=e.target.closest('[data-vibe]');
  const type=e.target.closest('[data-type]');
  const days=e.target.closest('[data-days]');
  const reaction=e.target.closest('[data-reaction]');

  if(go){
    const dest=go.dataset.go;
    if(dest==='prev') goRelative(-1); else if(dest==='next') goRelative(1); else setPage(dest);
    return;
  }
  if(type){ state.type=type.dataset.type; setPage('capture'); return; }
  if(vibe){ state.vibe=vibe.dataset.vibe; render(false); return; }
  if(days){ state.days=Number(days.dataset.days); state.unlockAt=Date.now()+state.days*86400000; setPage('share'); return; }
  if(reaction){ state.reaction=reaction.dataset.reaction; render(false); return; }
  if(action){
    const a=action.dataset.action;
    if(a==='capture') setPage('capture');
    if(a==='setUnlock') { state.unlockAt=Date.now()+Number(action.closest('[data-days]')?.dataset.days||7)*86400000; setPage('share'); }
    if(a==='media') { state.mediaAdded=true; render(false); }
    if(a==='peek') { state.peek=true; render(false); }
    if(a==='closePeek') { state.peek=false; render(false); }
    if(a==='toggleMystery') action.classList.toggle('on');
    if(a==='copy'){ navigator.clipboard?.writeText(location.href); toast('Link copied 🔗'); }
    if(a==='share'){ if(navigator.share) navigator.share({title:'LockBox',text:'I locked something for you. 👀',url:location.href}).catch(()=>{}); else toast('Share options ready ✨'); }
    if(a==='toast') toast('Coming soon ✨');
  }
});

function toast(text){
  let t=document.querySelector('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent=text; t.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('show'),1700);
}

setInterval(()=>{
  const a=document.getElementById('homeTimer'); if(a)a.textContent=clock();
  const b=document.getElementById('lockedTimer'); if(b)b.textContent=fullClock();
  const c=document.querySelector('.share-count'); if(c)c.textContent=clock();
  const d=document.querySelector('.public-count'); if(d)d.textContent=clock();
},1000);

render(false);
