const featuresList = [
 {name:"Premium UI", price:2000},
 {name:"Animations", price:3000},
 {name:"3D Effects", price:5000},
 {name:"Scroll Effects", price:2500},
 {name:"Micro Interactions", price:2000},
 {name:"Full Website", price:6000},
 {name:"UI",price:1500},
{name:"Animations",price:2000},
{name:"3D",price:3500},
{name:"Scroll",price:1800}
];

let selected=[];
let projects=JSON.parse(localStorage.getItem("projects"))||[];

featuresList.forEach(f=>{
 let d=document.createElement("div");
 d.className="tag";
 d.innerText=f.name;

 d.onclick=()=>{
  d.classList.toggle("active");
  selected.includes(f)?selected=selected.filter(x=>x!=f):selected.push(f);
  calc();
 };

 document.getElementById("features").appendChild(d);
});

function calc(){
 let t=selected.reduce((s,f)=>s+f.price,0);
 t+=parseInt(document.getElementById("deadline").value||0);
 document.getElementById("price").innerText=Math.floor(t);
}

document.getElementById("deadline").onchange=calc;

function openBuilder(){
 document.getElementById("builder").style.display="flex";
}
function closeBuilder(){
 document.getElementById("builder").style.display="none";
 resetForm();
}

function showQR(){
 document.getElementById("qrPanel").style.display="flex";
}

function completePayment(){

 let brand=document.getElementById("brandName").value;
 let f=selected.map(x=>x.name).join(",");
 let p=document.getElementById("price").innerText;

 let data={
  id:"NX"+Math.floor(Math.random()*100000),
  brand,
  features:f,
  price:p,
  status:0
 };

 projects.push(data);
 localStorage.setItem("projects",JSON.stringify(projects));

 document.getElementById("qrPanel").style.display="none";
 document.getElementById("builder").style.display="none";
 resetForm();

 let msg=`Project ID: ${data.id}
Brand: ${brand}
Features: ${f}
₹${p}
Payment Done`;

 window.location.href=`https://wa.me/919319671084?text=${encodeURIComponent(msg)}`;
}

// TRACK
function trackProject(){
 let id=document.getElementById("trackInput").value;
 let p=projects.find(x=>x.id===id);

 if(!p){
  document.getElementById("trackResult").innerText="Not Found";
  return;
 }

 let steps=["Designing","Development","Testing","Delivered"];
 let html="";

 steps.forEach((s,i)=>{
  html+=`<div class="status ${i<=p.status?'activeStatus':''}">${s}</div>`;
 });

 document.getElementById("trackResult").innerHTML=html;
}

// ADMIN (FIXED)
document.addEventListener("keydown",(e)=>{
 if(e.ctrlKey && e.key.toLowerCase()==="k"){
  e.preventDefault();
  openAdminPanel();
 }
});

function openAdminPanel(){

 let panel=document.createElement("div");
 panel.style.position="fixed";
 panel.style.inset="0";
 panel.style.background="rgba(0,0,0,0.95)";
 panel.style.zIndex="2000";
 panel.style.padding="20px";
 panel.style.overflow="auto";

 let html="<h2>Admin Panel</h2>";

 projects.forEach((p,i)=>{
  html+=`
  <div style="margin:10px 0">
    <b>${p.id}</b> - ${p.brand}<br>
    Status: ${["Designing","Development","Testing","Delivered"][p.status]}<br>
    <button onclick="updateStatus(${i})">Next</button>
  </div>`;
 });

 html+=`<button onclick="this.parentElement.remove()">Close</button>`;

 panel.innerHTML=html;
 document.body.appendChild(panel);
}

function updateStatus(i){
 if(projects[i].status<3){
  projects[i].status++;
 }
 localStorage.setItem("projects",JSON.stringify(projects));
 location.reload();
}

function resetForm(){
 selected=[];
 document.querySelectorAll(".tag").forEach(t=>t.classList.remove("active"));
 document.getElementById("brandName").value="";
 document.getElementById("price").innerText="0";
}