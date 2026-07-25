"use strict";

/* type "hls" needs hls.js off Safari; "direct" plays natively.
   meta stations expose a now-playing JSON (RP/Soma); Indian streams are live-only. */
const STATIONS = [
  {id:"air-akashvani-kn", grp:"kn", type:"hls",    name:"ಆಕಾಶವಾಣಿ ಬೆಂಗಳೂರು", desc:"Akashvani Bengaluru", url:"https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio030/hlspbaudio030_Auto.m3u8"},
  {id:"air-vb-kn",        grp:"kn", type:"hls",    name:"ವಿವಿಧ ಭಾರತಿ",       desc:"Vividh Bharati BLR",  url:"https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio026/hlspbaudio026_Auto.m3u8"},
  {id:"air-amrutha",      grp:"kn", type:"hls",    name:"ಅಮೃತವರ್ಷಿಣಿ",       desc:"classical · AIR",     url:"https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio028/hlspbaudio028_Auto.m3u8"},
  {id:"girmit",           grp:"kn", type:"direct", meta:"radiojar", np:"https://www.radiojar.com/api/stations/g6dgm6m6p3hvv/now_playing/", name:"ರೇಡಿಯೋ ಗಿರ್ಮಿಟ್",   desc:"Radio Girmit",        url:"https://stream.radiojar.com/g6dgm6m6p3hvv"},
  {id:"suno-kn",          grp:"kn", type:"direct", name:"ಸುನೋ ಎಫ್‌ಎಂ",       desc:"Suno FM · melody",    url:"https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_SUNO_MELODY_S06.mp3"},

  {id:"air-vb-national",  grp:"hi", type:"hls",    name:"विविध भारती",        desc:"national · AIR",      url:"https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8"},
  {id:"air-raagam",       grp:"hi", type:"hls",    name:"रागम् 24×7",         desc:"Indian classical",    url:"https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8"},
  {id:"mirchi-hi",        grp:"hi", type:"direct", name:"रेडियो मिर्ची",       desc:"Mirchi Hindi",        url:"https://eu8.fastcast4u.com/proxy/clyedupq/stream"},
  {id:"hindi-gold",       grp:"hi", type:"direct", meta:"azura", np:"https://azuracast.vibesounds.in/api/nowplaying/hindi_gold", name:"हिन्दी गोल्ड",        desc:"retro Bollywood",     url:"https://azuracast.vibesounds.in:8010/radio.mp3"},

  {id:"rp-main",   grp:"rp", type:"direct", meta:"rp", chan:0, name:"RP Main Mix", desc:"eclectic flagship", url:"https://stream.radioparadise.com/aac-320"},
  {id:"rp-mellow", grp:"rp", type:"direct", meta:"rp", chan:1, name:"RP Mellow",   desc:"laid-back mix",     url:"https://stream.radioparadise.com/mellow-320"},
  {id:"rp-rock",   grp:"rp", type:"direct", meta:"rp", chan:2, name:"RP Rock",     desc:"harder edge",       url:"https://stream.radioparadise.com/rock-320"},
  {id:"rp-global", grp:"rp", type:"direct", meta:"rp", chan:3, name:"RP Global",   desc:"world rhythms",     url:"https://stream.radioparadise.com/global-320"},

  {id:"groovesalad", grp:"soma", type:"direct", meta:"soma", name:"Groove Salad",    desc:"ambient downtempo", url:"https://ice1.somafm.com/groovesalad-128-mp3"},
  {id:"dronezone",   grp:"soma", type:"direct", meta:"soma", name:"Drone Zone",      desc:"atmospheric space", url:"https://ice1.somafm.com/dronezone-128-mp3"},
  {id:"secretagent", grp:"soma", type:"direct", meta:"soma", name:"Secret Agent",    desc:"spy jazz lounge",   url:"https://ice1.somafm.com/secretagent-128-mp3"},
  {id:"defcon",      grp:"soma", type:"direct", meta:"soma", name:"DEF CON Radio",   desc:"music for hacking", url:"https://ice1.somafm.com/defcon-128-mp3"},
  {id:"indiepop",    grp:"soma", type:"direct", meta:"soma", name:"Indie Pop Rocks", desc:"indie pop",         url:"https://ice1.somafm.com/indiepop-128-mp3"}
];

const GROUPS = [
  {id:"kn",   label:"Kannada", native:"ಕನ್ನಡ", lang:"kn"},
  {id:"hi",   label:"Hindi",   native:"हिन्दी", lang:"hi"},
  {id:"rp",   label:"Radio Paradise"},
  {id:"soma", label:"SomaFM"}
];

const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
const LS = {last:"radioos:last", vol:"radioos:vol", favs:"radioos:favs"};

const $ = id => document.getElementById(id);
const audio = $("audio");
let current=null, hls=null, pollTimer=null, pollSeq=0;
let filterGrp="all", query="";
let favs = load(LS.favs, []);

function load(k,def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch(e){ return def; } }
function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
const byId = id => STATIONS.find(s=>s.id===id);
const isFav = id => favs.includes(id);

/* ---------- chips ---------- */
function buildChips(){
  const host=$("chips");
  const defs=[{id:"all",label:"All"},{id:"fav",label:"★ Favorites"},
    ...GROUPS.map(g=>({id:g.id,label:g.label,native:g.native}))];
  host.innerHTML="";
  defs.forEach(d=>{
    const c=document.createElement("button");
    c.className="chip"+(d.id===filterGrp?" active":"");
    c.dataset.grp=d.id;
    c.innerHTML = d.native ? `<span class="native">${d.native}</span>${d.label}` : d.label;
    c.addEventListener("click",()=>{ filterGrp=d.id; buildChips(); render(); });
    host.appendChild(c);
  });
}

/* ---------- render preset bands ---------- */
function matches(s){
  if(filterGrp==="fav" && !isFav(s.id)) return false;
  if(filterGrp!=="all" && filterGrp!=="fav" && s.grp!==filterGrp) return false;
  if(query){
    const q=query.toLowerCase();
    const g=GROUPS.find(x=>x.id===s.grp);
    const hay=(s.name+" "+s.desc+" "+(g?g.label:"")).toLowerCase();
    if(!hay.includes(q)) return false;
  }
  return true;
}
function render(){
  const host=$("bands"); host.innerHTML="";
  let shown=0;
  GROUPS.forEach(g=>{
    const list=STATIONS.filter(s=>s.grp===g.id && matches(s));
    if(!list.length) return;
    shown+=list.length;
    const band=document.createElement("div"); band.className="band";
    const nat=g.native?`<span class="native" lang="${g.lang}">${g.native}</span>`:"";
    band.innerHTML=`<div class="band-label">${nat}${g.label}</div>`;
    const grid=document.createElement("div"); grid.className="presets";
    list.forEach(s=>grid.appendChild(card(s,g)));
    band.appendChild(grid); host.appendChild(band);
  });
  if(!shown) host.innerHTML=`<div class="empty">No stations match "${query}"</div>`;
  syncActive();
}
function card(s,g){
  const b=document.createElement("button");
  b.className="preset"; b.id="preset-"+s.id;
  const nameLang=(g.id==="kn"||g.id==="hi")?` lang="${g.lang}"`:"";
  b.innerHTML=
    `<div class="p-name"${nameLang}>${s.name}</div>`+
    `<div class="p-desc">${s.desc}</div>`+
    `<button class="p-fav${isFav(s.id)?" on":""}" aria-label="Toggle favorite" title="Favorite">${isFav(s.id)?"★":"☆"}</button>`+
    `<span class="p-eq" aria-hidden="true"><span></span><span></span><span></span></span>`;
  b.addEventListener("click",e=>{
    if(e.target.closest(".p-fav")){ toggleFav(s.id); return; }
    tune(s);
  });
  return b;
}

/* ---------- favorites ---------- */
function toggleFav(id){
  if(isFav(id)) favs=favs.filter(x=>x!==id); else favs=[...favs,id];
  save(LS.favs,favs);
  render(); syncHeroFav();
}
function syncHeroFav(){
  const f=$("fav-hero");
  const on=current&&isFav(current.id);
  f.classList.toggle("on",!!on);
  f.textContent=on?"★":"☆";
  f.style.visibility=current?"visible":"hidden";
}

/* ---------- hls loader ---------- */
function ensureHls(){
  if(window.Hls) return Promise.resolve();
  return new Promise((res,rej)=>{
    const s=document.createElement("script");
    s.src=HLS_CDN; s.onload=res; s.onerror=()=>rej(new Error("hls.js failed"));
    document.head.appendChild(s);
  });
}

/* ---------- tuning ---------- */
async function tune(station){
  if(current && current.id===station.id){ togglePlay(); return; }
  current=station; save(LS.last,station.id);
  $("station-name").textContent=station.desc||station.name;
  $("badge").textContent=(station.grp==="kn"?"KANNADA":station.grp==="hi"?"HINDI":station.grp==="rp"?"PARADISE":"SOMAFM");
  setMeta(station.name,"","");
  setArt(null,station);
  setBeacon("buffering"); setStatus("tuning…");
  syncActive(); syncHeroFav(); updateMini();
  teardown();
  try{
    if(station.type==="hls" && !audio.canPlayType("application/vnd.apple.mpegurl")){
      await ensureHls();
      if(current.id!==station.id) return;
      hls=new Hls({liveDurationInfinity:true,enableWorker:true});
      hls.on(Hls.Events.ERROR,(_,d)=>{ if(d.fatal){ setStatus("stream error"); setMeta("Stream unavailable","try another preset",""); }});
      hls.on(Hls.Events.FRAG_PARSING_METADATA,(_,data)=>{  // in-stream ID3 (best-effort; AIR may not send it)
        try{
          for(const s of (data.samples||[])){
            const tag=parseID3(s.data||s.unit); if(!tag) continue;
            if((tag.title||tag.artist) && current && current.id===station.id){
              setMeta(tag.title||station.name, tag.artist||"", "");
              updateMedia(tag.title,tag.artist,station.name,null); updateMini();
              break;
            }
          }
        }catch(e){}
      });
      hls.loadSource(station.url); hls.attachMedia(audio);
    } else {
      audio.src=station.url;
    }
    await audio.play().catch(()=>setStatus("tap play to start"));
  }catch(e){
    setStatus("stream error"); setMeta("Stream unavailable","try another preset","");
  }
  if(station.meta) startPolling(station); else stopPolling();
}
function teardown(){
  stopPolling();
  if(hls){ hls.destroy(); hls=null; }
  try{ audio.pause(); }catch(e){}
  audio.removeAttribute("src");
}
function togglePlay(){
  if(!current){ const first=STATIONS.find(matches)||STATIONS[0]; if(first) tune(first); return; }
  if(audio.paused) audio.play().catch(()=>{}); else audio.pause();
}
function step(dir){
  const list=STATIONS.filter(matches);
  if(!list.length) return;
  let i=current?list.findIndex(s=>s.id===current.id):-1;
  i=(i+dir+list.length)%list.length;
  tune(list[i]);
}

audio.addEventListener("playing",()=>{
  setBeacon("live");
  setPlayIcon(true);
  const g=current&&current.grp;
  setStatus(current&&current.type==="hls"?"HLS · AAC":(current&&current.meta==="rp"?"AAC 320":"LIVE"));
  markPlaying(true);
});
audio.addEventListener("pause",()=>{ setBeacon(""); setPlayIcon(false); setStatus("paused"); markPlaying(false); });
audio.addEventListener("waiting",()=>setBeacon("buffering"));
audio.addEventListener("error",()=>{ if(!current)return; if(!audio.src)return; /* ignore spurious empty-src/teardown errors */ setStatus("stream error"); setMeta("Stream unavailable","try another preset",""); });

$("play").addEventListener("click",togglePlay);
$("mplay").addEventListener("click",togglePlay);
$("prev").addEventListener("click",()=>step(-1));
$("next").addEventListener("click",()=>step(1));
$("fav-hero").addEventListener("click",()=>{ if(current) toggleFav(current.id); });
$("search").addEventListener("input",e=>{ query=e.target.value.trim(); render(); });

/* volume + persistence */
const savedVol=load(LS.vol,80);
$("vol").value=savedVol; audio.volume=savedVol/100;
$("vol").addEventListener("input",e=>{ audio.volume=e.target.value/100; save(LS.vol,+e.target.value); });

/* keyboard */
document.addEventListener("keydown",e=>{
  if(e.target.tagName==="INPUT") return;
  if(e.code==="Space"){ e.preventDefault(); togglePlay(); }
  else if(e.code==="ArrowRight") step(1);
  else if(e.code==="ArrowLeft") step(-1);
  else if(e.code==="ArrowUp"){ e.preventDefault(); nudgeVol(5); }
  else if(e.code==="ArrowDown"){ e.preventDefault(); nudgeVol(-5); }
});
function nudgeVol(d){ const v=Math.max(0,Math.min(100,+$("vol").value+d)); $("vol").value=v; audio.volume=v/100; save(LS.vol,v); }

/* ---------- ui sync ---------- */
function setBeacon(state){ const b=$("beacon"); b.classList.remove("live","buffering"); if(state)b.classList.add(state); }
function setPlayIcon(playing){
  const html=playing?"&#10073;&#10073;":"&#9654;";
  $("play").innerHTML=html; $("mplay").innerHTML=html;
  $("play").setAttribute("aria-label",playing?"Pause":"Play");
}
function markPlaying(on){
  document.querySelectorAll(".preset").forEach(p=>p.classList.remove("playing"));
  $("art").classList.toggle("playing",on);
  if(on&&current){ const el=$("preset-"+current.id); if(el) el.classList.add("playing"); }
}
function syncActive(){
  document.querySelectorAll(".preset").forEach(p=>p.classList.remove("active"));
  if(current){ const el=$("preset-"+current.id); if(el) el.classList.add("active"); }
}

/* ---------- now playing (RP / Soma only) ---------- */
function startPolling(station){
  stopPolling(); const seq=++pollSeq;
  const loop=async()=>{ if(seq!==pollSeq)return; await fetchNP(station,seq); if(seq===pollSeq) pollTimer=setTimeout(loop,15000); };
  loop();
}
function stopPolling(){ clearTimeout(pollTimer); pollSeq++; }
async function fetchNP(station,seq){
  try{
    let title="",artist="",album="",art=null;
    if(station.meta==="rp"){
      const d=await (await fetch("https://api.radioparadise.com/api/now_playing?chan="+station.chan,{cache:"no-store"})).json();
      title=d.title||""; artist=d.artist||""; album=d.album||"";
      art=d.cover?(d.cover.startsWith("http")?d.cover:"https://img.radioparadise.com/"+d.cover):null;
    }else if(station.meta==="soma"){
      const d=await (await fetch("https://somafm.com/songs/"+station.id+".json",{cache:"no-store"})).json();
      const s=(d.songs&&d.songs[0])||{}; title=s.title||""; artist=s.artist||""; album=s.album||"";
    }else if(station.meta==="azura"){
      const d=await (await fetch(station.np,{cache:"no-store"})).json();
      const s=(d.now_playing&&d.now_playing.song)||{}; title=s.title||""; artist=s.artist||""; art=s.art||null;
    }else if(station.meta==="radiojar"){
      const d=await (await fetch(station.np,{cache:"no-store"})).json();
      title=d.title||""; artist=d.artist||""; album=d.album||""; art=d.thumb||null;
    }
    if(seq!==pollSeq)return;
    setMeta(title||station.name, artist, album);
    setArt(art, station);
    updateMedia(title,artist,station.name,art); updateMini();
  }catch(e){ if(seq!==pollSeq)return; setMeta(station.name,"live stream",""); }
}

function setMeta(t,a,al){ $("np-title").textContent=t; $("np-artist").textContent=a; $("np-album").textContent=al; updateMini(); }
function setArt(url,station){
  const art=$("art"), glyph=$("art-glyph");
  art.classList.remove("noart");
  if(url){
    glyph.style.display="none";
    let img=art.querySelector("img");
    if(!img){ img=document.createElement("img"); img.alt="Album art"; art.insertBefore(img,art.firstChild); }
    img.onerror=()=>{ img.remove(); glyph.style.display=""; glyph.textContent=initial(station); art.classList.add("noart"); };
    img.src=url;
  }else{
    const img=art.querySelector("img"); if(img) img.remove();
    glyph.style.display=""; glyph.textContent=station?initial(station):"●";
    art.classList.add("noart");
  }
}
function initial(st){ const m=(st.desc||st.name).replace(/^RP /,"").match(/[A-Za-z0-9]/); return m?m[0].toUpperCase():"♪"; }

function updateMini(){
  if(!current) return;
  $("mini").classList.add("show");
  $("m-title").textContent=$("np-title").textContent;
  const sub=$("np-artist").textContent||current.desc||"";
  $("m-sub").textContent=sub;
  const art=$("art").querySelector("img");
  const m=$("m-art");
  if(art){ m.innerHTML=""; const i=document.createElement("img"); i.src=art.src; m.appendChild(i); }
  else m.textContent=initial(current);
}

function updateMedia(title,artist,stationName,cover){
  if(!("mediaSession"in navigator))return;
  navigator.mediaSession.metadata=new MediaMetadata({
    title:title||stationName,artist:artist||"",album:stationName,
    artwork:cover?[{src:cover,sizes:"500x500",type:"image/jpeg"}]:[]
  });
  navigator.mediaSession.setActionHandler("play",()=>audio.play());
  navigator.mediaSession.setActionHandler("pause",()=>audio.pause());
  navigator.mediaSession.setActionHandler("previoustrack",()=>step(-1));
  navigator.mediaSession.setActionHandler("nexttrack",()=>step(1));
}
function setStatus(t){ $("status").textContent=t; }

/* ---------- minimal ID3v2 parser (HLS timed metadata) ---------- */
function decodeText(enc,b){
  try{
    if(enc===1||enc===2) return new TextDecoder("utf-16").decode(b);
    if(enc===3) return new TextDecoder("utf-8").decode(b);
    return new TextDecoder("iso-8859-1").decode(b);
  }catch(e){ let s=""; for(const c of b) s+=String.fromCharCode(c); return s; }
}
function parseID3(bytes){
  if(!bytes||bytes.length<10) return null;
  let off=-1;
  for(let i=0;i<bytes.length-3;i++){ if(bytes[i]===0x49&&bytes[i+1]===0x44&&bytes[i+2]===0x33){ off=i; break; } }
  if(off<0) return null;
  const ver=bytes[off+3], synch=ver>=4, end=bytes.length, out={};
  let p=off+10;
  const sz=(a,b,c,d)=> synch ? ((a<<21)|(b<<14)|(c<<7)|d) : ((a<<24)|(b<<16)|(c<<8)|d);
  while(p+10<=end){
    const id=String.fromCharCode(bytes[p],bytes[p+1],bytes[p+2],bytes[p+3]);
    if(!/^[A-Z0-9]{4}$/.test(id)) break;
    const size=sz(bytes[p+4],bytes[p+5],bytes[p+6],bytes[p+7]);
    if(size<=0||p+10+size>end) break;
    const enc=bytes[p+10];
        const raw=decodeText(enc,bytes.slice(p+11,p+10+size));
    const text=raw.replace(/[\x00-\x1F]+/g," ").replace(/\s+/g," ").trim();
    if(id==="TIT2") out.title=text;
    else if(id==="TPE1") out.artist=text;
    else if(id==="TXXX" && !out.title){ const parts=raw.split("\x00").filter(Boolean); out.title=(parts[parts.length-1]||"").replace(/[\x00-\x1F]+/g," ").trim(); }
    p+=10+size;
  }
  return out;
}

/* ---------- clock ---------- */
function tick(){ $("clock").textContent=new Date().toTimeString().slice(0,5); }
tick(); setInterval(tick,15000);

/* ---------- boot ---------- */
buildChips(); render(); syncHeroFav();
const lastId=load(LS.last,null);
if(lastId){ const s=byId(lastId); if(s){ current=s; $("station-name").textContent=s.desc||s.name;
  $("badge").textContent=(s.grp==="kn"?"KANNADA":s.grp==="hi"?"HINDI":s.grp==="rp"?"PARADISE":"SOMAFM");
  setMeta(s.name,"press play","");
  setArt(null,s); syncActive(); syncHeroFav(); updateMini(); setStatus("ready"); } }