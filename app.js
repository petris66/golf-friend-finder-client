const BACKEND="https://golf-friend-finder-backend.vercel.app";

const coursesEl=document.getElementById("courses");
const resultsEl=document.getElementById("results");
const playerInput=document.getElementById("player");

async function loadCourses(){
 const r=await fetch("data/courses.json");
 const courses=await r.json();

 coursesEl.innerHTML=Object.entries(courses).map(([id,c])=>`
 <label class="course-label">
 <input type="checkbox" value="${id}">
 <span>${c.name}</span>
 </label>`).join("");
}

function selectedCourses(){
 return [...coursesEl.querySelectorAll("input:checked")].map(x=>x.value);
}

function playerNames(){
 return playerInput.value.toLowerCase()
 .split(",")
 .map(x=>x.trim())
 .filter(Boolean);
}

async function search(){
 const courses=selectedCourses();
 if(!courses.length){
  resultsEl.textContent="Valitse vähintään yksi kenttä.";
  return;
 }

 resultsEl.textContent="Haetaan...";

 const days=Number(document.getElementById("days").value);
 const names=playerNames();
 let html="";

 const start=new Date();

 for(let i=0;i<days;i++){
  const d=new Date(start);
  d.setDate(start.getDate()+i);
  const date=d.toISOString().slice(0,10);

  const r=await fetch(`${BACKEND}/api/search?date=${date}&courses=${courses.join(",")}`);
  const data=await r.json();

  for(const c of data.results||[]){
   for(const p of c.players||[]){
    const name=`${p.firstName||""} ${p.familyName||""}`.trim();
    const lower=name.toLowerCase();

    if(!names.length || names.some(n=>lower.includes(n))){
      html+=`<div class="row"><b>${c.course}</b><br>${name}<br>${p.dateTimeStart||date}</div>`;
    }
   }
  }
 }

 resultsEl.innerHTML=html || "Ei löytynyt pelaajaa.";
}

document.getElementById("search").onclick=search;
document.getElementById("selectAll").onclick=()=>coursesEl.querySelectorAll("input").forEach(x=>x.checked=true);
document.getElementById("clearAll").onclick=()=>coursesEl.querySelectorAll("input").forEach(x=>x.checked=false);

loadCourses();
