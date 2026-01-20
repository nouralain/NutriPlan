import handleSections from "./../hideSection.js";
import { navAnchor } from "../main.js";


export default class FoodLog {
  constructor() {
    this.foodLogDate = document.getElementById("foodlog-date");
    this.setTodayDateInPage();
    
  }

  handleLogBtns(btn, i) {
    const route = btn.dataset.route;

    history.pushState({ section: route }, "", `?section=${route}`);
    handleSections(i);
    navAnchor.forEach((l) => {
      l.classList.add("text-gray-600", "hover:bg-gray-50");
      l.classList.remove("text-emerald-700", "bg-emerald-50");
    });
    navAnchor[i].classList.remove("text-gray-600", "hover:bg-gray-50");
    navAnchor[i].classList.add("text-emerald-700", "bg-emerald-50");
  }

  todayDate = () => {
    let myDate = new Date()
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
      .split(" ");

    return myDate;
  };

  setTodayDateInPage = () => {
    let todayDate=this.todayDate()
    this.foodLogDate.innerHTML = `${todayDate[0]} ${todayDate[1]} ${todayDate[2]}
`;
  };

  

 
}

