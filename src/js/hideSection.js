export default function handleSections(i) {
  const sections = document.querySelectorAll("section");
const header=document.getElementById("header-title")
  sections.forEach((section) => {
    section.classList.add("hidden");

  });
  switch (i) {
    case 0:
     returnToDefault()

      document
        .getElementById("search-filters-section")
        .classList.remove("hidden");
        
      document
        .getElementById("meal-categories-section")
        .classList.remove("hidden");
      document.getElementById("all-recipes-section").classList.remove("hidden");
      header.innerHTML=` 
         
                <h1 class="text-2xl font-bold text-gray-900">
                  Meals & Recipes
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  Discover delicious and nutritious recipes tailored for you
                </p>
             `
      document.getElementById("products-section").classList.add("hidden");
      document.getElementById("foodlog-section").classList.add("hidden");

      break;

    case 1:
       
returnToDefault()
      document.getElementById("products-section").classList.remove("hidden");
      header.innerHTML=`
         
             
                <h1 class="text-2xl font-bold text-gray-900">Product Scanner</h1>
                <p class="text-sm text-gray-500 mt-1">Search packaged foods by name or barcode</p>
            `
      document.getElementById("search-filters-section").classList.add("hidden");
      document
        .getElementById("meal-categories-section")
        .classList.add("hidden");
      document.getElementById("all-recipes-section").classList.add("hidden");
      document.getElementById("foodlog-section").classList.add("hidden");

      break;

    case 2:
 returnToDefault()
      header.innerHTML=`
          
         
                <h1 class="text-2xl font-bold text-gray-900">Food Log</h1>
                <p class="text-sm text-gray-500 mt-1">Track your daily nutrition and food intake</p>
             `
              document.getElementById("foodlog-section").classList.remove("hidden");

      document.getElementById("products-section").classList.add("hidden");
      document.getElementById("search-filters-section").classList.add("hidden");
      document
        .getElementById("meal-categories-section")
        .classList.add("hidden");
      document.getElementById("all-recipes-section").classList.add("hidden");
      break;
  }
}
function returnToDefault(){
  document.getElementById("products-count").innerText =
      `Search for products to see results`;
 document.querySelector("#barcode-input").value=null
  document.querySelector("#product-search-input").value=null
        document.getElementById("products-empty").classList.remove("hidden");
    document.getElementById("products-grid").classList.add("hidden");
}