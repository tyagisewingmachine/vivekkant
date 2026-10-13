(() => {
 const toggle=document.getElementById('menuToggle'),nav=document.getElementById('nav'),bar=document.getElementById('progressBar'),year=document.getElementById('year'),form=document.getElementById('feedbackForm'),status=document.getElementById('formStatus'),toast=document.getElementById('toast');
 if(year) year.textContent=new Date().getFullYear();
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav?.classList.toggle('open',!open)});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
 const progress=()=>{if(bar){const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?scrollY/max*100:0)+'%'}};addEventListener('scroll',progress,{passive:true});progress();
 const items=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -25px 0px'});items.forEach(x=>observer.observe(x))}else items.forEach(x=>x.classList.add('visible'));
 let timer;function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),4200)}
 form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(status)status.textContent='Preview only — nothing has been sent or saved.';showToast('This form is a preview. Connect a form service before accepting real messages.')});
})();
