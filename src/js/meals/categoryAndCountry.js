import fetchMeals from "../fetchApi.js";
import displayRecipes from "./displayMeals.js";
import handleTotalMeals from "./numbersOfMeals.js";
import showMealInfo from "./meals-info.js";

// ============================================
// class handles:
// 1-fetching data of category or country => depending on the endpoint sent when object created
// 2-display this data => depending on which display function in called when obj created
// ============================================
export default class CategoriesِAndCountries {
  constructor(HTMLcontainer, endPoint, recipesContainer) {
    this.HTMLcontainer = HTMLcontainer;
    this.recipesContainer = recipesContainer;
    this.endPoint = `${endPoint}`;
    this.filterdArray = [];
    this.currentMeals = [];
    this.recipesClick()
  }
  //method fetch api of categories or countries
  // => called in display
  async getCategoriesOrCountries() {
    const arr = await fetchMeals(this.endPoint);
    return arr;
  }

  //method display category cards inside the html
  // => called in main
  displayCategories = async () => {
    // ===================== get data of categories ==================
    const categoriesArray = await this.getCategoriesOrCountries();
    // ===============================================================
    //                       DATA RECIVED
    const newwArr = categoriesArray.slice(0, categoriesArray.length - 2); // remove the last 2 indecees

    // ==================== to display cards in HTML==================
    const categoriesCard = newwArr
      .map((obj) => {
        return ` <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category=${obj.name}
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid fa-drumstick-bite"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${obj.name}</h3>
                </div>
              </div>
            </div>`;
      })
      .join("");
    this.HTMLcontainer.innerHTML = categoriesCard;
    // ================================================================
    this.filterMeals(".category-card", "category");
  };

  //   method display category cards inside the html
  // => called in main
  displayCountry = async () => {
    // =====================get data===============================
    const countryArray = await this.getCategoriesOrCountries();
    // =============================================================
    //                          DATA RECIVED

    // =================== add btn to display all meals=============
    countryArray.unshift({
      name: "All Cuisines",
    });
    // ==============================================================

    const shortArr = countryArray.slice(0, 11); //remove 2 indecees

    //====================display country cards=======================
    const countryCard = shortArr
      .map((obj) => {
        return ` <button 
            
              class="country-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-medium text-sm whitespace-nowrap  transition-all"
            >
              ${obj.name}
            </button>`;
      })
      .join("");
      this.HTMLcontainer.innerHTML = countryCard;
      // =================================================================

      // ======call filter function => to display filtered meals directly
    this.filterMeals(".country-btn", "area");
      // ================================================================

    // for adding style to the btn i clicked on
    this.handleCountryEvent();
  };

  // =>called inside displayCountry()
  handleCountryEvent = () => {
    const countryContainer = document.getElementById("countries-container");
    countryContainer.addEventListener("click", (e) => {
      if (e.target.closest(".country-btn")) {
        document.querySelectorAll(".country-btn").forEach((btn) => {
          btn.classList.remove(
            "hover:text-white",
            "hover:bg-emerald-700",
            "text-white",
            "bg-emerald-600"
          );
          btn.classList.add(
            "bg-gray-100",
            "text-gray-700",
            "hover:bg-gray-200"
          );
        });
        const target = e.target.closest(".country-btn");
        target.classList.add(
          "hover:text-white",
          "hover:bg-emerald-700",
          "text-white",
          "bg-emerald-600"
        );
        target.classList.remove(
          "bg-gray-100",
          "text-gray-700",
          "hover:bg-gray-200"
        );
      }
    });
  };
  // method  filter recipes depending on category or country
  // show load spinner b4 fetching data
  // display filtered meals and update number of meals
  filterMeals = (elements, filter) => {
    document.querySelectorAll(elements).forEach((element) => {
      element.addEventListener("click", async () => {
        // ===========================1 (show spinner)  ====================
        this.recipesContainer.innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`;
        // =================================================================

        //==================== 2 (fetch meals array) =======================
        let endpoint;
        if (element.innerText === "All Cuisines") {
          endpoint = "/search?q=&page=1&limit=25";
        } else {
          endpoint = `/filter?${filter}=${element.innerText}&page=1&limit=20`;
        }
        this.filterdArray = await fetchMeals(endpoint);
        this.currentMeals = this.filterdArray;
        // ==================================================================
        //                           DATA RECIVED
        // =================== 3 (remove spinner)============================
        this.recipesContainer.innerHTML = ``;
        // ==================================================================

        // =================== 4 (display filtered meals)====================
        displayRecipes(this.filterdArray, this.recipesContainer);
        //==================================================================

        // ================= 5 (update total meals number)==================
        handleTotalMeals(this.filterdArray);
      });
    });
  };

  // responsible for opening meal info => prevent duplicate event listner
  recipesClick = () => {
  document.getElementById("recipes-grid").addEventListener("click", (e) => {
    showMealInfo(this.currentMeals, e);
  });
};
}
