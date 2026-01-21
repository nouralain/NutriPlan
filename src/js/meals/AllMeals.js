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

 
}
