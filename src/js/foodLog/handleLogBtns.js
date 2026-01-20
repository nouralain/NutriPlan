import { navAnchor } from '../main.js';
import handleSections from './../hideSection.js';


export default function handleLogBtns(btn,i){
        const route = btn.dataset.route;

     history.pushState({ section: route }, "", `?section=${route}`);
   handleSections(i)
     navAnchor.forEach((l) =>{
          l.classList.add("text-gray-600", "hover:bg-gray-50")
          l.classList.remove("text-emerald-700","bg-emerald-50")
        });
         navAnchor[i].classList.remove("text-gray-600", "hover:bg-gray-50")
         navAnchor[i].classList.add("text-emerald-700","bg-emerald-50")
   
}