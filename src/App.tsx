import { useState } from "react";

type Tab = "home" | "notes" | "journal" | "tasks" | "search" | "settings";
type Theme = keyof typeof themes;
type Note = { id:number; title:string; body:string; tag:string };
type Entry = { id:number; title:string; body:string; date:string; mood:string };
type Task = { id:number; title:string; done:boolean; priority:"low"|"medium"|"high" };

const themes = {
  Cloud:{bg:"#f7f3f8",accent:"#8f80f7"}, Lavender:{bg:"#f1ecfb",accent:"#8570dc"}, Peach:{bg:"#fff1eb",accent:"#f39b78"},
  Sage:{bg:"#eef6ef",accent:"#79a982"}, Sky:{bg:"#edf5ff",accent:"#72a6df"}, Butter:{bg:"#fffaf0",accent:"#e2b954"}, Midnight:{bg:"#1f1d25",accent:"#a99bff"}
};

const initialNotes:Note[] = [
  {id:1,title:"Content Ideas",body:"Faceless content ideas for the next batch...",tag:"Ideas"},
  {id:2,title:"Japan Plan",body:"Colleges, visas, language and travel notes.",tag:"Personal"},
  {id:3,title:"Editing Workflow",body:"Tools, shortcuts, process...",tag:"Work"}
];
const initialEntries:Entry[] = [{id:1,title:"A Calm Beginning",body:"Today felt different. I realized that maybe I don't need everything figured out. I just need to keep showing up.",date:"Sep 18, 2026",mood:"Calm"}];
const initialTasks:Task[] = [
  {id:1,title:"Practice English",done:false,priority:"high"}, {id:2,title:"Work on project",done:false,priority:"medium"},
  {id:3,title:"Send outreach",done:false,priority:"medium"}, {id:4,title:"Workout",done:false,priority:"low"}
];

export default function App(){
  const [tab,setTab]=useState<Tab>("home");
  const [theme,setTheme]=useState<Theme>("Cloud");
  const [notes,setNotes]=useState<Note[]>(initialNotes);
  const [entries,setEntries]=useState<Entry[]>(initialEntries);
  const [tasks,setTasks]=useState<Task[]>(initialTasks);
  const [capture,setCapture]=useState(false);
  const [captureText,setCaptureText]=useState("");
  const [selectedNote,setSelectedNote]=useState<Note|null>(null);
  const [selectedEntry,setSelectedEntry]=useState<Entry|null>(null);
  const [query,setQuery]=useState("");
  const [newTask,setNewTask]=useState("");
  const current=themes[theme];

  const addTask=()=>{const title=newTask.trim();if(!title)return;setTasks(v=>[...v,{id:Date.now(),title,done:false,priority:"medium"}]);setNewTask("")};
  const addNote=()=>{const n={id:Date.now(),title:"Untitled note",body:"",tag:"Personal"};setNotes(v=>[n,...v]);setSelectedNote(n);setTab("notes")};
  const addEntry=()=>{const e={id:Date.now(),title:"",body:"",date:new Date().toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}),mood:""};setEntries(v=>[e,...v]);setSelectedEntry(e);setTab("journal")};
  const saveCapture=()=>{if(captureText.trim())setCaptureText("");setCapture(false)};
  const searchItems=[...notes.map(n=>({kind:"Note",title:n.title,body:n.body,id:n.id})),...entries.map(e=>({kind:"Journal",title:e.title||"Untitled entry",body:e.body,id:e.id})),...tasks.map(t=>({kind:"Task",title:t.title,body:t.done?"Completed":"Open",id:t.id}))].filter(x=>(x.title+" "+x.body).toLowerCase().includes(query.toLowerCase()));

  return <div className="morrow-shell" style={{background:current.bg}}>
    <div className="app-frame">
      <header className="flex items-center justify-between mb-7">
        <div><div className="text-xs tracking-[.28em] uppercase font-semibold" style={{color:current.accent}}>Morrow</div>{tab==="home"&&<div className="serif text-4xl mt-2">Good morning</div>}</div>
        <div className="flex gap-2"><button className="p-2 rounded-full bg-white/70 border" onClick={()=>setTab("settings")} aria-label="Settings">⚙</button></div>
      </header>

      {tab==="home"&&<main>
        <div className="mb-5"><div className="text-sm opacity-60">Tuesday, September 22</div><div className="text-base mt-2 opacity-75">A small place for your thoughts, plans and a better tomorrow.</div></div>
        <button onClick={()=>setCapture(true)} className="soft w-full rounded-3xl p-5 text-left pastel-lavender mb-7 flex items-center justify-between"><div><div className="text-lg font-semibold">Quick capture</div><div className="text-sm opacity-70 mt-1">What's on your mind?</div></div><span className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-2xl">+</span></button>
        <section className="mb-7"><div className="flex items-center justify-between mb-3"><h2 className="serif text-2xl">Today's tasks</h2><button className="text-sm underline" onClick={()=>setTab("tasks")}>See all</button></div>
          <div className="soft rounded-3xl overflow-hidden">{tasks.slice(0,5).map(t=><button key={t.id} className="w-full flex items-center gap-3 px-4 py-4 border-b last:border-0 text-left" onClick={()=>setTab("tasks")}><span className={t.done?"h-5 w-5 rounded-full bg-[#b7aaf7] text-white flex items-center justify-center":"h-5 w-5 rounded-full border-2 border-[#b6acc1]"}>{t.done?"✓":""}</span><span className={t.done?"line-through opacity-50":"font-medium"}>{t.title}</span><span className="ml-auto text-xs px-2 py-1 rounded-full bg-white/70">{t.priority}</span></button>)}</div>
          <div className="mt-3 flex gap-2"><input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addTask()}} placeholder="Add a task..." className="flex-1 soft rounded-2xl px-4 py-3 outline-none"/><button onClick={addTask} className="h-12 w-12 rounded-2xl bg-[#28252d] text-white text-2xl">+</button></div>
        </section>
        <section className="mb-7"><div className="flex items-center justify-between mb-3"><h2 className="serif text-2xl">Continue writing</h2><button className="text-sm underline" onClick={()=>setTab("journal")}>See all</button></div><button onClick={()=>setSelectedEntry(entries[0])} className="soft rounded-3xl p-5 w-full text-left pastel-peach"><div className="text-xs opacity-60">September 18, 2026 · Calm</div><div className="text-xl font-semibold mt-2">A Calm Beginning</div><div className="text-sm opacity-70 mt-2">Today felt different. I realized that maybe I don't need everything figured out...</div></button></section>
        <section><div className="flex items-center justify-between mb-3"><h2 className="serif text-2xl">Recent notes</h2><button className="text-sm underline" onClick={()=>setTab("notes")}>See all</button></div><div className="grid grid-cols-2 gap-3">{notes.slice(0,4).map((n,i)=><button key={n.id} onClick={()=>{setSelectedNote(n);setTab("notes")}} className={`soft rounded-3xl p-4 text-left ${i%2===0?"pastel-blue":"pastel-sage"}`}><div className="text-xl">✦</div><div className="font-medium mt-6">{n.title}</div><div className="text-xs opacity-60 mt-1">Updated recently</div></button>)}</div></section>
      </main>}

      {tab==="notes"&&<main>{selectedNote?<Editor title={selectedNote.title} body={selectedNote.body} onBack={()=>setSelectedNote(null)} onSave={(title,body)=>{setNotes(v=>v.map(n=>n.id===selectedNote.id?{...n,title,body}:n));setSelectedNote({...selectedNote,title,body})}}/>:<><div className="flex items-end justify-between mb-5"><div><div className="text-xs tracking-[.22em] uppercase opacity-50">Notes</div><h1 className="serif text-4xl mt-1">Your ideas</h1></div><button onClick={addNote} className="h-12 w-12 rounded-2xl bg-[#8d7df0] text-white text-2xl">+</button></div><div className="grid gap-3">{notes.map(n=><button key={n.id} onClick={()=>setSelectedNote(n)} className="soft rounded-3xl p-5 text-left"><div className="text-xs uppercase tracking-[.16em] opacity-50">{n.tag}</div><div className="font-semibold text-lg mt-2">{n.title}</div><div className="text-sm opacity-65 mt-1">{n.body}</div></button>)}</div></>}</main>}

      {tab==="journal"&&<main>{selectedEntry?<Editor title={selectedEntry.title} body={selectedEntry.body} onBack={()=>setSelectedEntry(null)} onSave={(title,body)=>{setEntries(v=>v.map(e=>e.id===selectedEntry.id?{...e,title,body}:e));setSelectedEntry({...selectedEntry,title,body})}}/>:<><div className="flex items-end justify-between mb-5"><div><div className="text-xs tracking-[.22em] uppercase opacity-50">Journal</div><h1 className="serif text-4xl mt-1">Your story</h1></div><button onClick={addEntry} className="h-12 w-12 rounded-2xl bg-[#8d7df0] text-white text-2xl">+</button></div><div className="soft rounded-3xl p-5 mb-5"><div className="text-center font-medium">September 2026</div><div className="grid grid-cols-7 gap-2 mt-5 text-center text-xs opacity-60">{Array.from({length:30},(_,i)=><span key={i} className="h-8 flex items-center justify-center">{i+1}</span>)}</div></div><div className="space-y-3">{entries.map(e=><button key={e.id} onClick={()=>setSelectedEntry(e)} className="soft rounded-3xl p-5 w-full text-left"><div className="text-xs opacity-50">{e.date} · {e.mood}</div><div className="text-xl font-semibold mt-2">{e.title||"Untitled entry"}</div><div className="text-sm opacity-70 mt-2">{e.body||"Empty entry"}</div></button>)}</div></>}</main>}

      {tab==="tasks"&&<main><div className="mb-5"><div className="text-xs tracking-[.22em] uppercase opacity-50">Tasks</div><h1 className="serif text-4xl mt-1">What needs doing?</h1></div><div className="grid gap-3">{tasks.map(t=><div key={t.id} className="soft rounded-3xl p-4 flex items-center gap-3"><button onClick={()=>setTasks(v=>v.map(x=>x.id===t.id?{...x,done:!x.done}:x))} className={t.done?"h-6 w-6 rounded-full bg-[#8d7df0] text-white":"h-6 w-6 rounded-full border-2 border-[#b7adbf]"}>{t.done?"✓":""}</button><div className={t.done?"flex-1 line-through opacity-50":"flex-1 font-medium"}>{t.title}</div><span className="text-xs px-2 py-1 rounded-full bg-white/70">{t.priority}</span><button onClick={()=>setTasks(v=>v.filter(x=>x.id!==t.id))} className="opacity-50">×</button></div>)}</div></main>}

      {tab==="search"&&<main><div className="text-xs tracking-[.22em] uppercase opacity-50">Search</div><h1 className="serif text-4xl mt-1 mb-4">Find anything</h1><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search notes, journal, tasks..." className="soft w-full rounded-2xl px-4 py-3 outline-none"/><div className="mt-5 grid gap-3">{query&&searchItems.map(x=><div key={x.kind+x.id} className="soft rounded-2xl p-4"><div className="text-xs opacity-50">{x.kind}</div><div className="font-semibold mt-1">{x.title}</div><div className="text-sm opacity-60 mt-1">{x.body}</div></div>)}</div></main>}

      {tab==="settings"&&<main><div className="text-xs tracking-[.22em] uppercase opacity-50">Settings</div><h1 className="serif text-4xl mt-1">Make it yours</h1><div className="soft rounded-3xl p-5 mt-6"><div className="font-semibold">Appearance</div><div className="text-sm opacity-60 mt-1">Choose the feeling of Morrow</div><div className="grid grid-cols-2 gap-3 mt-5">{Object.entries(themes).map(([name,c])=><button key={name} onClick={()=>setTheme(name as Theme)} className="rounded-2xl p-4 text-left border-2" style={{background:c.bg,borderColor:theme===name?c.accent:"transparent"}}><div className="font-medium">{name}</div></button>)}</div></div><div className="soft rounded-3xl p-5 mt-4"><div className="font-semibold">Account</div><div className="text-sm opacity-60 mt-1">Google sign-in will be connected next.</div></div></main>}
    </div>

    <nav className="fixed bottom-0 left-0 right-0 z-40"><div className="max-w-[720px] mx-auto px-4 pb-4"><div className="soft rounded-[26px] px-3 py-2 flex items-center justify-between"><NavButton label="Home" active={tab==="home"} onClick={()=>setTab("home")}/><NavButton label="Notes" active={tab==="notes"} onClick={()=>setTab("notes")}/><button onClick={()=>setCapture(true)} className="h-12 w-12 rounded-2xl bg-[#8d7df0] text-white text-2xl">+</button><NavButton label="Journal" active={tab==="journal"} onClick={()=>setTab("journal")}/><NavButton label="Tasks" active={tab==="tasks"} onClick={()=>setTab("tasks")}/><NavButton label="Search" active={tab==="search"} onClick={()=>setTab("search")}/></div></div></nav>

    {capture&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25"><div className="w-full max-w-[720px] rounded-t-[32px] bg-[#fbf8fc] p-6 pb-8"><div className="flex items-center justify-between"><div className="serif text-3xl">Quick capture</div><button onClick={()=>setCapture(false)} className="text-2xl">×</button></div><div className="text-sm opacity-60 mt-2">Dump anything. Morrow keeps it safe.</div><textarea autoFocus value={captureText} onChange={e=>setCaptureText(e.target.value)} placeholder="What's on your mind?" className="mt-5 w-full h-44 rounded-3xl bg-white border border-[#eadfea] p-5 outline-none resize-none leading-7"/><button onClick={saveCapture} className="w-full mt-4 rounded-2xl bg-[#29252f] text-white py-4 font-medium">Save to inbox</button></div></div>}
  </div>
}

function NavButton({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){return <button onClick={onClick} className={"flex flex-col items-center gap-1 px-2 py-1 rounded-xl "+(active?"text-[#6f61d3]":"text-[#6d6570]")}><span className="text-sm">{label==="Home"?"⌂":label==="Notes"?"□":label==="Journal"?"◐":label==="Tasks"?"✓":"⌕"}</span><span className="text-[10px]">{label}</span></button>}

function Editor({title,body,onBack,onSave}:{title:string;body:string;onBack:()=>void;onSave:(title:string,body:string)=>void}){const[t,setT]=useState(title);const[b,setB]=useState(body);return <main><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="text-2xl">‹</button><button onClick={()=>onSave(t,b)} className="px-4 py-2 rounded-2xl bg-[#28252d] text-white">Save</button></div><input value={t} onChange={e=>setT(e.target.value)} placeholder="Title" className="w-full bg-transparent outline-none serif text-4xl mb-4"/><textarea autoFocus value={b} onChange={e=>setB(e.target.value)} placeholder="Write anything..." className="w-full min-h-[55vh] bg-transparent outline-none resize-none leading-8 text-lg"/></main>}
