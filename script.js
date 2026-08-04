const SUPABASE_URL='https://iuronvdnglktvzhryjqo.supabase.co';
const SUPABASE_KEY='sb_publishable_OzIuaEhdwtOkpvXb1hbRJw_9EO71bBk';

const grid=document.getElementById('projectGrid');
const errorMessage=document.getElementById('projectError');
const modal=document.getElementById('videoModal');
const modalVideo=document.getElementById('modalVideo');
const modalTitle=document.getElementById('modalTitle');
const modalNote=document.getElementById('modalNote');

async function loadProjects(){
  try{
    const endpoint=`${SUPABASE_URL}/rest/v1/projects?select=*&published=eq.true&order=display_order.asc`;
    const response=await fetch(endpoint,{
      headers:{
        apikey:SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`
      }
    });

    if(!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
    const projects=await response.json();
    renderProjects(projects);
  }catch(error){
    console.error(error);
    grid.innerHTML='';
    errorMessage.hidden=false;
  }
}

function renderProjects(projects){
  grid.innerHTML='';
  projects.forEach(project=>{
    const card=document.createElement('button');
    card.className='project-card';
    card.type='button';

    const image=document.createElement('img');
    image.src=project.cover_url;
    image.alt=project.title;
    image.loading='lazy';

    const overlay=document.createElement('span');
    overlay.className='project-overlay';

    const title=document.createElement('span');
    title.className='project-title';
    title.textContent=project.title;

    card.append(image,overlay,title);
    card.addEventListener('click',()=>openProject(project));
    grid.appendChild(card);
  });
}

function openProject(project){
  modalTitle.textContent=project.title;
  modalNote.textContent=project.note||'';
  modalNote.style.display=project.note?'block':'none';
  modalVideo.src=project.video_url;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  modalVideo.play().catch(()=>{});
}

function closeProject(){
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

document.querySelector('.modal-close').addEventListener('click',closeProject);
modal.addEventListener('click',event=>{if(event.target===modal)closeProject();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeProject();});

loadProjects();
