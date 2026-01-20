import fetchMeals from "../fetchApi.js";
import displayRecipes from "./displayMeals.js";
import handleTotalMeals from "./numbersOfMeals.js";
import showMealInfo from "./meals-info.js";

// ============================================
// class handles:
// 1-fetching data and store it in property => this.allMealsData
// 2-display this data
// 3-show info of the meal when user clicked on any card
// 4-display filtered data while user search
// 5-display number of meals during changes
// ============================================
export default class Recipies {
  constructor(HTMLcontainer, category) {
    this.HTMLcontainer = HTMLcontainer;
    this.category = category;
    this.searchInput = document.getElementById("search-input");
    this.endPoint = `/search?q=&page=1&limit=25`;
    this.allMealsData = [];
  }
  // method fetch api =>all the data before updating the endpoint again during search
  async getRecipes() {
    this.allMealsData = await fetchMeals(this.endPoint);
    return this.allMealsData;
  }

  // method display all meals
  displayRecipies() {
    const result = displayRecipes(this.allMealsData, this.HTMLcontainer);
    handleTotalMeals(this.allMealsData);
    document.getElementById("recipes-grid").addEventListener("click", (e) => {
      showMealInfo(this.allMealsData, e);
    });

    this.handleSearch();
    this.handleGridBtn();
    return result;
  }

  // method get search value and give it to update endpoint method to update the url
  // and send the new endpoint to the fetch method => to get the new data based on the search
  // then display the new cards
  // then update number of meals displayed
  handleSearch() {
    this.searchInput.addEventListener("input", async () => {
      let search = this.searchInput.value;
      this.updateEndPoint(search);
      await this.getRecipes();
      displayRecipes(this.allMealsData, this.HTMLcontainer);
      handleTotalMeals(this.allMealsData);
    });
  }

  // method to update end point when user search
  updateEndPoint(search) {
    this.endPoint = `/search?q=${search}&page=1&limit=25`;
  }

  handleGridBtn = () => {
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = gridViewBtn.nextElementSibling;
    const recipeCards = document.querySelectorAll(".recipe-card");
    gridViewBtn.addEventListener("click", () => {
      if (!gridViewBtn.classList.contains("bg-white")) {
        gridViewBtn.classList.add("bg-white", "shadow-sm");
        listViewBtn.classList.remove("bg-white", "shadow-sm");

        recipeCards.forEach((card) => {
          card.parentElement.classList.remove("gap-4", "grid-cols-2");
          card.parentElement.classList.add("gap-5", "grid-cols-4");

          card.classList.remove("flex", "flex-row", "h-40");
          card.firstElementChild.classList.remove("w-full", "h-full");
          card.firstElementChild.classList.add("h-48");
          card.firstElementChild.firstElementChild.nextElementSibling.classList.remove(
            "hidden"
          );
        });
      }
    });
    listViewBtn.addEventListener("click", () => {
      if (!listViewBtn.classList.contains("bg-white")) {
        listViewBtn.classList.add("bg-white", "shadow-sm");
        gridViewBtn.classList.remove("bg-white", "shadow-sm");

        recipeCards.forEach((card) => {
          card.parentElement.classList.add("gap-4", "grid-cols-2");
          card.parentElement.classList.remove("gap-5", "grid-cols-4");

          card.classList.add("flex", "flex-row", "h-40");
          card.firstElementChild.classList.add("w-full", "h-full");
          card.firstElementChild.classList.remove("h-48");

          card.firstElementChild.firstElementChild.nextElementSibling.classList.add(
            "hidden"
          );
        });
      }
    });
  };
}
