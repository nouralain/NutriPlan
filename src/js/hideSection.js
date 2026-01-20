export default function handleSections(i) {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    section.classList.add("hidden");

  });
  switch (i) {
    case 0:
      document
        .getElementById("search-filters-section")
        .classList.remove("hidden");
      document
        .getElementById("meal-categories-section")
        .classList.remove("hidden");
      document.getElementById("all-recipes-section").classList.remove("hidden");
      document.getElementById("products-section").classList.add("hidden");
      document.getElementById("foodlog-section").classList.add("hidden");

      break;

    case 1:
      document.getElementById("products-section").classList.remove("hidden");
      document.getElementById("search-filters-section").classList.add("hidden");
      document
        .getElementById("meal-categories-section")
        .classList.add("hidden");
      document.getElementById("all-recipes-section").classList.add("hidden");
      document.getElementById("foodlog-section").classList.add("hidden");

      break;

    case 2:
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
