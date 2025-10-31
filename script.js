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

/* DOM refs (Verweise auf HTML-Elemente) */
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

let currentUser = null; // {username,first,last,uid,isAdmin,theme}
let currentChatId = null;
let unreadTotal = 0;

/* helpers */
const uidFor = name => name.replace(/\s+/g,'_').toLowerCase();
const now = () => Date.now();
const el = (t,txt)=>{const d=document.createElement(t); if(txt!==undefined) d.textContent=txt; return d;};

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
document.getElementById('cancelReg').addEventListener('click', ()=>{ regForm.classList.add('hidden'); document.getElementById('loginForm').classList.remove('hidden'); });

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
  await set(userRef, {username,first,last,password,code,uid,isAdmin:false,theme:'dark'});
  currentUser = {username,first,last,uid,isAdmin:false,theme:'dark'};
  afterLogin();
});

/* LOGIN */
loginBtn.addEventListener('click', async ()=>{
  loginMsg.textContent='';
  const username = loginUser.value.trim();
  const password = loginPass.value;
  if(username === 'Letsseimen' && password === '261011'){
    const uid = uidFor(username);
    const uref = ref(db, `users/${uid}`);
    const s = await get(uref);
    if(!s.exists()){
      await set(uref, {username:'Letsseimen',first:'Seimen',last:'',password:'261011',code:'8bschul',uid,isAdmin:true,theme:'dark'});
    } else {
      await update(uref, {isAdmin:true});
    }
    currentUser = (await get(uref)).val();
    afterLogin(); return;
  }
  const uid = uidFor(username);
  const snap = await get(ref(db, `users/${uid}`));
  if(!snap.exists()){ loginMsg.textContent='Benutzer nicht gefunden.'; return; }
  const data = snap.val();
  if(data.password !== password){ loginMsg.textContent='Falsches Passwort.'; return; }
  if(data.code !== '8bschul'){ loginMsg.textContent='Kürzel ungültig.'; return; }
  currentUser = {...data};
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
  if(currentUser.theme === 'light'){ document.body.classList.add('light'); document.body.classList.remove('green'); }
  else if(currentUser.theme === 'green'){ document.body.classList.add('green'); document.body.classList.remove('light'); }
  else { document.body.classList.remove('light'); document.body.classList.remove('green'); }
  // nav bindings
  navHome.addEventListener('click', ()=>{ setActive(navHome); showView(viewHome); });
  navPosts.addEventListener('click', ()=>{ setActive(navPosts); showView(viewPosts); renderFeed(); });
  navChat.addEventListener('click', ()=>{ setActive(navChat); showView(viewChat); renderContacts(); });
  navGame.addEventListener('click', ()=>{ setActive(navGame); showView(viewGame); });
  navProfile.addEventListener('click', ()=>{ setActive(navProfile); showView(viewProfile); });
  navLogout.addEventListener('click', ()=> logout());
  document.getElementById('quickPost').addEventListener('click', ()=>{ setActive(navPosts); showView(viewPosts); });
  document.getElementById('quickChat').addEventListener('click', ()=>{ setActive(navChat); showView(viewChat); });
  document.getElementById('quickGame').addEventListener('click', ()=>{ setActive(navGame); showView(viewGame); });

  // start feed, contacts, chats
  renderFeed(); renderContacts(); renderChatContactsRight();
  updateChatsList(); computeUnread();
  onValue(ref(db,'chats'), ()=> computeUnread());
  localStorage.setItem('loggedUser', currentUser.uid);
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
        const cur = (await get(ref(db, likePath))).exists();
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
function renderContacts(){
  onValue(ref(db,'users'), snap=>{
    contactsList.innerHTML = ''; chatContactsRight.innerHTML = '';
    snap.forEach(s=>{
      const u = s.val();
      if(!u.code || u.code !== '8bschul' || u.uid === currentUser.uid) return;
      const row = document.createElement('div'); row.className='userRow navItem'; row.style.display='flex';
      const initials = el('div', (u.username||'?').charAt(0).toUpperCase()); initials.className='initialCircle'; initials.style.width='44px'; initials.style.height='44px'; initials.style.fontSize='16px';
      const details = el('div');
      details.innerHTML = `<b>${u.first || u.username}</b> <div class="small">@${u.username}</div>`;

      row.appendChild(initials);
      row.appendChild(details);

      // Full Chat
      const chatRowFull = row.cloneNode(true);
      chatRowFull.addEventListener('click', ()=> startChat(u));
      contactsList.appendChild(chatRowFull);

      // Sidebar Chat
      const chatRowSidebar = row.cloneNode(true);
      const unread = el('span', '0'); unread.className='unread hidden'; unread.id=`unread-${u.uid}`;
      chatRowSidebar.appendChild(unread);
      chatRowSidebar.addEventListener('click', ()=>{ startChat(u, 'sidebar'); });
      chatContactsRight.appendChild(chatRowSidebar);
    });
    updateChatsList();
  });
}

function renderChatContactsRight(){
  // This function is mostly redundant now, as renderContacts updates both lists.
  // We keep the call in afterLogin() just in case, but rely on renderContacts.
}


function startChat(contact, mode='full'){
  const users = [currentUser.uid, contact.uid].sort();
  const chatId = users.join('-');
  currentChatId = chatId;

  if(mode === 'full'){
    setActive(navChat);
    showView(viewChat);
    chatHeaderFull.textContent = `Chat mit ${contact.first || contact.username}`;
    renderChatMessages(chatFullMessages, chatId, contact);
    chatFullSend.onclick = ()=> sendMessage(chatFullInput, chatId, contact.uid);
    chatFullInput.onkeypress = e=>{ if(e.key === 'Enter') sendMessage(chatFullInput, chatId, contact.uid); };
  } else { // sidebar
    chatSidebarWindow.style.display = 'flex';
    chatSidebarTitle.textContent = `Chat mit ${contact.first || contact.username}`;
    renderChatMessages(chatSidebarMessages, chatId, contact);
    chatSidebarSend.onclick = ()=> sendMessage(chatSidebarInput, chatId, contact.uid);
    chatSidebarInput.onkeypress = e=>{ if(e.key === 'Enter') sendMessage(chatSidebarInput, chatId, contact.uid); };
    chatSidebar.classList.add('open');
  }
}

function sendMessage(inputEl, chatId, recipientUid){
  const text = inputEl.value.trim();
  if(!text) return;
  const chatRef = ref(db, `chats/${chatId}`);
  const msgKey = push(child(chatRef, 'messages')).key;
  set(child(chatRef, `messages/${msgKey}`), {sender: currentUser.uid, text, time: now()});
  // Update last message/timestamp
  update(chatRef, {
    user1: currentUser.uid,
    user2: recipientUid,
    lastMsg: text,
    lastTime: now(),
    lastSender: currentUser.uid,
    unread: {[recipientUid]: true} // Mark as unread for recipient
  });
  inputEl.value = '';
}

function renderChatMessages(msgEl, chatId, contact){
  onValue(ref(db, `chats/${chatId}/messages`), snap=>{
    msgEl.innerHTML = '';
    snap.forEach(s=>{
      const m = s.val();
      const msg = el('div'); msg.className=`msg ${m.sender === currentUser.uid ? 'me' : 'other'}`;
      const bubble = el('div', m.text); bubble.className='bubble';
      msg.appendChild(bubble);
      msgEl.appendChild(msg);
    });
    msgEl.scrollTop = msgEl.scrollHeight; // Auto scroll to bottom

    // Mark as read for current user
    if(currentChatId === chatId){ // only if currently viewing
      update(ref(db, `chats/${chatId}`), {[`unread/${currentUser.uid}`]: null});
    }
    computeUnread();
  });
}

function computeUnread(){
  unreadTotal = 0;
  onValue(ref(db,'chats'), snap=>{
    snap.forEach(s=>{
      const chat = s.val();
      if(chat.user1 === currentUser.uid || chat.user2 === currentUser.uid){
        const recipient = chat.user1 === currentUser.uid ? chat.user2 : chat.user1;
        const unreadForMe = chat.unread && chat.unread[currentUser.uid];

        const unreadEl = document.getElementById(`unread-${recipient}`);
        if(unreadEl){
          if(unreadForMe){
            unreadTotal++;
            unreadEl.textContent = '1'; // Simple indicator for unread chat
            unreadEl.classList.remove('hidden');
          } else {
            unreadEl.classList.add('hidden');
          }
        }
      }
    });
    if(unreadTotal > 0){
      bellCount.textContent = unreadTotal;
      bellCount.classList.remove('hidden');
    } else {
      bellCount.classList.add('hidden');
    }
  }, { onlyOnce: false });
}

function updateChatsList(){
  onValue(ref(db,'chats'), snap=>{
    // This function ensures the latest unread status is available in renderContacts
    // which is why it's called after renderContacts in afterLogin().
    // The actual update of the unread count on the contacts list is done in computeUnread().
  });
}

chatToggle.addEventListener('click', ()=> chatSidebar.classList.toggle('open'));
chatClose.addEventListener('click', ()=> chatSidebar.classList.remove('open'));

/* PROFILE */
profileBtn.addEventListener('click', ()=>{ profilePanel.style.display = profilePanel.style.display === 'block' ? 'none' : 'block'; });
panelClose.addEventListener('click', ()=> profilePanel.style.display = 'none');
panelLogout.addEventListener('click', ()=> logout());

// Theme management
const themeChangeHandler = (event) => {
  const newTheme = event.target.value;
  updateTheme(newTheme);
};

themeSelect.addEventListener('change', themeChangeHandler);
panelThemeSelect.addEventListener('change', themeChangeHandler);

previewDark.addEventListener('click', ()=> updateTheme('dark'));
previewLight.addEventListener('click', ()=> updateTheme('light'));
previewGreen.addEventListener('click', ()=> updateTheme('green'));
panelPreviewDark.addEventListener('click', ()=> updateTheme('dark'));
panelPreviewLight.addEventListener('click', ()=> updateTheme('light'));
panelPreviewGreen.addEventListener('click', ()=> updateTheme('green'));

function updateTheme(theme){
  if(currentUser){
    const userRef = ref(db, `users/${currentUser.uid}`);
    update(userRef, {theme});
    currentUser.theme = theme;
  }
  document.body.classList.remove('light', 'green');
  if(theme === 'light'){ document.body.classList.add('light'); }
  else if(theme === 'green'){ document.body.classList.add('green'); }
  
  // Update select boxes
  themeSelect.value = theme;
  panelThemeSelect.value = theme;
}

// Check if user is logged in on load
document.addEventListener('DOMContentLoaded', async ()=>{
  const uid = localStorage.getItem('loggedUser');
  if(uid){
    const snap = await get(ref(db, `users/${uid}`));
    if(snap.exists()){
      currentUser = snap.val();
      afterLogin();
    }
  }
});

/* EMOJI GAME LOGIC */
const EMOJIS = ['😀', '😍', '🤩', '🥳', '😎', '🤯', '🤠', '😇', '😈', '👽'];
const UNLOCK_COSTS = [10, 20, 40, 70, 110, 160, 220, 290, 370];

let gamePoints = 0;
let clickPower = 1;
let unlockedEmojis = ['😀'];
let activeIndex = 0;

function updateGameUI(){
  gamePointsEl.textContent = gamePoints;
  activeEmoji.textContent = EMOJIS[activeIndex];
  gameProgress.style.width = `${Math.min(100, (gamePoints / UNLOCK_COSTS[unlockedEmojis.length - 1] * 100) || 0)}%`;

  // Update upgrade button text and availability
  const nextCost = 20 * clickPower;
  upgradeBtn.textContent = `Upgrade (x${clickPower + 1} für ${nextCost} Punkte)`;
  upgradeBtn.disabled = gamePoints < nextCost;

  // Render unlocked list
  unlockedList.innerHTML = '';
  unlockedEmojis.forEach((emoji, index) => {
    const item = el('div', emoji);
    item.style.fontSize = '24px';
    item.style.cursor = 'pointer';
    item.style.borderRadius = '6px';
    item.style.padding = '4px';
    if(index === activeIndex) {
      item.style.border = `2px solid var(--accent-1)`;
    }
    item.addEventListener('click', ()=> {
      activeIndex = index;
      updateGameUI();
    });
    unlockedList.appendChild(item);
  });
}

function checkUnlock(){
  if(unlockedEmojis.length < EMOJIS.length){
    const nextUnlockIndex = unlockedEmojis.length - 1;
    const cost = UNLOCK_COSTS[nextUnlockIndex];
    if(gamePoints >= cost){
      unlockedEmojis.push(EMOJIS[unlockedEmojis.length]);
      // Set newly unlocked emoji as active
      activeIndex = unlockedEmojis.length - 1;
      // Subtract the cost and continue checking
      gamePoints -= cost;
      checkUnlock();
    }
  }
}

activeEmoji.addEventListener('click', (e)=>{
  gamePoints += clickPower;
  checkUnlock();
  updateGameUI();
  createParticle(e.clientX, e.clientY);
  activeEmoji.style.transform = 'scale(0.9)';
  setTimeout(()=> activeEmoji.style.transform = 'scale(1.0)', 80);
});

upgradeBtn.addEventListener('click', ()=>{
  const cost = 20 * clickPower;
  if(gamePoints >= cost){
    gamePoints -= cost;
    clickPower++;
    updateGameUI();
  }
});

resetGameBtn.addEventListener('click', ()=>{
  if(confirm('Möchtest du deinen Spielstand wirklich zurücksetzen?')){
    gamePoints = 0;
    clickPower = 1;
    unlockedEmojis = ['😀'];
    activeIndex = 0;
    updateGameUI();
  }
});

function createParticle(x, y){
  const particle = el('div', `+${clickPower}`);
  particle.className = 'particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  document.body.appendChild(particle);

  // Animate the particle
  setTimeout(() => {
    particle.style.opacity = '1';
    particle.style.transform = 'translate(-50%, -100%) scale(1)';
  }, 10);

  // Remove the particle after animation
  setTimeout(() => {
    particle.style.opacity = '0';
    particle.style.transform = 'translate(-50%, -200%) scale(0.6)';
    setTimeout(() => particle.remove(), 450);
  }, 100);
}

// Initial game UI load (after login check)
navGameBtn.addEventListener('click', ()=> updateGameUI());