// Machine à écrire
const texts = ["Aliou AG Moussa Yattara", "Développeur Web & Mobile", "Cloud Enthusiast"];
let i=0,j=0,typing=true;const speed=80;const pause=1200;
const target=document.querySelector('.typing');
function tick(){const t=texts[i];if(typing){target.textContent=t.slice(0,++j);if(j===t.length){typing=false;setTimeout(tick,pause);return;}}else{target.textContent=t.slice(0,--j);if(j===0){typing=true;i=(i+1)%texts.length;}}setTimeout(tick,typing?speed:40);}tick();

// Barres de progression
const bars=document.querySelectorAll('.bar span');
const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){en.target.style.width=en.target.dataset.width;io.unobserve(en.target);}});},{threshold:.6});
bars.forEach(b=>io.observe(b));

// Contact form fallback mailto
const form=document.getElementById('contactForm');form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());window.location.href=`mailto:yaliouagmoussa@gmail.com?subject=Contact%20Portfolio&body=${encodeURIComponent(`${data.name} (${data.email})\n\n${data.message}`)}`;});
// Year
document.getElementById('year').textContent=new Date().getFullYear();
