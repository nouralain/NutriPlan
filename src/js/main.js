/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// ============================================
// DOM selectors
// ============================================
export const recipesGrid = document.getElementById("recipes-grid");
const categoriesGrid = document.getElementById("categories-grid");
const categoryCards=document.querySelectorAll(".category-card")
const countryContainer = document.getElementById("countries-container");
const countryCards=document.querySelectorAll(".country-btn")

export const navAnchor = document.querySelectorAll("nav a");
const recipesBtn = document.getElementById("recipes-btn");
const scanBtn = recipesBtn.nextElementSibling;
// ============================================
// imports
// ============================================
import Recipies from "./meals/AllMeals.js";
import CategoriesِAndCountries from "./meals/categoryAndCountry.js";
import handleSections from "./hideSection.js";
import Product from "./product-scanner/product-class.js";
import { displayoggedItemsAtStart } from "./meals/meals-info.js";
import FoodLog from './foodLog/foodLogClass.js';


// showing the loading overlay when the page opened and before the data reciving
document.getElementById("app-loading-overlay").style.display = "flex";
displayoggedItemsAtStart()
// create new object from the class => to fetch and display category buttons
// and add functionallity to the category button to filter recipes cards
let myCategory = new CategoriesِAndCountries(
  categoriesGrid,
  "/categories",
  recipesGrid
);
myCategory.displayCategories();
 categoryCards.forEach((element) => {
  element.addEventListener("click",async ()=>{
    myCategory.filterMeals(element,"category")
  })
 })

// create new object from the class => to fetch and display country buttons
// and add functionallity to the country button to filter recipes cards
let myCountry = new CategoriesِAndCountries(
  countryContainer,
  "/areas",
  recipesGrid
);
myCountry.displayCountry();
 countryCards.forEach((element) => {
  element.addEventListener("click",async ()=>{
    myCountry.filterMeals(element,"area")
  })
 })
// create new object from the class => fetch the recipes data
// after data recived remove the loading overlay (after 200ms to give time to category and country and recipes to be recived )
// display all recipes
// handle displaying filtered data while user typing
let allRecipes = new Recipies(recipesGrid);
await allRecipes.getRecipes();
setTimeout(() => {
  document.getElementById("app-loading-overlay").style.display = "none";
}, 200);
 allRecipes.displayRecipies();

let products = new Product();
products.handleSearchName();
products.handleSearchBarcode();

navAnchor.forEach((link, index) => {
  link.addEventListener("click", () => {
    const route = link.dataset.route;

    history.pushState({ section: route }, "", `?section=${route}`);
    handleSections(index);

    navAnchor.forEach((l) => {
      l.classList.add("text-gray-600", "hover:bg-gray-50");
      l.classList.remove("text-emerald-700", "bg-emerald-50");
    });
    link.classList.remove("text-gray-600", "hover:bg-gray-50");
    link.classList.add("text-emerald-700", "bg-emerald-50");
  });
});

let myfoodLog= new FoodLog()

recipesBtn.addEventListener("click", () => {
  myfoodLog.handleLogBtns(recipesBtn, 0);
});

scanBtn.addEventListener("click", () => {
  myfoodLog.handleLogBtns(scanBtn, 1);
});


/**
   الناقص:
   1- تظبيط ستايل زراير ال كاتيجوري ف صفحه الميلز
   2- تظبيط الفانكشناليتي بتاعت زراير الكاتيجوري ف صفحه البروداكتس
   3- تغيير محتويات الهيدر حسب كل سيكشن
   4- تظبيط زرار ال ليست ف سكشن الميلز
   6- لما اعمل لوج لوصفه اضرب الفاليو بتاعت ال انبوت ف الكالوريز وكل حاجه
   7- لما اخرج من السكشن ارجع كل حاجه زي مكانت ف السكشن قبل مخرج منه
   */
