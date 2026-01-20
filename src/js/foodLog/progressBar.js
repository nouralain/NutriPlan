import { mealNutriMax } from "../meals/meals-info.js";

export default function setProgressBar(){
    if(localStorage.getItem("nutriplan_daily_log")){
      const progressGrid= document.getElementById("progress-bars")
    const logItems=JSON.parse(localStorage.getItem("nutriplan_daily_log"))
    let cartona=``
    let toDayDate= new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .join("-");
    mealNutriMax
    Object.keys(logItems).forEach((day) => {
        console.log(logItems[day],toDayDate,day);
        if(day===toDayDate){
         let {meals, ...totals}= logItems[day]
         console.log(totals);
         
         Object.entries(totals).forEach((key)=>{
          console.log(key[0].split("total").slice(1).join(""));
          console.log(key[1]);
          let formatedKey=key[0].split("total").slice(1).join("")
          console.log(key[1] / mealNutriMax[formatedKey]*100);
          let calcWidth= key[1] / mealNutriMax[formatedKey.toLocaleLowerCase()]*100
          cartona+=`<div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="nutri-name text-sm font-medium text-gray-700">${formatedKey}</span>
                    <span class="progress-percent text-xs ${textColor(calcWidth,formatedKey)}">${Math.ceil(calcWidth)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="bar h-2.5 rounded-full ${bgColor(calcWidth,formatedKey)}" style="width: ${Math.min(calcWidth,100)}%"></div>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="total font-bold ${textColor(calcWidth,formatedKey)}">${key[0]==="totalCalories"?`${key[1]} kcal`:`${key[1]} g` } </span>
                    <span class="max text-gray-400">${formatedKey==="calories"? `/ ${mealNutriMax[formatedKey.toLocaleLowerCase()]} kcal`:`/ ${mealNutriMax[formatedKey.toLocaleLowerCase()]} g`} </span>
                </div>
            </div>`
         })
        }
      });
    
    
    progressGrid.innerHTML=cartona
    }
  }

 function bgColor(calcWidth,formatedKey){
    let bgColor = "";

if (Math.ceil(calcWidth) >= 100) {
  return bgColor = "bg-red-500";
} else {
  switch(formatedKey) {
    case "Calories":
    return  bgColor = "bg-emerald-500";
      
    case "Protein":
    return  bgColor = "bg-blue-500";
      
    case "Fat":
   return   bgColor = "bg-purple-500";
      
    case "Carbs":
    return  bgColor = "bg-amber-500";
      
   
  }
}


 }
 function textColor(calcWidth,formatedKey){
    let textColor = "";

if (Math.ceil(calcWidth) >= 100) {
  return textColor = "text-red-500";
} else {
  switch(formatedKey) {
    case "Calories":
    return  textColor = "text-emerald-600";
      
    case "Protein":
    return  textColor = "text-blue-700";
      
    case "Fat":
   return   textColor = "text-purple-700";
      
    case "Carbs":
    return  textColor = "text-amber-700";
      
   
  }
}


 }