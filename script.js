const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEL = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEL = document.getElementById('single-meal');


function searchMeal(e) {
  e.preventDefault();

  singleMealEL.innerHTML = "";

  const term = search.value;

  if(term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then((res) => res.json())
    .then((data)  => {
       resultHeading.innerHTML = `<h2>result: ${term}</h2>`;

       if(data.meals === null) {
         resultHeading.innerHTML= `<h3>no result '${term}', try again</h3>`;
       } else {
         mealsEL.innerHTML = data.meals
         .map(
           (meal) => `
           <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}" >
                  <h3>${meal.strMeal}</h3>
              </div>

           </div>
           `
         ).join("");

         search.value = "";
       }
    });

  } else {
    alert('enter something')
  }
}


function getMealById(mealID) {
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
.then((res) => res.json())
.then((data) => {
  const meal = data.meals[0];
  addMealToDOM(meal);
});


}


function addMealToDOM(meal) {
  resultHeading.style.display = "none";
  mealsEL.style.display = "none";
  const ingedients = [];

  for(let i = 1; i <= 20; i++ ) {
    if(meal[`strIngredient${i}`]) {
      ingedients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEL.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
   <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
   <div class="single-meal-info">
   ${meal.strCategory ? `<p>${meal.strCategory}</p>`: ""} 
   ${meal.strArea ? `<p>${meal.strArea}</p>`: ""}
   </div>
   <div class"main">
   <p>${meal.strInstructions}</p>
   <h2>ingredients</h2>
   <ul>
   ${ingedients.map((ing) => `<li>${ing}</li>`).join("")}
   </ul>
   </div>
  </div>
  `;


}


function randomMeal() {
  mealsEL.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  .then((res) => res.json())
  .then((data) => {
    const meal = data.meals[0];
    addMealToDOM(meal);
  });
}

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);


mealsEL.addEventListener('click', (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if(item.classList) {
      return item.classList.contains('meal-info');

    } else {
      return false;
    }
  });
  if(mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID)
  }
})



