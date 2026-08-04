
const modal=document.getElementById('modal');
const video=document.getElementById('modalVideo');
const title=document.getElementById('modalTitle');
const note=document.getElementById('modalNote');

function openProject(card){
  title.textContent=card.dataset.title;
  note.textContent=card.dataset.note||'';
  note.style.display=card.dataset.note?'block':'none';
  video.src=card.dataset.video;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  video.play().catch(()=>{});
}
function closeProject(){
  video.pause();
  video.removeAttribute('src');
  video.load();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('click',()=>openProject(card)));
document.querySelector('.close').addEventListener('click',closeProject);
modal.addEventListener('click',e=>{if(e.target===modal)closeProject()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProject()});
