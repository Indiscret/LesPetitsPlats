function recipesFactory(data) {
    // l'intérieur de la fonction, l'objet data est destructuré pour extraire les propriétés.
    const { id, image, name, servings, ingredients, time, description, appliance, ustensils } = data;

    const picture = `assets/images/recipes/${image}`;

    function getRecipeCardDOM() {
        const recipeCard = document.createElement("article");
        recipeCard.classList.add("recipes_card");

        const recipesCardPicture = document.createElement("div");
        recipesCardPicture.classList.add('recipes_card_picture');

        const recipesPicture = document.createElement("img");
        recipesPicture.setAttribute("src", picture);
        recipesPicture.setAttribute("alt", name);
        recipesPicture.classList.add("recipes_picture");

        const cookingTime = document.createElement("span");
        cookingTime.textContent = time + "min";
        cookingTime.classList.add("cooking_time");

        const recipesInfo = document.createElement("div");
        recipesInfo.classList.add("recipes_info");

        const recipesName = document.createElement("h2");
        recipesName.textContent =  name;
        recipesName.classList.add("recipes_name");

        const recipeText = document.createElement("h3");
        recipeText.textContent = "recette";
        recipeText.classList.add("recipe");

        const recipesDesc = document.createElement("p");
        recipesDesc.textContent = description;
        recipesDesc.classList.add("recipes_desc");

        const ingredientsText = document.createElement("h3");
        ingredientsText.textContent = "ingredients";
        ingredientsText.classList.add("ingredients");

        const ingredientsContainer = document.createElement("ul");
        ingredientsContainer.classList.add("ingredients_container");

        ingredients.forEach((ingredient) => {
            const ingredientsList = document.createElement("li");
            ingredientsList.classList.add("ingredients_list");

            const ingredientName = document.createElement("h4");
            ingredientName.textContent = ingredient.ingredient;
            ingredientName.classList.add("ingredient_name");
    
            const ingredientQty = document.createElement("p");
            ingredientQty.textContent = `${ingredient.quantity} ${ingredient.unit || ''}`;
            ingredientQty.classList.add("quantity");

            ingredientsContainer.appendChild(ingredientsList);
            ingredientsList.appendChild(ingredientName);
            ingredientsList.appendChild(ingredientQty);
        });

        recipeCard.appendChild(recipesCardPicture);
        recipesCardPicture.appendChild(recipesPicture);
        recipeCard.appendChild(cookingTime);
        recipeCard.appendChild(recipesInfo);
        recipesInfo.appendChild(recipesName);
        recipesInfo.appendChild(recipeText);
        recipesInfo.appendChild(recipesDesc);
        recipesInfo.appendChild(ingredientsText);
        recipesInfo.appendChild(ingredientsContainer);
        return (recipeCard);
    }
    return { id, image, name, servings, ingredients, time, description, appliance, ustensils, getRecipeCardDOM };
}