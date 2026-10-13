const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".site-nav");
if(menuButton&&nav){menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));}
document.getElementById("year").textContent=new Date().getFullYear();
/* DEMO ONLY: This form does not send or save messages. Connect a form backend before publishing. */
const feedbackForm=document.getElementById("feedback-form");const formStatus=document.getElementById("form-status");
feedbackForm.addEventListener("submit",event=>{event.preventDefault();formStatus.textContent="This demo form is not connected yet. Connect a secure form service before publishing so your message can be delivered privately.";});
