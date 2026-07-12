const PLAN=[
 {phase:"Phase 01",days:"Days 1–30",title:"Foundations",goal:"Get fluent at the command line, refresh C, master git, and build + boot your first kernel in the VM you already have.",
  weeks:[
   {t:"Command-line & environment fluency",tasks:[
     {tag:"course",h:'Audit <a href="https://training.linuxfoundation.org/training/introduction-to-linux-lfs101x/" target="_blank" rel="noopener">LFS101 Introduction to Linux</a> — chapters 1–6'},
     {tag:"build",h:"Live in the shell: pipes, grep, find, ps, top, systemctl, journalctl — no GUI for a day"},
     {tag:"read",h:'Skim <code>man</code> for 10 core tools; write yourself a one-page cheat sheet'},
     {tag:"build",h:"Set up tmux + your editor (vim/emacs/vscode) the way you'll use it for 90 days"},
   ]},
   {t:"C refresh for kernel work",tasks:[
     {tag:"read",h:"Refresh pointers, structs, bitwise ops, function pointers — the kernel's daily bread"},
     {tag:"build",h:"Write 3 small C programs: a linked list, a bitmask flag parser, a string tokenizer"},
     {tag:"read",h:'Read <code>Documentation/process/coding-style.rst</code> — the kernel\'s C dialect'},
     {tag:"build",h:"Compile with <code>gcc -Wall -Wextra</code>; fix every warning"},
   ]},
   {t:"Git & the patch mindset",tasks:[
     {tag:"course",h:'Start <a href="https://training.linuxfoundation.org/training/a-beginners-guide-to-open-source-software-development-lfd102/" target="_blank" rel="noopener">LFD102</a> — open source etiquette & licensing'},
     {tag:"build",h:"Practice: branch, commit, rebase -i, format-patch, send-email (to yourself)"},
     {tag:"read",h:"Learn what a good commit message looks like — read 20 real kernel commits with <code>git log</code>"},
     {tag:"build",h:"Clone the mainline tree: <code>git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git</code>"},
   ]},
   {t:"Build & boot your first kernel",tasks:[
     {tag:"build",h:'<code>make defconfig</code> → <code>nice -n 19 make</code> → boot with <code>~/kernel-vm/boot.sh arch/x86/boot/bzImage</code>'},
     {tag:"build",h:"Change <code>CONFIG_LOCALVERSION</code>, rebuild, confirm the new <code>uname -r</code> inside the VM"},
     {tag:"read",h:'Read <code>Documentation/admin-guide/README.rst</code> and the kbuild basics'},
     {tag:"build",h:"Break something on purpose (bad config), read the failure, fix it — learn the loop"},
   ]},
  ]},
 {phase:"Phase 02",days:"Days 31–60",title:"Kernel internals & reading code",goal:"Understand how the kernel is put together, write loadable modules, and get comfortable reading unfamiliar subsystem code.",
  weeks:[
   {t:"LFD103 + the big picture",tasks:[
     {tag:"course",h:'Work through <a href="https://training.linuxfoundation.org/training/a-beginners-guide-to-linux-kernel-development-lfd103/" target="_blank" rel="noopener">LFD103</a> — modules 1–4'},
     {tag:"read",h:"Robert Love, <em>Linux Kernel Development</em> — ch. 1–3 (intro, process management)"},
     {tag:"watch",h:"Watch one kernel-internals overview lecture end to end"},
   ]},
   {t:"Write kernel modules",tasks:[
     {tag:"read",h:'Follow the <a href="https://sysprog21.github.io/lkmpg/" target="_blank" rel="noopener">Kernel Module Programming Guide</a> — hello world → char device'},
     {tag:"build",h:"Build & <code>insmod</code> a module in the VM; watch it in <code>dmesg</code>"},
     {tag:"build",h:"Write a module exposing a <code>/proc</code> or <code>sysfs</code> entry you can read/write"},
     {tag:"read",h:"LFD103 modules 5–7"},
   ]},
   {t:"Reading real subsystem code",tasks:[
     {tag:"read",h:"Pick ONE subsystem you like (e.g. a driver in <code>drivers/staging/</code>) and read it top to bottom"},
     {tag:"build",h:"Use <code>cscope</code>/<code>ctags</code> or the LXR web index to trace a function call chain"},
     {tag:"read",h:"Love book ch. 4–5 (scheduling, syscalls); an LWN article on the same area"},
     {tag:"build",h:"Add a <code>printk</code> to a real code path, rebuild, boot, and watch it fire in the VM"},
   ]},
   {t:"Debugging & tooling",tasks:[
     {tag:"build",h:"Trigger and read a kernel oops in the VM; learn to decode the stack trace"},
     {tag:"build",h:"Run <code>scripts/checkpatch.pl --strict</code> on a random file — read what it flags"},
     {tag:"read",h:"Learn <code>ftrace</code> / <code>dmesg</code> / <code>gdb</code>-on-qemu basics"},
     {tag:"read",h:'Read <code>Documentation/process/submitting-patches.rst</code> fully — you\'ll live by it soon'},
   ]},
  ]},
 {phase:"Phase 03",days:"Days 61–90",title:"Your first contribution",goal:"Find a real, small, legitimate fix; produce a clean patch; send it to the right maintainers; survive and act on review.",
  weeks:[
   {t:"Find your first target",tasks:[
     {tag:"read",h:'Do the <a href="https://kernelnewbies.org/FirstKernelPatch" target="_blank" rel="noopener">KernelNewbies First Kernel Patch</a> tutorial start to finish'},
     {tag:"build",h:"Hunt in <code>drivers/staging/</code> with checkpatch for a genuine coding-style or sparse fix"},
     {tag:"build",h:"Use <code>scripts/get_maintainer.pl</code> to find who + which list your change goes to"},
     {tag:"watch",h:'Watch <a href="https://www.youtube.com/results?search_query=greg+kroah-hartman+write+and+submit+your+first+linux+kernel+patch" target="_blank" rel="noopener">GKH: Write &amp; Submit Your First Patch</a>'},
   ]},
   {t:"Craft the patch",tasks:[
     {tag:"build",h:"Make the change; build clean; test it boots in your VM"},
     {tag:"build",h:"<code>git commit</code> with a proper message + <code>Signed-off-by</code>; run checkpatch until silent"},
     {tag:"build",h:"<code>git format-patch</code>; configure <code>git send-email</code> with your SMTP"},
     {tag:"build",h:"Send the patch to YOURSELF first; confirm it applies cleanly with <code>git am</code>"},
   ]},
   {t:"Submit & engage",tasks:[
     {tag:"build",h:"Send the patch to the maintainer + list, CC as get_maintainer says"},
     {tag:"read",h:"Subscribe to the relevant mailing list; read a week of traffic to learn the tone"},
     {tag:"build",h:"Respond to review feedback promptly and politely; send a v2 with a changelog"},
   ]},
   {t:"Iterate & keep going",tasks:[
     {tag:"build",h:"Land it (or keep iterating) — then find a second, slightly harder fix"},
     {tag:"read",h:"Write a short note-to-self: what surprised you, what you'd do faster next time"},
     {tag:"read",h:'Scope a longer path: <a href="https://www.outreachy.org/" target="_blank" rel="noopener">Outreachy</a> / GSoC, or adopt a staging driver'},
     {tag:"build",h:"Set a sustainable cadence (e.g. one patch / fortnight) so month 4 isn't a cliff"},
   ]},
  ]},
];

const plan=document.getElementById('plan');
let idc=0, total=0;
PLAN.forEach((p,pi)=>{
  const sec=document.createElement('section');sec.className='phase';
  sec.innerHTML=`<div class="phase-head">
     <span class="phase-num">${p.phase}</span>
     <h2>${p.title}</h2>
     <span class="phase-days">${p.days}</span>
     <p class="phase-goal">${p.goal}</p></div>`;
  p.weeks.forEach((w,wi)=>{
    const wk=document.createElement('div');wk.className='week';
    const wknum=pi*4+wi+1;
    let lis='';
    w.tasks.forEach(t=>{
      const id='t'+(idc++);total++;
      lis+=`<li class="task" data-id="${id}"><input type="checkbox" id="${id}" aria-label="task">
        <span class="task-body"><span class="txt"><span class="tag ${t.tag}">${t.tag}</span>${t.h}</span><span class="stamp"></span></span></li>`;
    });
    wk.innerHTML=`<div class="week-head"><span class="week-num">WK ${wknum}</span>
      <p class="week-title">${w.t}</p><span class="week-check">0/${w.tasks.length}</span></div>
      <ul class="tasks">${lis}</ul>`;
    sec.appendChild(wk);
  });
  plan.appendChild(sec);
});

const KEY='kernel90.v1';
// state[id] = ISO timestamp string when checked (falsy/absent = unchecked)
let state={};
try{state=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){state={}}
const fmt=iso=>{const d=new Date(iso);if(isNaN(d))return'';
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+
    ' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};

const fill=document.getElementById('fill'),pctNum=document.getElementById('pctNum'),
  doneCount=document.getElementById('doneCount'),totalCount=document.getElementById('totalCount');
totalCount.textContent=total;

function refresh(){
  let done=0;
  document.querySelectorAll('li.task').forEach(li=>{
    const ts=state[li.dataset.id];
    const on=!!ts;
    li.querySelector('input').checked=on;
    li.classList.toggle('done',on);
    li.querySelector('.stamp').textContent=on?('✓ '+fmt(ts)):'';
    if(on)done++;
  });
  document.querySelectorAll('.week').forEach(wk=>{
    const tasks=wk.querySelectorAll('li.task');
    let d=0;tasks.forEach(t=>{if(state[t.dataset.id])d++;});
    wk.querySelector('.week-check').textContent=d+'/'+tasks.length;
    wk.classList.toggle('complete',d===tasks.length&&tasks.length>0);
  });
  const pct=total?Math.round(done/total*100):0;
  fill.style.width=pct+'%';pctNum.textContent=pct+'%';doneCount.textContent=done;
}
document.querySelectorAll('li.task').forEach(li=>{
  li.addEventListener('click',e=>{
    if(e.target.tagName==='A')return;
    const id=li.dataset.id;
    if(state[id])delete state[id]; else state[id]=new Date().toISOString();
    localStorage.setItem(KEY,JSON.stringify(state));refresh();
  });
});
function htmlToMd(h){
  return h.replace(/<code>(.*?)<\/code>/g,'`$1`')
          .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g,'$2 ($1)')
          .replace(/<em>(.*?)<\/em>/g,'*$1*')
          .replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
}
function generateMarkdown(){
  const now=new Date();let done=0,tot=0;
  let out='# 🐧 90 Days to Your First Kernel Patch\n\n';
  out+='> Exported '+fmt(now.toISOString())+' from the interactive tracker.\n';
  out+='> https://mrdee.in/kernel-plan/\n\n';
  let i=0;const body=[];const log=[];
  PLAN.forEach((p,pi)=>{
    body.push('## '+p.phase+' · '+p.days+' · '+p.title);
    body.push('*'+p.goal+'*\n');
    p.weeks.forEach((w,wi)=>{
      body.push('### Week '+(pi*4+wi+1)+' — '+w.t);
      w.tasks.forEach(t=>{
        const id='t'+(i++);const ts=state[id];tot++;
        const line=t.tag.toUpperCase().padEnd(6)+' '+htmlToMd(t.h);
        if(ts){done++;const ds=fmt(ts);
          body.push('- [x] ('+ds+') '+line);
          log.push({ts,text:htmlToMd(t.h)});
        }else body.push('- [ ] '+line);
      });
      body.push('');
    });
  });
  out+='**Progress: '+done+'/'+tot+' ('+Math.round(done/tot*100)+'%)** as of '+fmt(now.toISOString())+'\n\n---\n\n';
  out+=body.join('\n')+'\n---\n\n## 🗓️ Check-in log\n*Newest first.*\n\n';
  if(log.length){log.sort((a,b)=>b.ts.localeCompare(a.ts));
    log.forEach(e=>out+='- **'+fmt(e.ts)+'** — '+e.text+'\n');}
  else out+='- _(no check-ins yet)_\n';
  return out;
}
document.getElementById('dlBtn').addEventListener('click',()=>{
  const blob=new Blob([generateMarkdown()],{type:'text/markdown'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download='kernel-journey.md';document.body.appendChild(a);a.click();
  a.remove();URL.revokeObjectURL(url);
});
document.getElementById('resetBtn').addEventListener('click',()=>{
  if(confirm('Clear all progress? This cannot be undone.')){state={};localStorage.setItem(KEY,JSON.stringify(state));refresh();}
});
refresh();
