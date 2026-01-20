// ============================================
// dynamic method to display number of meals in classes depending on array length
// ============================================
export default function handleTotalMeals(array){
    const currentMeals=  array;     //filtered array or allMeals array
     document.getElementById("recipes-count").innerHTML=` Showing ${currentMeals.length} recipes`
    
  }