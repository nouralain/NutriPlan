import calcMealNutriPercentage from "./calcNutriPercentage.js";
import { renderLoggedItems, servingsValue } from "./../meals/meals-info.js";
export default class Product {
  constructor() {
    this.productSearchInput = document.getElementById("product-search-input");
    this.searchBtn = document.getElementById("search-product-btn");
    this.productContainer = document.getElementById("products-grid");
    this.productByName = []; //array of filtered products from search value
    this.barcodeInput = document.getElementById("barcode-input");
    this.lookUp = document.getElementById("lookup-barcode-btn");
    this.productByBarcode = []; //array of filtered products by barcode
    this.currentProducts = [];
    this.productCardClick();
  }

  // ============ Get product data from the value in search input========================================
  getProductData = async (searchValue) => {
    try {
      let resp = await fetch(
        `https://nutriplan-api.vercel.app/api/products/search?q=${searchValue}&page=1&limit=100`,
      );
      if (resp.ok === false) {
        throw new Error(`Request failed with status ${resp.status}`);
      } else {
        //100% data recived
        let data = await resp.json();
        return (this.productByName = data.results);
      }
    } catch (error) {
      console.error("fetchMeals error:", error.message);
    }
  };
  // ======================================================================================================

  // ================Get product data from the barcode in barcode input======================================
  getProductByBarcode = async (barcode) => {
    try {
      let resp = await fetch(
        `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`,
      );
      if (resp.ok === false) {
        throw new Error(`Request failed with status ${resp.status}`);
      } else {
        //100% data recived
        let data = await resp.json();
        return (this.productByBarcode = [data.result]);
      }
    } catch (error) {
      console.error("fetchMeals error:", error.message);
    }
  };
  // =========================================================================================================

  // =================Called in main when user search=========================================================
  handleSearchName = () => {
    // ===================== 1 (remove empty div when user search)===============================================
    document.getElementById("products-empty").classList.remove("hidden");
    // ==========================================================================================================

    // ===================== 2 (take the value in the search input)==============================================
    let searchValue;
    this.searchBtn.addEventListener("click", async () => {
      searchValue = this.productSearchInput.value;
      // ==========================================================================================================

      // ===================== 3 (condition check if search input not empty)=======================================
      if (searchValue != "") {
        //1- remove the previous products
        this.productContainer.classList.add("hidden");
        //2- remove empty div and loading div
        document.getElementById("products-empty").classList.add("hidden");
        document.getElementById("products-loading").classList.remove("hidden");
        //3- get the data of the searched items
        await this.getProductData(searchValue);
        this.currentProducts = this.productByName;

        //4- wait till value recived and show loading div
        setTimeout(() => {
          document.getElementById("products-loading").classList.add("hidden");
          //5- show container div to display the new products in it
          this.productContainer.classList.remove("hidden");
          //6- display the searched products
          this.displayProduct(this.currentProducts, this.productSearchInput);
        }, 2000);
        //7- add functionality to filter btns
        this.filterByGrade(this.productByName, this.productSearchInput);
        // 8- add fuunctionality to category btns
        // this.filterByCategories()
      }
      // =======================================================================================================
    });
  };

  // ===============function handle searching by barcode and display products and create modal automatic====
  handleSearchBarcode = () => {
    document.getElementById("products-empty").classList.remove("hidden");
    let barcodValue;
    this.lookUp.addEventListener("click", async () => {
      barcodValue = this.barcodeInput.value;
      if (barcodValue != "") {
        this.productContainer.classList.add("hidden");
        document.getElementById("products-empty").classList.add("hidden");
        document.getElementById("products-loading").classList.remove("hidden");
        await this.getProductByBarcode(barcodValue);
        this.currentProducts = this.productByBarcode;

        setTimeout(() => {
          document.getElementById("products-loading").classList.add("hidden");
          this.productContainer.classList.remove("hidden");
          // this responsible for displaing product and create and open the modal at same time
          this.displayProduct(this.currentProducts, this.barcodeInput);
          console.log(this.productByBarcode,this.currentProducts);
          
          this.createProductModalFromObj(this.productByBarcode[0]);
        }, 2000);
      }
    });
  };
  // ==========================================================================================================

  // ================function responsible for clicking on any product =>prevent event listner duplication=======
  productCardClick = () => {
    this.productContainer.addEventListener("click", (e) => {
      this.handleModalOpen(e.target, this.currentProducts);
    });
  };
  // ==========================================================================================================

  // ====function display searched products (through search input or barcode input)=>depending on array passed
  displayProduct = (array, input) => {
    // for changing style of element depending on the value
    const novaClasses = {
      1: "bg-green-500",
      2: "bg-lime-500",
      3: "bg-orange-500",
      4: "bg-red-500",
    };
    const gradeClasses = {
      a: "bg-green-500",
      b: "bg-lime-500",
      c: "bg-yellow-500",
      d: "bg-orange-500",
      e: "bg-red-500",
    };

    // array = array of products data
    const prodDesign = array
      .map((item) => {
        return `<div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${item.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src=${item.image}
                    alt=${item.name}
                    loading="lazy"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 ${
                      gradeClasses[item.nutritionGrade]
                    } text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${item.nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 ${
                      novaClasses[item.novaGroup]
                    } text-white text-xs font-bold w-6 h-6 rounded-full ${
                      item.novaGroup ? "flex" : "hidden"
                    } items-center justify-center"
                    title="NOVA ${item.novaGroup}"
                  >
                    ${item.novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${item.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${item.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${
                        item.nutrients.calories
                      } kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${
                        item.nutrients.protein
                      }g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${
                        item.nutrients.carbs
                      }g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${
                        item.nutrients.fat
                      }g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${
                        item.nutrients.sugar
                      }g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
      })
      .join("");
    this.productContainer.innerHTML = prodDesign;
    document.getElementById("products-count").innerText =
      `Found ${array.length} products for "${input.value}"`;
  };
  // ============================================================================================================

  //=============== responsible for filtring products depending on the score=====================================
  filterByGrade = (array, input) => {
    document.querySelectorAll(".nutri-score-filter").forEach((filterBtn) => {
      //1 btn

      filterBtn.addEventListener("click", () => {
        document.querySelectorAll(".nutri-score-filter").forEach((btn) => {
          btn.classList.remove("ring-2", "ring-gray-900");
        });
        filterBtn.classList.add("ring-2", "ring-gray-900");
        const grade = filterBtn.dataset.grade; //data-grade value
        if (grade === "") {
          this.displayProduct(array, input);
        } else {
          // get the products that have nutriGrade= filterBtn grade
          const filteredArray = array.filter(
            (item) => item.nutritionGrade === grade,
          );
          // display the filtered products
          this.displayProduct(filteredArray, input);
        }
      });
    });
  };
// =============================================================================================================

// ==============function open and create modal when product is clicked => called in PRODUCT CARD CLICK
  handleModalOpen = (target, array) => {
    if (target.closest(".product-card")) {
      // extract the clicked product data from the array through index
      // index = search of the clicked barcode in the array
      const prodBarcode = target.closest(".product-card").dataset.barcode;
      const index = array.findIndex((prod) => prod.barcode == prodBarcode);

      // product = data of the clicked product => name , image , nutrients (OBJECT)
      const product = array[index];
      // create the modal => with the data object of the clicked product
      this.createProductModalFromObj(product);
    }
  };
  // ============================================================================================================

  // ============= create modal and handle all its inner buttons=================================================
  createProductModalFromObj = (selectedMeal) => {
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
    modal.id = "product-detail-modal";
    document.body.appendChild(modal);

    const gradeClasses = [
      {
        a: "#85bb2f20",
        b: "#85bb2f20",
        c: "#fecb0220",
        d: "#ee810020",
        e: "#e63e1120",
      },
      {
        a: "#038141",
        b: "#85bb2f",
        c: "#fecb02",
        d: "#ee8100",
        e: "#e63e11",
      },
      {
        a: "Excellent",
        b: "Good",
        c: "Average",
        d: "Poor",
        e: "Bad",
      },
    ];
    const novaClasses = [
      {
        1: "#85bb2f20",
        2: "#85bb2f20",
        3: "#fecb0220",
        4: "#e63e1120",
      },
      {
        1: "#038141",
        2: "#85bb2f",
        3: "#fecb02",
        4: "#e63e11",
      },
      {
        1: "Unprocessed",
        2: "Processed",
        3: "Processed",
        4: "Ultra-processed",
      },
    ];

    const mealNutriMax = {
      calories: 2000,
      protein: 50,
      fat: 65,
      carbs: 250,
      sugar: 20,
      fiber: 10,
    };
// destract the object 
    const { brand, name, image, novaGroup, nutritionGrade } = selectedMeal;
    // destract object of object
    const { sodium, fiber, sugar, fat, carbs, protein, calories } =
      selectedMeal.nutrients;
      // adding the modal to the HTML
    const modalDesign = ` <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    
                        <img src="${image}" alt="${
                          name
                        }" class="w-full h-full object-contain">
                    
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${
                      brand
                    }</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${
                      name
                    }</h2>
                    <p class="text-sm text-gray-500 mb-3">1,5l</p>
                    
                    <div class="flex items-center gap-3">
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color:${
                              gradeClasses[0][nutritionGrade]
                            }">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${
                                  gradeClasses[1][nutritionGrade]
                                }">
                                    ${nutritionGrade.toUpperCase()}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${
                                      gradeClasses[1][nutritionGrade]
                                    }">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${
                                      gradeClasses[2][nutritionGrade] ||
                                      "unknown"
                                    }</p>
                                </div>
                            </div>
                        
                        
                        
                            <div class="${
                              novaGroup ? "flex" : "hidden"
                            } items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${
                              novaClasses[0][novaGroup]
                            }">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${
                                  novaClasses[1][novaGroup]
                                }">
                                    ${novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${
                                      novaClasses[1][novaGroup]
                                    }">NOVA</p>
                                    <p class="text-[10px] text-gray-600">${
                                      novaClasses[2][novaGroup]
                                    }</p>
                                </div>
                            </div>
                        
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600" fdprocessedid="6gr41g">
                    <i class="text-2xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"></path></svg></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${calories}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${calcMealNutriPercentage(
                              protein,
                              mealNutriMax.protein,
                            )}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${
                          protein
                        }g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${calcMealNutriPercentage(
                              carbs,
                              mealNutriMax.carbs,
                            )}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${calcMealNutriPercentage(
                              fat,
                              mealNutriMax.fat,
                            )}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${calcMealNutriPercentage(
                              sugar,
                              mealNutriMax.sugar,
                            )}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${
                          sugar
                        }g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">0.0g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${
                          fiber
                        }g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${
                          sodium
                        }g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>
            
            <!-- Additional Info -->
            
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-list" data-prefix="fas" data-icon="list" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"></path></svg></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">Sucre, huile de palme, NOISETTES 13%, cacao maigre 7,4%, LAIT écrémé en poudre 6,6%, LACTOSERUM en poudre, émulsifiants: lécithines [SOJA), vanilline. Sans gluten.</p>
                </div>
            
            
            
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="6111252421582" fdprocessedid="s2gye">
                    <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all" fdprocessedid="e084lq">
                    Close
                </button>
            </div>
        </div>
    
            </div>  `;
    modal.innerHTML = modalDesign;
  
    // handle all modal btns
    this.handleCloseModal(modal);
    this.handleLogBtn(modal, selectedMeal);
  };
// ================================================================================================================

// ============== modal btns=====================================================================================
  handleCloseModal = (modal) => {
    document.querySelectorAll(".close-product-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.remove();
      });
    });

    document
      .getElementById("product-detail-modal")
      .addEventListener("click", (e) => {
        e.target === modal && modal.remove();
      });
  };

  handleLogBtn = (modal, selectedMeal) => {
    const logBtn = document.querySelector(".add-product-to-log");
    logBtn.addEventListener("click", () => {
      this.displayLoggedItems(modal, selectedMeal);
    });
  };
// ==============================================================================================================

  //================== function display logged product inside foodLog============================================
  displayLoggedItems = (modal, selectedMeal) => {
    const LogContainer=document.getElementById("logged-items-container")
    LogContainer.innerHTML = "";
      // store time now => to be added in the localStorage object
    const timeAdded= new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
    // store date => to be the key of the meal info
  let timeInDays= new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).split("/").join("-");
  
    const {image: thumbnail,name,barcode,brand}=selectedMeal
    const allInfoOfMeals={
      timeAdded:timeAdded,
      servingsValue:1,
      type: "product",
       thumbnail,
       name,
       barcode,
       brand,
       ...selectedMeal.nutrients
      }
    // ====================local storage handling==========================
    if(localStorage.getItem("nutriplan_daily_log")){
let logItems=JSON.parse(localStorage.getItem("nutriplan_daily_log"))
 if (!logItems[timeInDays]) {
      logItems[timeInDays] = {
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalCalories: 0,
        meals: [],
      };
    }

logItems[timeInDays].meals.push(allInfoOfMeals)

 logItems[timeInDays].totalProtein += allInfoOfMeals.protein;
    logItems[timeInDays].totalFat += allInfoOfMeals.fat;
    logItems[timeInDays].totalCarbs += allInfoOfMeals.carbs;
    logItems[timeInDays].totalCalories += allInfoOfMeals.calories;
  modal.remove();
localStorage.setItem("nutriplan_daily_log", JSON.stringify(logItems));
    renderLoggedItems(logItems[timeInDays].meals)
 
}else{
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
 
    
    
    logItems[timeInDays].meals.push(allInfoOfMeals)
//  store total nutri info => increase it from the extracted keys
 logItems[timeInDays].totalProtein += allInfoOfMeals.protein;
logItems[timeInDays].totalFat += allInfoOfMeals.fat;
logItems[timeInDays].totalCarbs += allInfoOfMeals.carbs;
logItems[timeInDays].totalCalories += allInfoOfMeals.calories;
// put the final result in the local storage
  localStorage.setItem("nutriplan_daily_log", JSON.stringify(logItems)); 
  modal.remove();

  renderLoggedItems(logItems[timeInDays].meals)
}
// =======================================================================
  };
  // ===========================================================================================================
}
