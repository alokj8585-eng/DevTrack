/* DevTrack: lightweight browser app. Data is stored in this browser using localStorage. */
const STORAGE = { tasks: "devtrack_tasks_v1", sessions: "devtrack_sessions_v1", journal: "devtrack_journal_v1", timer: "devtrack_timer_v1" };
const $ = (id) => document.getElementById(id);
const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let tasks = read(STORAGE.tasks), sessions = read(STORAGE.sessions), journal = read(STORAGE.journal);
let timer = JSON.parse(localStorage.getItem(STORAGE.timer) || "null");
let toastTimeout;

function uid(){ return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function escapeHTML(value=""){ return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function showToast(message){ const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimeout); toastTimeout=setTimeout(()=>el.classList.remove("show"),2400); }
function dateKey(date=new Date()){ const d=new Date(date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function formatDuration(seconds){ seconds=Math.max(0,Math.floor(seconds)); const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60; return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`; }
function elapsedTimer(){ if(!timer) return 0; return (timer.accumulatedMs||0) + (timer.status==="running" ? Date.now()-timer.startedAt : 0); }
function go(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const titles={overview:"Overview",tasks:"Tasks",sessions:"Coding sessions",journal:"Learning journal"};
  $("page-title").textContent=titles[page]||"Overview";
}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("today-label").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date());

function resetTaskForm(){ $("task-form").reset(); $("task-id").value=""; $("task-form-title").textContent="Add a task"; $("task-submit").textContent="Save task"; $("task-cancel").classList.add("hidden"); }
$("task-cancel").addEventListener("click",resetTaskForm);
$("task-form").addEventListener("submit",e=>{
  e.preventDefault(); const id=$("task-id").value;
  const title=$("task-title").value.trim(); if(!title){showToast("Please enter a task title.");return;}
  const old=tasks.find(t=>t.id===id);
  const task={id:id||uid(),title,category:$("task-category").value,priority:$("task-priority").value,status:$("task-status").value,dueDate:$("task-due").value,createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),completedAt:$("task-status").value==="Completed"?(old?.completedAt||new Date().toISOString()):null};
  tasks=id?tasks.map(t=>t.id===id?task:t):[task,...tasks]; write(STORAGE.tasks,tasks); resetTaskForm(); render(); showToast(id?"Task updated.":"Task added.");
});
function editTask(id){const t=tasks.find(x=>x.id===id);if(!t)return;$("task-id").value=t.id;$("task-title").value=t.title;$("task-category").value=t.category;$("task-priority").value=t.priority;$("task-status").value=t.status;$("task-due").value=t.dueDate||"";$("task-form-title").textContent="Edit task";$("task-submit").textContent="Update task";$("task-cancel").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}
function taskAction(action,id){const t=tasks.find(x=>x.id===id);if(!t)return;if(action==="delete"){if(!confirm(`Delete "${t.title}"?`))return;tasks=tasks.filter(x=>x.id!==id);showToast("Task deleted.");}else if(action==="toggle"){t.status=t.status==="Completed"?"To do":"Completed";t.completedAt=t.status==="Completed"?new Date().toISOString():null;t.updatedAt=new Date().toISOString();showToast(t.status==="Completed"?"Task completed.":"Task reopened.");}write(STORAGE.tasks,tasks);render();}
$("task-filter").addEventListener("change",renderTasks);

function renderTasks(){
  const filter=$("task-filter").value, today=dateKey();
  const visible=tasks.filter(t=>filter==="All"|| (filter==="Overdue"?t.dueDate&&t.dueDate<today&&t.status!=="Completed":t.status===filter));
  $("task-count").textContent=`${visible.length} task${visible.length===1?"":"s"}`;
  $("task-list").innerHTML=visible.length?visible.map(t=>{const overdue=t.dueDate&&t.dueDate<today&&t.status!=="Completed";return `<div class="task-row ${overdue?"overdue":""} ${t.status==="Completed"?"is-done":""}"><div class="task-main"><div class="task-name">${escapeHTML(t.title)}</div><div class="task-meta">${escapeHTML(t.category)} · ${t.dueDate?`Due ${escapeHTML(t.dueDate)}`:"No deadline"} ${overdue?"· OVERDUE":""}</div></div><div class="row-actions"><span class="pill ${t.priority.toLowerCase()}">${escapeHTML(t.priority)}</span><span class="pill ${t.status==="Completed"?"done":""}">${escapeHTML(t.status)}</span><button class="icon-button" data-action="toggle" data-id="${t.id}" title="Toggle complete">✓</button><button class="icon-button" data-action="edit" data-id="${t.id}">Edit</button><button class="icon-button" data-action="delete" data-id="${t.id}">Delete</button></div></div>`}).join(""):`<div class="empty-state">No tasks here yet. Add a task above to get started.</div>`;
  $("task-list").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>b.dataset.action==="edit"?editTask(b.dataset.id):taskAction(b.dataset.action,b.dataset.id)));
  const open=tasks.filter(t=>t.status!=="Completed").slice(0,4);
  $("overview-tasks").innerHTML=open.length?open.map(t=>`<div class="preview-row"><div class="task-main"><div class="task-name">${escapeHTML(t.title)}</div><div class="task-meta">${escapeHTML(t.category)} · ${escapeHTML(t.status)}</div></div><span class="pill ${t.priority.toLowerCase()}">${escapeHTML(t.priority)}</span></div>`).join(""):`<div class="empty-state">No open tasks. Enjoy the clear space.</div>`;
}

$("timer-start").addEventListener("click",()=>{
  if(timer){showToast("Finish or resume your current session first.");return;}
  const project=$("session-project").value.trim();if(!project){showToast("Enter what you're working on first.");$("session-project").focus();return;}
  timer={id:uid(),project,language:$("session-language").value,status:"running",startedAt:Date.now(),accumulatedMs:0};persistTimer();renderTimer();showToast("Coding session started.");
});
$("timer-pause").addEventListener("click",()=>{if(!timer||timer.status!=="running")return;timer.accumulatedMs=elapsedTimer();timer.status="paused";delete timer.startedAt;persistTimer();renderTimer();showToast("Session paused.");});
$("timer-resume").addEventListener("click",()=>{if(!timer||timer.status!=="paused")return;timer.status="running";timer.startedAt=Date.now();persistTimer();renderTimer();showToast("Session resumed.");});
$("timer-stop").addEventListener("click",()=>{
  if(!timer)return;const ms=elapsedTimer();if(ms<1000&&!confirm("This session is less than one second. Save it anyway?"))return;
  sessions.unshift({id:timer.id,project:timer.project,language:timer.language,durationSeconds:Math.floor(ms/1000),date:dateKey(),endedAt:new Date().toISOString()});
  write(STORAGE.sessions,sessions);timer=null;persistTimer();render();showToast("Session saved.");
});
function persistTimer(){if(timer)localStorage.setItem(STORAGE.timer,JSON.stringify(timer));else localStorage.removeItem(STORAGE.timer);}
function renderTimer(){const ms=elapsedTimer(),s=Math.floor(ms/1000),h=String(Math.floor(s/3600)).padStart(2,"0"),m=String(Math.floor(s%3600/60)).padStart(2,"0"),sec=String(s%60).padStart(2,"0");$("timer-display").textContent=`${h}:${m}:${sec}`;$("timer-status").textContent=timer?(timer.status==="running"?`Tracking ${timer.project}`:"Session paused"):"Ready when you are.";$("timer-start").classList.toggle("hidden",!!timer);$("timer-pause").classList.toggle("hidden",!timer||timer.status!=="running");$("timer-resume").classList.toggle("hidden",!timer||timer.status!=="paused");$("timer-stop").classList.toggle("hidden",!timer);}
function renderSessions(){$("session-list").innerHTML=sessions.length?sessions.map(s=>`<div class="session-row"><div class="task-main"><div class="task-name">${escapeHTML(s.project)}</div><div class="task-meta">${escapeHTML(s.language)} · ${escapeHTML(s.date)}</div></div><span class="session-duration">${formatDuration(s.durationSeconds)}</span><button class="icon-button" data-session-delete="${s.id}">Delete</button></div>`).join(""):`<div class="empty-state">No sessions recorded yet. Start your first focus session.</div>`;$("session-list").querySelectorAll("[data-session-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this session?")){sessions=sessions.filter(s=>s.id!==b.dataset.sessionDelete);write(STORAGE.sessions,sessions);render();showToast("Session deleted.");}}));}

$("journal-cancel").addEventListener("click",resetJournalForm);
function resetJournalForm(){$("journal-form").reset();$("journal-id").value="";$("journal-form-title").textContent="New entry";$("journal-cancel").classList.add("hidden");}
$("journal-form").addEventListener("submit",e=>{e.preventDefault();const id=$("journal-id").value,title=$("journal-title").value.trim(),content=$("journal-content").value.trim();if(!title||!content){showToast("Add a title and some notes.");return;}const old=journal.find(j=>j.id===id);const entry={id:id||uid(),title,content,createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};journal=id?journal.map(j=>j.id===id?entry:j):[entry,...journal];write(STORAGE.journal,journal);resetJournalForm();render();showToast(id?"Entry updated.":"Learning entry saved.");});
$("journal-search").addEventListener("input",renderJournal);
function renderJournal(){const q=$("journal-search").value.toLowerCase();const list=journal.filter(j=>(j.title+" "+j.content).toLowerCase().includes(q));$("journal-list").innerHTML=list.length?list.map(j=>`<article class="journal-card"><div class="journal-card-head"><strong>${escapeHTML(j.title)}</strong><span class="journal-date">${new Date(j.createdAt).toLocaleDateString()}</span></div><p>${escapeHTML(j.content)}</p><div class="row-actions"><button class="icon-button" data-journal-edit="${j.id}">Edit</button><button class="icon-button" data-journal-delete="${j.id}">Delete</button></div></article>`).join(""):`<div class="empty-state">No journal entries found.</div>`;$("journal-list").querySelectorAll("[data-journal-edit]").forEach(b=>b.addEventListener("click",()=>{const j=journal.find(x=>x.id===b.dataset.journalEdit);$("journal-id").value=j.id;$("journal-title").value=j.title;$("journal-content").value=j.content;$("journal-form-title").textContent="Edit entry";$("journal-cancel").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}));$("journal-list").querySelectorAll("[data-journal-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this journal entry?")){journal=journal.filter(x=>x.id!==b.dataset.journalDelete);write(STORAGE.journal,journal);render();showToast("Entry deleted.");}}));}

function renderOverview(){
  const today=dateKey(),todaySeconds=sessions.filter(s=>s.date===today).reduce((n,s)=>n+s.durationSeconds,0),completed=tasks.filter(t=>t.status==="Completed").length,open=tasks.filter(t=>t.status!=="Completed").length;
  $("stat-today").textContent=formatDuration(todaySeconds);$("stat-completed").textContent=completed;$("stat-open").textContent=open;$("stat-journal").textContent=journal.length;
  const pct=Math.min(100,Math.round(todaySeconds/7200*100));$("goal-ring").style.background=`conic-gradient(var(--accent) ${pct}%, #edf0f5 ${pct}%)`;$("goal-percent").textContent=`${pct}%`;$("goal-caption").textContent=todaySeconds>=7200?"Daily goal achieved. Great work.":`${Math.ceil((7200-todaySeconds)/60)} minutes remaining today`;
  const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const key=dateKey(d);return {key,label:d.toLocaleDateString(undefined,{weekday:"short"}),seconds:sessions.filter(s=>s.date===key).reduce((n,s)=>n+s.durationSeconds,0)};});const max=Math.max(3600,...days.map(d=>d.seconds));
  $("weekly-chart").innerHTML=days.map(d=>`<div class="chart-col"><span class="chart-value">${d.seconds?formatDuration(d.seconds):"—"}</span><div class="bar-track"><div class="bar" style="height:${Math.max(d.seconds?3:0,d.seconds/max*100)}%"></div></div><span class="chart-day">${d.label}</span></div>`).join("");
}
function render(){renderTasks();renderSessions();renderJournal();renderOverview();renderTimer();}
render();
setInterval(()=>{if(timer?.status==="running")renderTimer();},1000);
