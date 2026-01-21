 /* const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = gridViewBtn.nextElementSibling;
     gridViewBtn.addEventListener("click", () => {
        handleGridBtn(gridViewBtn,listViewBtn)
        }

        listViewBtn.addEventListener("click", () => {
        handleGridBtn(gridViewBtn,listViewBtn)
        }
    
    */
 
 export default function handleGridBtn(gridViewBtn,listViewBtn){
   
    const recipeCards = document.querySelectorAll(".recipe-card");
   
      if (!gridViewBtn.classList.contains("bg-white")) {
        gridViewBtn.classList.add("bg-white", "shadow-sm");
        listViewBtn.classList.remove("bg-white", "shadow-sm");

        recipeCards.forEach((card) => {
          card.parentElement.classList.remove("gap-4", "grid-cols-2");
          card.parentElement.classList.add("gap-5", "grid-cols-4");
          card.classList.remove("flex", "flex-row", "h-40");
          card.firstElementChild.classList.remove("w-48", "h-full","flex-shrink-0");
          card.firstElementChild.classList.add("h-48");
          card.firstElementChild.firstElementChild.nextElementSibling.classList.remove(
            "hidden"
          );
        });
      }
    
   
      
    
  };

  export function handleListBtn(gridViewBtn,listViewBtn){
        const recipeCards = document.querySelectorAll(".recipe-card");

    if (!listViewBtn.classList.contains("bg-white")) {
        listViewBtn.classList.add("bg-white", "shadow-sm");
        gridViewBtn.classList.remove("bg-white", "shadow-sm");

        recipeCards.forEach((card) => {
          card.parentElement.classList.add("gap-4", "grid-cols-2");
          card.parentElement.classList.remove("gap-5", "grid-cols-4");

          card.classList.add("flex", "flex-row", "h-40");
          card.firstElementChild.classList.add("w-48", "h-full","flex-shrink-0");
          card.firstElementChild.classList.remove("h-48");

          card.firstElementChild.firstElementChild.nextElementSibling.classList.add(
            "hidden"
          );
        });
      }
  }