// ============================================
// dynamic method to fetch meals data inside classes
// ============================================
export default async function fetchMeals(endPoint) {
  try {
    let resp = await fetch(
      `https://nutriplan-api.vercel.app/api/meals${endPoint}`
    );
    if (resp.ok === false) {
      throw new Error(`Request failed with status ${resp.status}`);
    } else {  //100% data recived
      let data = await resp.json();
      const arr = data.results;
      return arr;
    }
  } catch (error) {
    console.error("fetchMeals error:", error.message);
  }
}




