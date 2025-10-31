import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, get, child } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsW9JKhyBmlxv-BAcAa4gyHOX6R-KLoQA",
  authDomain: "englischfairytale8b.firebaseapp.com",
  databaseURL: "https://englischfairytale8b-default-rtdb.firebaseio.com",
  projectId: "englischfairytale8b",
  storageBucket: "englischfairytale8b.appspot.com",
  messagingSenderId: "1009055770845",
  appId: "1:1009055770845:web:56ab77e4788b4bc4ced334"
};
initializeApp(firebaseConfig);
const db = getDatabase();

/* DOM refs */
const authCard = document.getElementById('authCard');
const showReg = document.getElementById('showReg');
const regForm = document.getElementById('regForm');
const cancelReg = document.getElementById('cancelReg');
const regBtn = document.getElementById('regBtn');
const loginBtn = document.getElementById('loginBtn');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginMsg = document.getElementById('loginMsg');
const regMsg = document.getElementById('regMsg');

const appLayout = document.getElementById('appLayout');
const navHome = document.getElementById('navHome');
const navPosts = document.getElementById('navPosts');
const navChat = document.getElementById('navChat');
const navGame = document.getElementById('navGame');
const navProfile = document.getElementById('navProfile');
const navLogout = document.getElementById('navLogout');

const viewHome = document.getElementById('viewHome');
const viewPosts = document.getElementById('viewPosts');
const viewChat = document.getElementById('viewChat');
const viewGame = document.getElementById('viewGame');
const viewProfile = document.getElementById('viewProfile');

const heroGreeting = document.getElementById('heroGreeting');
const composerInitial = document.getElementById('composerInitial');
const postInput = document.getElementById('postInput');
const postBtn = document.getElementById('postBtn');
const feedArea = document.getElementById('feedArea');

const contactsList = document.getElementById('contactsList');
const chatFullMessages = document.getElementById('chatFullMessages');
const chatFullInput = document.getElementById('chatFullInput');
const chatFullSend = document.getElementById('chatFullSend');

const profileBtn = document.getElementById('profileBtn');
const profilePanel = document.getElementById('profilePanel');
const panelClose = document.getElementById('panelClose');
const panelLogout = document.getElementById('panelLogout');
const panelInitialLarge = document.getElementById('panelInitialLarge');
const panelName = document.getElementById('panelName');
const panelUser = document.getElementById('panelUser');
const panelThemeSelect = document.getElementById('panelThemeSelect');

const themeSelect = document.getElementById('themeSelect');
const profileInitial = document.getElementById('profileInitial');
const profileName = document.getElementById('profileName');
const profileUser = document.getElementById('profileUser');
const sidebarUser = document.getElementById('sidebarUser');

const chatToggle = document.getElementById('chatToggle');
const chatSidebar = document.getElementById('chatSidebar');
const chatContactsRight = document.getElementById('chatContactsRight');
const chatSidebarWindow = document.getElementById('chatSidebarWindow');
const chatSidebarMessages = document.getElementById('chatSidebarMessages');
const chatSidebarTitle = document.getElementById('chatSidebarTitle');
const chatSidebarInput = document.getElementById('chatSidebarInput');
const chatSidebarSend = document.getElementById('chatSidebarSend');
const chatClose = document.getElementById('chatClose');

const bellBtn = document.getElementById('bellBtn');
const bellCount = document.getElementById('bellCount');

const previewDark = document.getElementById('previewDark');
const previewLight = document.getElementById('previewLight');
const previewGreen = document.getElementById('previewGreen');
const panelPreviewDark = document.getElementById('panelPreviewDark');
const panelPreviewLight = document.getElementById('panelPreviewLight');
const panelPreviewGreen = document.getElementById('panelPreviewGreen');

const navGameBtn = document.getElementById('navGame');
const activeEmoji = document.getElementById('activeEmoji');
const gamePointsEl = document.getElementById('gamePoints');
const gameProgress = document.getElementById('gameProgress');
const unlockedList = document.getElementById('unlockedList');
const upgradeBtn = document.getElementById('upgradeBtn');
const resetGameBtn = document.getElementById('resetGame');

let currentUser = null; // {username,first,last,uid,isAdmin,theme,game}
let currentChatId = null;
let unreadTotal = 0;
let usersCache = {};

/* helpers */
const uidFor = name => name.replace(/\s+/g,'_').toLowerCase();
const now = () => Date.now();
const el = (t,txt)=>{const d=document.createElement(t); if(txt!==undefined) d.textContent=txt; return d;};
const scrollToBottom = (el) => { el.scrollTop = el.scrollHeight; };

/* NAV/helpers */
function setActive(navEl){
  [navHome,navPosts,navChat,navGame,navProfile].forEach(n=>n.classList.remove('active'));
  navEl.classList.add('active');
}
function showView(view){
  [viewHome,viewPosts,viewChat,viewGame,viewProfile].forEach(v=>v.classList.add('hidden'));
  view.classList.remove('hidden');
}

/* UI: register/login toggle */
showReg.addEventListener('click', ()=>{ regForm.classList.remove('hidden'); document.getElementById('loginForm').classList.add('hidden'); });
cancelReg.addEventListener('click', ()=>{ regForm.classList.add('hidden'); document.getElementById('loginForm').classList.remove('hidden'); });

/* REGISTER */
regBtn.addEventListener('click', async ()=>{
  regMsg.textContent='';
  const first = document.getElementById('regFirst').value.trim();
  const last = document.getElementById('regLast').value.trim();
  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value;
  const code = document.getElementById('regCode').value.trim();
  if(!first||!last||!username||!password){ regMsg.textContent='Bitte alle Felder ausfüllen.'; return; }
  if(code !== '8bschul'){ regMsg.textContent='Ungültiges Kürzel.'; return; }
  const uid = uidFor(username);
  const userRef = ref(db, `users/${uid}`);
  const snap = await get(userRef);
  if(snap.exists()){ regMsg.textContent='Benutzername bereits vergeben.'; return; }
  await set(userRef, {username,first,last,password,code,uid,isAdmin:false,theme:'dark', game:{points:0, level:1, activeEmoji:'😀', unlocked:['😀']}});
  currentUser = {username,first,last,uid,isAdmin:false,theme:'dark', game:{points:0, level:1, activeEmoji:'😀', unlocked:['😀']}};
  afterLogin();
});

/* LOGIN */
loginBtn.addEventListener('click', async ()=>{
  loginMsg.textContent='';
  const username = loginUser.value.trim();
  const password = loginPass.value;
  
  const uid = uidFor(username);
  const snap = await get(ref(db, `users/${uid}`));
  if(!snap.exists()){ loginMsg.textContent='Benutzer nicht gefunden.'; return; }
  const data = snap.val();

  // Admin shortcut
  if(username === 'letsseimen' && password === '261011'){
    const uref = ref(db, `users/${uidFor('Letsseimen')}`);
    await update(uref, {isAdmin:true});
    currentUser = (await get(uref)).val();
    afterLogin(); return;
  }

  if(data.password !== password){ loginMsg.textContent='Falsches Passwort.'; return; }
  if(data.code !== '8bschul'){ loginMsg.textContent='Kürzel ungültig.'; return; }
  
  currentUser = {...data};
  
  // Default game state if missing
  if(!currentUser.game){
    currentUser.game = {points:0, level:1, activeEmoji:'😀', unlocked:['😀']};
    await update(ref(db, `users/${currentUser.uid}`), {game: currentUser.game});
  }

  afterLogin();
});

/* AFTER LOGIN */
async function afterLogin(){
  document.getElementById('authCard').style.display='none';
  document.getElementById('appLayout').classList.remove('hidden');
  heroGreeting.textContent = `Hallo, ${currentUser.first || currentUser.username} 👋`;
  composerInitial.textContent = (currentUser.username||'?').charAt(0).toUpperCase();
  profileInitial.textContent = (currentUser.username||'?').charAt(0).toUpperCase();
  panelInitialLarge.textContent = (currentUser.username||'?').charAt(0).toUpperCase();
  panelName.textContent = `${currentUser.first || ''} ${currentUser.last || ''}`;
  panelUser.textContent = `@${currentUser.username}`;
  profileBtn.textContent = (currentUser.username||'?').charAt(0).toUpperCase();
  sidebarUser.textContent = currentUser.username;
  
  // apply theme saved
  applyTheme(currentUser.theme);

  // nav bindings
  navHome.addEventListener('click', ()=>{ setActive(navHome); showView(viewHome); });
  navPosts.addEventListener('click', ()=>{ setActive(navPosts); showView(viewPosts); renderFeed(); });
  navChat.addEventListener('click', ()=>{ setActive(navChat); showView(viewChat); renderContacts(); });
  navGame.addEventListener('click', ()=>{ setActive(navGame); showView(viewGame); initGame(); });
  navProfile.addEventListener('click', ()=>{ setActive(navProfile); showView(viewProfile); });
  navLogout.addEventListener('click', ()=> logout());
  document.getElementById('quickPost').addEventListener('click', ()=>{ setActive(navPosts); showView(viewPosts); });
  document.getElementById('quickChat').addEventListener('click', ()=>{ setActive(navChat); showView(viewChat); });
  document.getElementById('quickGame').addEventListener('click', ()=>{ setActive(navGame); showView(viewGame); initGame(); });

  // Theme select bindings
  themeSelect.value = currentUser.theme;
  themeSelect.addEventListener('change', e => setTheme(e.target.value));
  panelThemeSelect.value = currentUser.theme;
  panelThemeSelect.addEventListener('change', e => setTheme(e.target.value));
  [previewDark, panelPreviewDark].forEach(el => el.addEventListener('click', () => setTheme('dark')));
  [previewLight, panelPreviewLight].forEach(el => el.addEventListener('click', () => setTheme('light')));
  [previewGreen, panelPreviewGreen].forEach(el => el.addEventListener('click', () => setTheme('green')));

  // Profile Panel
  profileBtn.addEventListener('click', () => { profilePanel.style.display = 'block'; });
  panelClose.addEventListener('click', () => { profilePanel.style.display = 'none'; });
  panelLogout.addEventListener('click', () => logout());

  // Chat Sidebar
  chatToggle.addEventListener('click', () => chatSidebar.classList.toggle('open'));
  chatClose.addEventListener('click', () => chatSidebar.classList.remove('open'));

  // start feed, contacts, chats, game
  renderFeed(); renderContacts(); renderChatContactsRight();
  updateChatsList(); computeUnread();
  onValue(ref(db,'chats'), ()=> computeUnread());
  localStorage.setItem('loggedUser', currentUser.uid);

  // load game data
  onValue(ref(db, `users/${currentUser.uid}/game`), snap => {
    if(snap.exists()){
      currentUser.game = snap.val();
      updateGameUI();
    }
  });

  // cache all users
  onValue(ref(db,'users'), snap => {
    usersCache = snap.val() || {};
    renderContacts(); // Refresh contacts when users change
    renderChatContactsRight();
    computeUnread();
  });

  // Initial game setup on login
  initGame();
}

// Check for logged-in user on load
(async () => {
  const uid = localStorage.getItem('loggedUser');
  if(uid){
    const snap = await get(ref(db, `users/${uid}`));
    if(snap.exists()){
      currentUser = snap.val();
      afterLogin();
    } else {
      localStorage.removeItem('loggedUser');
    }
  }
})();

/* THEME */
function applyTheme(theme){
  if(theme === 'light'){ document.body.classList.add('light'); document.body.classList.remove('green'); }
  else if(theme === 'green'){ document.body.classList.add('green'); document.body.classList.remove('light'); }
  else { document.body.classList.remove('light'); document.body.classList.remove('green'); }
  themeSelect.value = theme;
  panelThemeSelect.value = theme;
}

async function setTheme(theme){
  await update(ref(db, `users/${currentUser.uid}`), {theme});
  currentUser.theme = theme;
  applyTheme(theme);
}

/* LOGOUT */
function logout(){ localStorage.removeItem('loggedUser'); location.reload(); }

/* POSTS */
postBtn.addEventListener('click', async ()=>{
  const text = postInput.value.trim();
  if(!text) return;
  const p = push(ref(db,'posts'));
  await set(p, {author: currentUser.username, authorUid: currentUser.uid, text, time: now()});
  postInput.value=''; renderFeed();
});

/* RENDER FEED */
function renderFeed(){
  composerInitial.textContent = (currentUser.username||'?').charAt(0).toUpperCase();
  onValue(ref(db,'posts'), snap=>{
    const data = snap.val() || {};
    feedArea.innerHTML = '';
    const entries = Object.entries(data).sort((a,b)=>b[1].time - a[1].time);
    entries.forEach(([key,p])=>{
      const block = document.createElement('div'); block.className='postCard';
      const left = document.createElement('div'); left.innerHTML = `<div class="initialCircle">${(p.author||'?').charAt(0).toUpperCase()}</div>`;
      const body = document.createElement('div'); body.style.flex='1';
      const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${p.author} • ${new Date(p.time).toLocaleString()}`;
      const txt = document.createElement('div'); txt.style.marginTop='8px'; txt.textContent = p.text || '';
      body.appendChild(meta); body.appendChild(txt);

      const acts = document.createElement('div'); acts.className='actions';
      const likeBtn = el('button', `❤️ ${p.likes ? Object.keys(p.likes).length : 0}`); likeBtn.className='btn like';
      likeBtn.addEventListener('click', async ()=>{
        const likePath = `posts/${key}/likes/${currentUser.uid}`;
        const cur = (await get(child(ref(db), likePath))).exists();
        if(cur) await set(ref(db, likePath), null); else await set(ref(db, likePath), true);
      });
      acts.appendChild(likeBtn);

      if(currentUser.username === p.author){
        const editBtn = el('button','✏️'); editBtn.className='btn';
        editBtn.addEventListener('click', ()=>{
          const ta = document.createElement('textarea'); ta.className='textarea'; ta.value = p.text || '';
          const save = el('button','💾'); save.className='btn primary';
          save.addEventListener('click', ()=> update(ref(db, `posts/${key}`), {text: ta.value}));
          body.replaceChild(ta, txt);
          acts.appendChild(save);
        });
        acts.appendChild(editBtn);
      }
      if(currentUser.isAdmin || currentUser.username === p.author){
        const del = el('button','🗑'); del.className='btn';
        del.addEventListener('click', ()=>{ if(confirm('Post löschen?')) set(ref(db, `posts/${key}`), null); });
        acts.appendChild(del);
      }
      body.appendChild(acts);

      const commentBox = document.createElement('div'); commentBox.className='commentBox';
      const inpt = document.createElement('input'); inpt.className='input'; inpt.placeholder='Kommentiere...';
      inpt.addEventListener('keydown', e=>{
        if(e.key === 'Enter' && inpt.value.trim()){
          push(ref(db, `posts/${key}/comments`), {author: currentUser.username, authorUid: currentUser.uid, text: inpt.value.trim(), time: now()});
          inpt.value='';
        }
      });
      commentBox.appendChild(inpt);
      if(p.comments){
        Object.entries(p.comments).forEach(([ck,c])=>{
          const cd = document.createElement('div'); cd.className='comment';
          cd.innerHTML = `<div class="meta"><b>${c.author}</b> • ${new Date(c.time).toLocaleString()}</div><div class="cText">${c.text}</div>`;
          if(currentUser.uid === c.authorUid){
            const eb = el('button','✏️'); eb.className='btn';
            eb.addEventListener('click', ()=>{
              const ta = document.createElement('textarea'); ta.className='textarea'; ta.value = c.text;
              const sv = el('button','💾'); sv.className='btn primary';
              sv.addEventListener('click', ()=> update(ref(db, `posts/${key}/comments/${ck}`), {text: ta.value}));
              cd.querySelector('.cText').replaceWith(ta);
              cd.appendChild(sv);
            });
            const dl = el('button','🗑'); dl.className='btn';
            dl.addEventListener('click', ()=>{ if(confirm('Kommentar löschen?')) set(ref(db, `posts/${key}/comments/${ck}`), null); });
            cd.appendChild(eb); cd.appendChild(dl);
          }
          if(currentUser.isAdmin && currentUser.uid !== c.authorUid){
            const dl2 = el('button','🗑(Admin)'); dl2.className='btn';
            dl2.addEventListener('click', ()=>{ if(confirm('Admin löscht Kommentar?')) set(ref(db, `posts/${key}/comments/${ck}`), null); });
            cd.appendChild(dl2);
          }
          commentBox.appendChild(cd);
        });
      }
      body.appendChild(commentBox);

      block.appendChild(left); block.appendChild(body);
      feedArea.appendChild(block);
    });
  });
}

/* CONTACTS + CHAT */
function getChatId(uid1, uid2){
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

function renderContacts(){
  contactsList.innerHTML = '';
  Object.values(usersCache).forEach(u=>{
    if(u.uid === currentUser.uid || !u.code || u.code !== '8bschul') return;
    const row = document.createElement('div'); row.className='navItem userRow';
    row.style.justifyContent = 'space-between';
    const initials = el('div', (u.username||'?').charAt(0).toUpperCase()); initials.className='logoCircle'; initials.style.width='34px'; initials.style.height='34px'; initials.style.fontSize='14px';
    const name = el('div', u.username);
    row.appendChild(initials);
    row.appendChild(name);
    const unread = el('span', '0'); unread.className='unread hidden'; unread.id = `unread_full_${u.uid}`;
    row.appendChild(unread);
    row.addEventListener('click', () => openChat(u, 'full'));
    contactsList.appendChild(row);
  });
  updateUnreadBadges();
}

function renderChatContactsRight(){
  chatContactsRight.innerHTML = '';
  Object.values(usersCache).forEach(u=>{
    if(u.uid === currentUser.uid || !u.code || u.code !== '8bschul') return;
    const row = document.createElement('div'); row.className='navItem userRow';
    row.style.justifyContent = 'space-between';
    const initials = el('div', (u.username||'?').charAt(0).toUpperCase()); initials.className='logoCircle'; initials.style.width='34px'; initials.style.height='34px'; initials.style.fontSize='14px';
    const name = el('div', u.username);
    row.appendChild(initials);
    row.appendChild(name);
    const unread = el('span', '0'); unread.className='unread hidden'; unread.id = `unread_right_${u.uid}`;
    row.appendChild(unread);
    row.addEventListener('click', () => openChat(u, 'sidebar'));
    chatContactsRight.appendChild(row);
  });
  updateUnreadBadges();
}

function openChat(targetUser, view){
  const chatId = getChatId(currentUser.uid, targetUser.uid);
  currentChatId = chatId;
  
  if(view === 'full'){
    document.getElementById('chatHeaderFull').textContent = targetUser.username;
    chatFullMessages.innerHTML = '';
    chatFullInput.disabled = false;
    chatFullSend.disabled = false;
    chatFullSend.onclick = () => sendMessage(chatId, chatFullInput);
    chatFullInput.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(chatId, chatFullInput); };
    renderMessages(chatId, chatFullMessages);
    update(ref(db, `chats/${chatId}/members/${currentUser.uid}`), {unread: 0});
  } else if (view === 'sidebar'){
    chatSidebarWindow.style.display = 'flex';
    chatSidebarTitle.textContent = targetUser.username;
    chatSidebarMessages.innerHTML = '';
    chatSidebarInput.disabled = false;
    chatSidebarSend.disabled = false;
    chatSidebarSend.onclick = () => sendMessage(chatId, chatSidebarInput);
    chatSidebarInput.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(chatId, chatSidebarInput); };
    renderMessages(chatId, chatSidebarMessages);
    update(ref(db, `chats/${chatId}/members/${currentUser.uid}`), {unread: 0});
    if(!chatSidebar.classList.contains('open')) chatSidebar.classList.add('open');
  }
}

async function sendMessage(chatId, inputEl){
  const text = inputEl.value.trim();
  if(!text) return;

  const otherUid = chatId.replace(currentUser.uid, '').replace('_', '');
  
  const p = push(ref(db, `chats/${chatId}/messages`));
  await set(p, {sender: currentUser.uid, text, time: now()});
  
  // Increment unread count for other user
  const chatRef = ref(db, `chats/${chatId}/members/${otherUid}`);
  const snap = await get(chatRef);
  const currentUnread = snap.exists() ? (snap.val().unread || 0) : 0;
  await update(chatRef, {unread: currentUnread + 1});
  
  inputEl.value = '';
}

function renderMessages(chatId, messagesContainer){
  onValue(ref(db, `chats/${chatId}/messages`), snap => {
    messagesContainer.innerHTML = '';
    const data = snap.val() || {};
    Object.values(data).forEach(m => {
      const msgDiv = el('div'); msgDiv.className = `msg ${m.sender === currentUser.uid ? 'me' : ''}`;
      const bubble = el('span', m.text); bubble.className = 'bubble';
      msgDiv.appendChild(bubble);
      messagesContainer.appendChild(msgDiv);
    });
    scrollToBottom(messagesContainer);
  });
}

function updateChatsList(){
  onValue(ref(db, 'chats'), snap => {
    const chats = snap.val() || {};
    Object.entries(chats).forEach(([chatId, chat]) => {
      if(chat.members && chat.members[currentUser.uid]){
        const unread = chat.members[currentUser.uid].unread || 0;
        const otherUid = chatId.replace(currentUser.uid, '').replace('_', '');
        
        const badgeFull = document.getElementById(`unread_full_${otherUid}`);
        const badgeRight = document.getElementById(`unread_right_${otherUid}`);
        
        if(badgeFull) { badgeFull.textContent = unread; badgeFull.classList.toggle('hidden', unread === 0); }
        if(badgeRight) { badgeRight.textContent = unread; badgeRight.classList.toggle('hidden', unread === 0); }
      }
    });
    computeUnread();
  });
}

function updateUnreadBadges(){
  Object.values(usersCache).forEach(u=>{
    if(u.uid === currentUser.uid) return;
    const badgeFull = document.getElementById(`unread_full_${u.uid}`);
    const badgeRight = document.getElementById(`unread_right_${u.uid}`);
    if(badgeFull) { badgeFull.textContent = 0; badgeFull.classList.add('hidden'); }
    if(badgeRight) { badgeRight.textContent = 0; badgeRight.classList.add('hidden'); }
  });
  updateChatsList();
}

function computeUnread(){
  let total = 0;
  onValue(ref(db, 'chats'), snap => {
    const chats = snap.val() || {};
    Object.values(chats).forEach(chat => {
      if(chat.members && chat.members[currentUser.uid]){
        total += chat.members[currentUser.uid].unread || 0;
      }
    });
    bellCount.textContent = total;
    bellCount.classList.toggle('hidden', total === 0);
  });
}

/* EMOJI GAME */
const EMOJIS = ['😀', '😂', '😍', '🤩', '😎', '🥳', '🤯', '🥶', '💰', '👑', '🚀'];
const LEVELS = [1, 5, 15, 30, 50, 75, 100, 150, 200, 300, 500]; // Points to unlock next emoji

function initGame(){
  updateGameUI();
  activeEmoji.removeEventListener('click', clickEmoji);
  activeEmoji.addEventListener('click', clickEmoji);
  upgradeBtn.addEventListener('click', upgradeClickPower);
  resetGameBtn.addEventListener('click', resetGame);
}

function updateGameUI(){
  if(!currentUser || !currentUser.game) return;

  const { points, level, activeEmoji: currentEmoji, unlocked } = currentUser.game;
  
  gamePointsEl.textContent = points;
  activeEmoji.textContent = currentEmoji;

  // Progress Bar
  const nextLevelIndex = unlocked.length;
  const targetPoints = LEVELS[nextLevelIndex] || points + 1; // Last emoji = max
  const progress = Math.min(100, (points / targetPoints) * 100);
  gameProgress.style.width = `${progress}%`;
  
  if(points >= targetPoints && nextLevelIndex < EMOJIS.length){
    const nextEmoji = EMOJIS[nextLevelIndex];
    if(!unlocked.includes(nextEmoji)){
      unlocked.push(nextEmoji);
      update(ref(db, `users/${currentUser.uid}/game/unlocked`), unlocked);
    }
  }

  // Unlocked List
  unlockedList.innerHTML = '';
  unlocked.forEach(emoji => {
    const span = el('span', emoji); 
    span.style.fontSize = '28px'; 
    span.style.cursor = 'pointer';
    span.style.border = emoji === currentEmoji ? '2px solid var(--accent-1)' : 'none';
    span.style.borderRadius = '6px';
    span.style.padding = '2px';
    span.title = 'Als aktives Emoji festlegen';
    span.addEventListener('click', () => setActiveEmoji(emoji));
    unlockedList.appendChild(span);
  });
  
  // Upgrade Button
  const upgradeCost = level * 20;
  upgradeBtn.textContent = `Upgrade (x${level + 1} für ${upgradeCost} Punkte)`;
  upgradeBtn.disabled = points < upgradeCost;
}

function clickEmoji(e){
  if(!currentUser || !currentUser.game) return;
  
  const clickValue = currentUser.game.level;
  const newPoints = currentUser.game.points + clickValue;
  
  // Save to DB
  update(ref(db, `users/${currentUser.uid}/game`), {points: newPoints});

  // Particle effect
  const particle = el('div', `+${clickValue}`);
  particle.className = 'particle';
  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;
  document.body.appendChild(particle);
  
  requestAnimationFrame(() => {
    particle.style.opacity = '1';
    particle.style.transform = `translate(-50%, calc(-50% - 40px)) scale(1)`;
  });

  setTimeout(() => {
    particle.remove();
  }, 450);
}

function upgradeClickPower(){
  if(!currentUser || !currentUser.game) return;
  const upgradeCost = currentUser.game.level * 20;
  
  if(currentUser.game.points >= upgradeCost){
    const newPoints = currentUser.game.points - upgradeCost;
    const newLevel = currentUser.game.level + 1;
    update(ref(db, `users/${currentUser.uid}/game`), {points: newPoints, level: newLevel});
  }
}

function setActiveEmoji(emoji){
  update(ref(db, `users/${currentUser.uid}/game/activeEmoji`), emoji);
}

function resetGame(){
  if(confirm('Möchtest du das Spiel wirklich zurücksetzen? Alle Punkte und Upgrades gehen verloren!')){
    const resetData = {points:0, level:1, activeEmoji:'😀', unlocked:['😀']};
    update(ref(db, `users/${currentUser.uid}/game`), resetData);
  }
}