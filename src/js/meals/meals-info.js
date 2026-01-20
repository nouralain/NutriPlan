import calcMealNutriPercentage from "./../product-scanner/calcNutriPercentage.js";
import setProgressBar from './../foodLog/progressBar.js';

export let servingsValue = 1;
export const mealNutriMax = {
    calories: 2000,
    protein: 50,
    fat: 65,
    carbs: 250,
    sugar: 20,
    fiber: 10,
    saturatedFat: 20,
  };
// =====================================================================
// dynamic method to show meal info when user clicked on any meal =>in all meal classes
// main function
// =====================================================================
export default async function showMealInfo(allDataArray, e) {
  // =================event delagation==================================
  if (e.target.closest(".recipe-card")) {
    //============1 (to hide all meal to show the meal info)===============
    hideAllMeals();
    //=====================================================================

    //============2 (to find the INDEX of the card i clicked on)===========
    const mealId = e.target.closest(".recipe-card").dataset.mealId; //capture the clicked card data-mealId => id
    const index = allDataArray.findIndex((item) => item.id == mealId); //search for the index with this id
    const meal = allDataArray[index];
    //======================================================================

    //===========3 (display the meal info section)==========================
    let {
      name,
      area,
      category,
      ingredients,
      instructions,
      thumbnail,
      youtube,
      id,
    } = meal;
    //transform the url to iframe url
    const iframUrl = youtube.replace("watch?v=", "embed/");
    const sectionDesign = `<div class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button
            id="back-to-meals-btn"
            class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <!-- Hero Section recipe details-->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img
                src=${thumbnail}
                alt=${name}
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >Casserole</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">Calculating...</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- log meal button Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              id="log-meal-btn"
              class="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all"
              data-meal-id=${id}
            >
            <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Calculating...</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${ingredients.length} items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                 ${ingredients
                   .map((ing, index) => {
                     return `<div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${ingredients[index].measure}</span> ${ingredients[index].ingredient}
                      
                    </span>
                  </div>`;
                   })
                   .join("")}
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                 
                  ${instructions
                    .map((inst, index) => {
                      return ` <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      ${index + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      ${instructions[index]}
                    </p>
                  </div>`;
                    })
                    .join("")}
                </div>
              </div>

              <!-- Video Section -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src=${iframUrl}
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <i class="animate-pulse text-emerald-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-calculator" data-prefix="fas" data-icon="calculator" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm16 168a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM88 352a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM64 424c0-13.3 10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 448c-13.3 0-24-10.7-24-24zm232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z"></path></svg></i>
                </div>
                <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    document.getElementById("meal-details").innerHTML = sectionDesign;

    //             GET NUTRITION DATA TO DISPLAY IN MEAL INFO
    sendDataToApi(name, ingredients, thumbnail, index).then((data) => {
      let rawData = data;
      //                        $$$$$DATA RECIVED$$$$$$
      // update the NUTRITION CARD in the meal info section
      updateNutri(rawData);
      let selectedMeal = meal;
      let nutrients = rawData.data.perServing;
      

      //everything related to LOG btn => creating modal & displaying it & handling modal inner btns
      handleLogBtn(nutrients, name, thumbnail, selectedMeal);
    });

    //handle back btn in the meal info
    handleBackBtn();
    //======================================================================
  }
}

//==========================================================================
//                        MEAL INFO RELATED FUNCTIONS
// function to return back when click on back btn
function hideAllMeals() {
  document.getElementById("search-filters-section").classList.add("hidden");
  document.getElementById("meal-categories-section").classList.add("hidden");
  document.getElementById("all-recipes-section").classList.add("hidden");
  document.getElementById("products-section").classList.add("hidden");
  document.getElementById("meal-details").classList.remove("hidden");
}
// function hide meal info section and show all other sections
function handleBackBtn() {
  const backBtn = document.getElementById("back-to-meals-btn");
  backBtn.addEventListener("click", () => {
    document
      .getElementById("search-filters-section")
      .classList.remove("hidden");
    document
      .getElementById("meal-categories-section")
      .classList.remove("hidden");
    document.getElementById("all-recipes-section").classList.remove("hidden");
    document.getElementById("meal-details").classList.add("hidden");
  });
}
// function send ingredients from mealsArray and recive nutrition details about this meal
async function sendDataToApi(name, ingredients) {
  // format the needed array
  const result = ingredients.map(
    ({ ingredient, measure }) => measure + " " + ingredient, //reverse the keys of the array
  );

  try {
    let resp = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "xJf0wMxPQU0m8hZatnEgZiJsO6I3nKXbOpjt3eVf",
        },
        body: JSON.stringify({
          title: `${name}`,
          ingredients: result,
        }),
      },
    );
    if (resp.ok === false) {
      throw new Error(`Request failed with status ${resp.status}`);
    } else {
      //100% data recived
      const data = await resp.json();

      return data;
    }
  } catch (error) {
    console.error("fetchMeals error:", error.message);
  }
}
// function update nutrition card with the data of the clicked meal
function updateNutri(nutriData) {
  const nutriContainer = document.getElementById("nutrition-facts-container");
  const caloriesContainer = document.getElementById("hero-calories");
  const logBtn = document.getElementById("log-meal-btn");
  // to get the width of each bar
  
  // to change the style of log btn when data recived
  logBtn.classList.add("hover:bg-blue-700");
  logBtn.classList.remove("cursor-not-allowed");
  logBtn.classList.replace("bg-gray-300", "bg-blue-600");
  logBtn.classList.replace("text-gray-500", "text-white");
  logBtn.innerHTML = `<i class="fa-solid fa-clipboard-list"></i>
<span>Log This Meal</span>`;
  // ==================Display new nutri card===============================
  const {
    calories,
    protein,
    sodium,
    cholesterol,
    saturatedFat,
    sugar,
    fiber,
    carbs,
    fat,
  } = nutriData.data.perServing;

  caloriesContainer.innerHTML = `${calories} cal/serving`;
  nutriContainer.innerHTML = `<p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: cal ${
                      nutriData.data.totals.calories
                    }</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${calcMealNutriPercentage(
                          protein,
                          mealNutriMax.protein,
                        )}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${calcMealNutriPercentage(
                          carbs,
                          mealNutriMax.carbs,
                        )}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: ${calcMealNutriPercentage(
                          fat,
                          mealNutriMax.fat,
                        )}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: ${calcMealNutriPercentage(
                          fiber,
                          mealNutriMax.fiber,
                        )}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: ${calcMealNutriPercentage(
                          sugar,
                          mealNutriMax.sugar,
                        )}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${saturatedFat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${calcMealNutriPercentage(
                      saturatedFat,
                      mealNutriMax.saturatedFat,
                    )}%"></div>
                </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${sodium}mg</span>
                    </div>
                </div>
            </div>
                  </div>`;
}
//==========================================================================

//==========================================================================
//                 LOG BUTTON MODAL RELATED FUNCTIONS
//function create modal when log btn clicked
function handleLogBtn(nutriData, name, imageUrl, selectedMeal) {
  const logBtn = document.getElementById("log-meal-btn");
  logBtn.addEventListener("click", () => {
    const { calories, protein, carbs, fat } = nutriData;
    const modal = document.createElement("div");
    modal.classList.add(
      "fixed",
      "inset-0",
      "bg-black/50",
      "flex",
      "items-center",
      "justify-center",
      "z-50",
    );
    modal.id = "log-meal-modal";
    document.body.appendChild(modal);
    modal.innerHTML = ` <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src=${imageUrl} alt=${name} class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${name}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" fdprocessedid="raao1l">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2" fdprocessedid="nv3d9">
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" fdprocessedid="fraykm">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                        </button>
                    </div>
                </div>
                
                
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${calories}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${protein}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${carbs}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${fat}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all" fdprocessedid="f5b79w">
                        Cancel
                    </button>
                    <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" fdprocessedid="rggyjo">
                        <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                        Log Meal
                    </button>
                </div>
            </div>`;
    //to handle all modal buttons after its created in DOM
    handleInnerModalBtns(nutriData, selectedMeal, modal);
  });
}
// function to handle every btn in the modal
function handleInnerModalBtns(nutriData, selectedMeal, modal) {
  // ==================== cancel btn =======================================
  document.getElementById("cancel-log-meal").addEventListener("click", () => {
    modal.remove();
  });
  // ==========================================================================

  // ======================close modal when clicked out========================
  document.getElementById("log-meal-modal").addEventListener("click", (e) => {
    e.target === modal && modal.remove();
  });
  // ===========================================================================

  // ================increase or decrease serving input value===================
  const input = document.getElementById("decrease-servings").nextElementSibling;
  document.getElementById("decrease-servings").addEventListener("click", () => {
    input.value = input.value - input.step;
    servingsValue = input.value;
  });
  document.getElementById("increase-servings").addEventListener("click", () => {
    input.value = +input.value + +input.step;
    servingsValue = input.value;
  });
  // =============================================================================

  // =================confirm button==============================================
  const confirmBtn = document.getElementById("confirm-log-meal");
  confirmBtn.addEventListener("click", () => {
    // send the logged item to foodlog section

    displayLoggedItems(nutriData, selectedMeal, modal,servingsValue);
  });
  // ===========================================================================
}

//=============== function display logged meal into foodLog section======
// store meal data in local storage
function displayLoggedItems(nutriData, selectedMeal, modal,servingsValue) {
    const LogContainer=document.getElementById("logged-items-container")

    LogContainer.innerHTML = "";

  // store time now => to be added in the localStorage object
  const timeAdded = new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // store date => to be the key of the meal info
  let timeInDays = new Date()
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .join("-");
  // ====================local storage handling==========================
  const { protein, fat, carbs, calories } = nutriData; //extract protien,cal,carbs from Nutri object
  const allInfoOfMeals = {
    //the pushed object in the array
    timeAdded: timeAdded,
    type: "meal",
    servingsValue,
    protein,
    fat,
    carbs,
    calories,
    ...selectedMeal,
  }; // combine nutri object keys with meal info in one object

  // if there are data in the local storage put it in logItems , if not build the object
  if (localStorage.getItem("nutriplan_daily_log")) {
    let logItems = JSON.parse(localStorage.getItem("nutriplan_daily_log")); //log items= {01-20-2026: {totalProtein: 23, totalFat: 14, totalCarbs: 65, totalCalories: 411, meals: [,…]}}
    // condition to check if logItems[key] not available build a new date key 
    if (!logItems[timeInDays]) {
      logItems[timeInDays] = {
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalCalories: 0,
        meals: [],
      };
    }
    // push the main object to the date key in meals
    logItems[timeInDays].meals.push(allInfoOfMeals);
    // update total nutrients
logItems[timeInDays].totalProtein += allInfoOfMeals.protein*servingsValue;
    logItems[timeInDays].totalFat += allInfoOfMeals.fat*servingsValue;
    logItems[timeInDays].totalCarbs += allInfoOfMeals.carbs*servingsValue;
    logItems[timeInDays].totalCalories += allInfoOfMeals.calories*servingsValue;
    //remove the modal automatically 
    modal.remove();
    // set the new data in the local storage
    localStorage.setItem("nutriplan_daily_log", JSON.stringify(logItems));
    // display the new data
    renderLoggedItems(logItems[timeInDays].meals);
  } else {  //if local storage have no keys
    //1- build the object to push in
    let logItems = {};
    {
      logItems[timeInDays] = {
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalCalories: 0,
        meals: [],
      };
    }
    // 2- push the data of the logged item in the object
    logItems[timeInDays].meals.push(allInfoOfMeals);
    // 3- store total nutri info => increase it from the extracted keys
    logItems[timeInDays].totalProtein += allInfoOfMeals.protein*servingsValue;
    logItems[timeInDays].totalFat += allInfoOfMeals.fat*servingsValue;
    logItems[timeInDays].totalCarbs += allInfoOfMeals.carbs*servingsValue;
    logItems[timeInDays].totalCalories += allInfoOfMeals.calories*servingsValue;
    // 4- put the final result in the local storage
    localStorage.setItem("nutriplan_daily_log", JSON.stringify(logItems));
    //5- remove the modal
     modal.remove();
    //6- display all data
    renderLoggedItems(logItems[timeInDays].meals);
  }
}
// =======================================================================

//===============function invoked at the start of the website=============
// to check if there are data in the 
export function displayoggedItemsAtStart() {
  if(localStorage.getItem("nutriplan_daily_log")){
        const LogContainer=document.getElementById("logged-items-container")

        LogContainer.innerHTML = "";

  let logItems = JSON.parse(localStorage.getItem("nutriplan_daily_log"));
  Object.keys(logItems).forEach((day) => {
    renderLoggedItems(logItems[day].meals);
  });
  }else{
    let timeInDays= new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).split("/").join("-");
    let logItems = {};
    {
      logItems[timeInDays] = {
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalCalories: 0,
        meals: [],
      };
    }
  }
}
//==========================================================================
export function renderLoggedItems(timeInDays) {
  const loggedCount = document.getElementById("logged-count")
  const LogContainer=document.getElementById("logged-items-container")
  LogContainer.classList.add("space-y-3", "max-h-96", "overflow-y-auto");
  LogContainer.classList.remove("text-center", "py-12");
setProgressBar()
  loggedCount.innerHTML=`Logged Items (${timeInDays.length})`
  timeInDays.forEach((element) => {
    LogContainer.innerHTML += `<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            <img src=${element.thumbnail} alt=${
                              element.name
                            } class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-gray-900">${
                                  element.name
                                }</p>
                                <p class="text-sm text-gray-500">
                                    ${element.type==="product"?element.brand:`${element.servingsValue} servings`} 
                                    <span class="mx-1">•</span>
                                    <span class="${element.type==="product"?"text-blue-600":"text-emerald-600"}">${element.type==="product"?"Product":"Recipe"}</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${element.timeAdded}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${
                                  element.servingsValue * element.calories 
                                }</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${
                                  element.servingsValue * element.protein
                                }g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${
                                  element.servingsValue * element.carbs
                                }g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${
                                  element.servingsValue * element.fat
                                }g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="0" fdprocessedid="aa642q">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
                    </div>
`;
  });
}


