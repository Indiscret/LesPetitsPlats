async function getRecipes() {
    try {
        const response = await fetch("../data/recipes.js");
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des données");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

async function displayData(recipes) {
    const recipesContainer =  document.getElementById("recipes_card_container");

    if (!Array.isArray(recipes)) {
        console.error("les données sont pas valides", recipes);
        return;
    }

    recipes.forEach((recipe) => {
        const recipeModel = recipesFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesContainer.appendChild(recipeCardDOM);
    });
}

async function init() {
    const data = await getRecipes();
    displayData(data);
}

init();