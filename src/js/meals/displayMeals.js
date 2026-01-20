// ============================================
// dynamic method to display recipies in Recipes and countryCategory classes => based on what array and which container passed to
// ============================================
export default function displayRecipes(dataArray , container) {
    const recipiesArray = dataArray;
    const recipiesCard = recipiesArray
      .map((obj) => {
        return `<div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id=${obj.id}
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src=${obj.thumbnail}
                  alt=${obj.name}
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${obj.category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${obj.area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                   ${obj.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${obj.instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${obj.area}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${obj.area}
                  </span>
                </div>
              </div>
            </div>`;
      })
      .join("");

  return container.innerHTML = recipiesCard;
  };