/* ── Firebase config ────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBCU_Ifqj30M86sPgXWMyVuocHcV2EZlVA",
  authDomain:        "serene-community-hub.firebaseapp.com",
  projectId:         "serene-community-hub",
  storageBucket:     "serene-community-hub.firebasestorage.app",
  messagingSenderId: "653804893254",
  appId:             "1:653804893254:web:73a64b1c286df2df78c647"
};

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(msg, type = 'info', ms = 3500) {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||icons.info}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 300); }, ms);
}

/* ── Helpers ─────────────────────────────────────────────────── */
function timeAgo(date) {
  if (!date) return 'just now';
  const d = date?.toDate ? date.toDate() : new Date(date);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 0)     return 'just now'; // clock-skew / pending serverTimestamp
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
}
function formatDate(ts) {
  if (!ts) return '';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
/** Escape user-generated content before inserting into innerHTML — prevents XSS */
function escHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ── Nav items ───────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href:'2_community_home.html',    icon:'dashboard',    label:'Dashboard'   },
  { href:'4_discussion_thread.html', icon:'forum',        label:'Discussions' },
  { href:'7_directory.html',         icon:'groups',       label:'Directory'   },
  { href:'8_community_chat.html',    icon:'chat',         label:'Messages',   badge:3 },
  { href:'9_shared_media.html',      icon:'perm_media',   label:'Shared Media'},
];

/* ── Sidebar builder ─────────────────────────────────────────── */
function buildSidebar(user) {
  const page = location.pathname.split('/').pop() || '2_community_home.html';
  const navHTML = NAV_ITEMS.map(n => {
    const active = page === n.href;
    return `<a href="${n.href}" class="flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-all duration-200 ${active
      ? 'bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600 rounded-l-md rounded-r-none'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
      <span class="material-symbols-outlined">${n.icon}</span>
      <span class="text-sm font-medium">${n.label}</span>
      ${n.badge ? `<span class="ml-auto bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">${n.badge}</span>` : ''}
    </a>`;
  }).join('');

  const photoEl = user?.photoURL
    ? `<img src="${user.photoURL}" class="w-8 h-8 rounded-full object-cover border border-outline-variant" alt="avatar">`
    : `<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">${getInitials(user?.displayName||'U')}</div>`;

  return `
    <div class="px-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings:'FILL' 1">groups</span>
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Private Circle</h2>
          <p class="text-xs text-slate-500">Verified Members Only</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 px-3 space-y-1">${navHTML}</nav>
    <div class="px-3 border-t border-slate-200 pt-4 space-y-1">
      <a href="5_member_profile.html" class="flex items-center gap-3 px-3 py-3 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-all duration-200">
        <span class="material-symbols-outlined">manage_accounts</span>
        <span class="text-sm font-medium">My Profile</span>
      </a>
      <a href="6_user_profile.html" class="flex items-center gap-3 px-3 py-3 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-all duration-200">
        <span class="material-symbols-outlined">settings</span>
        <span class="text-sm font-medium">Settings</span>
      </a>
      <div id="sidebar-signout" class="flex items-center gap-3 px-3 py-3 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-all duration-200">
        <span class="material-symbols-outlined">logout</span>
        <span class="text-sm font-medium">Sign Out</span>
      </div>
    </div>
    <div class="px-4 py-3 border-t border-slate-200 mt-2">
      <div class="flex items-center gap-3">
        ${photoEl}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-900 truncate">${user?.displayName||'Member'}</p>
          <p class="text-xs text-slate-500 truncate">${user?.email||''}</p>
        </div>
      </div>
    </div>`;
}

/* ── Header builder ──────────────────────────────────────────── */
function buildHeader(user) {
  const photoEl = user?.photoURL
    ? `<img src="${user.photoURL}" class="h-full w-full object-cover" alt="avatar">`
    : `<div class="h-full w-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">${getInitials(user?.displayName||'U')}</div>`;
  return `
    <div class="flex items-center gap-4">
      <span class="text-xl font-bold tracking-tight text-slate-900">CommunityHub</span>
      <div class="hidden md:flex ml-8 items-center bg-surface-container rounded-full px-4 py-2 gap-2 w-64">
        <span class="material-symbols-outlined text-outline text-[20px]">search</span>
        <input class="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Search community..." type="text">
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button aria-label="Notifications" onclick="showToast('Notifications coming soon!','info')" class="hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 duration-150">
        <span class="material-symbols-outlined text-slate-500">notifications</span>
      </button>
      <button aria-label="Help" onclick="showToast('Visit our docs for help','info')" class="hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 duration-150">
        <span class="material-symbols-outlined text-slate-500">help_outline</span>
      </button>
      <a href="5_member_profile.html" aria-label="My profile" class="h-8 w-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer">
        ${photoEl}
      </a>
    </div>`;
}

/* ── Mobile nav builder ──────────────────────────────────────────── */
function buildMobileNav() {
  const page = location.pathname.split('/').pop();
  const items = [
    { href:'2_community_home.html',    icon:'dashboard',  label:'Home'   },
    { href:'4_discussion_thread.html', icon:'forum',      label:'Talk'   },
    { href:'3_create_post.html',       icon:'add_circle', label:'Post'   },
    { href:'7_directory.html',         icon:'groups',     label:'People' },
    { href:'8_community_chat.html',    icon:'chat',       label:'Chat'   },
  ];
  return items.map(i=>`
    <a href="${i.href}" class="flex flex-col items-center gap-1 py-2 px-3 ${page===i.href?'text-blue-600':'text-slate-500'}">
      <span class="material-symbols-outlined text-[24px]" ${page===i.href?"style=\"font-variation-settings:'FILL' 1\"":""}>${i.icon}</span>
      <span class="text-[10px] font-medium">${i.label}</span>
    </a>`).join('');
}

/* ── Init layout ─────────────────────────────────────────────── */
function initLayout(user) {
  const hdr = document.getElementById('app-header');
  if (hdr) hdr.innerHTML = buildHeader(user);
  const sb = document.getElementById('app-sidebar');
  if (sb) sb.innerHTML = buildSidebar(user);
  const mn = document.getElementById('mobile-nav');
  if (mn) mn.innerHTML = buildMobileNav();
  document.getElementById('sidebar-signout')?.addEventListener('click', async () => {
    try {
      const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      await signOut(getAuth());
    } catch(_) {}
    window.location.href = '1_welcome.html';
  });
}
