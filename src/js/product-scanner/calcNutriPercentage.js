 export default function calcMealNutriPercentage(value, max) {
    return Math.min((value / max) * 100, 100);
  };