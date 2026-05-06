let selectedFilters = [];
let allRecipes = [];
let ingredientsList = [];
let appliancesList = [];
let ustensilsList = [];

// Récupération des recettes
async function getRecipes() {
    try {
        const response = await fetch("../data/recipes.js");
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des données");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
        return [];
    }
}

// Affiche les recettes
function displayData(recipes) {
    const recipesContainer = document.getElementById("recipes_card_container");

    if (!Array.isArray(recipes)) return;

    recipesContainer.innerHTML = "";

    for (let i = 0; i < recipes.length; i++) {
        const recipeModel = recipesFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();

        recipeCardDOM.addEventListener("click", () => {
            selectRecipe(recipes[i]);

        });
        recipesContainer.appendChild(recipeCardDOM);
    }
    updateRecipesCounter(recipes);
    updateFiltersRecipes(recipes);
}

// Affiche un message si aucune recette correspond à la recherche
function renderNoResultsRecipes(searchTerm) {
    const recipesContainer = document.getElementById("recipes_card_container");

    const p = document.createElement("p");
    p.className = "no_results";
    p.textContent = `Aucune recette ne contient "${searchTerm}". Vous pouvez chercher "tarte aux pommes", "poisson", etc.`;

    recipesContainer.innerHTML = "";
    recipesContainer.appendChild(p);
}

// Applique la recherche de l'utilisateur et filtres sélectionnés
function applyFilters() {
    const searchInput = document.getElementById("search");
    let searchTerm = searchInput.value.trim().toLowerCase();
    const REGEX = /[^a-zA-Z0-9À-ÿ\s'-]/g;

    searchTerm = searchTerm.replace(REGEX, "");

    let filteredRecipes = allRecipes;

    if (searchTerm.length >= 3) {
        filteredRecipes = searchRecipesInput(filteredRecipes, searchTerm);
    }

    for (let i = 0; i < selectedFilters.length; i++) {
        const filter = selectedFilters[i];

        let newFilteredRecipes = [];

        for (let j = 0; j < filteredRecipes.length; j++) {
            const recipe = filteredRecipes[j];
            let isMatch = false;

            if (filter.type === "ingredients") {
                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase() === filter.value) {
                        isMatch = true;
                        break;
                    }
                }

            } else if (filter.type === "appliances") {
                if (recipe.appliance.toLowerCase() === filter.value) {
                    isMatch = true;
                }

            } else if (filter.type === "ustensils") {
                for (let k = 0; k < recipe.ustensils.length; k++) {
                    if (recipe.ustensils[k].toLowerCase() === filter.value) {
                        isMatch = true;
                        break;
                    }
                }
            }
            if (isMatch) {
                newFilteredRecipes.push(recipe);
            }
        }

        filteredRecipes = newFilteredRecipes;
    }

    if (filteredRecipes.length === 0) {
        renderNoResultsRecipes(searchTerm);
        updateRecipesCounter(filteredRecipes);
        updateFiltersRecipes(allRecipes);
    } else {
        displayData(filteredRecipes);
    }
}

// Recherche pamri le nom, ingredients et description
function searchRecipesInput(recipes, searchTerm) {
    const filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let recipeMatch = false;

        if (
            recipe.name.toLowerCase().includes(searchTerm) ||
            (recipe.description.toLowerCase().includes(searchTerm))
        ) {
            recipeMatch = true;
        }

        if (!recipeMatch) {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                if (ingredient.includes(searchTerm)) {
                    recipeMatch = true
                    break;
                }
            }
        }
        if (recipeMatch) filteredRecipes.push(recipe);
    }
    return filteredRecipes;
}


// Met à jour le compteur de recettes
function updateRecipesCounter(recipes) {
    const counter = document.getElementById("number");
    counter.textContent = recipes.length;
}

// Met à jour la liste des filtres selon les recette affichées
function updateFiltersRecipes(recipes) {
    const ingredients = [];
    const appliances = [];
    const ustensils = [];

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];

        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ing = recipe.ingredients[j].ingredient.toLowerCase();
            if (!ingredients.includes(ing)) ingredients.push(ing);
        }
        const appliance = recipe.appliance.toLowerCase();
        if (!appliances.includes(appliance)) appliances.push(appliance);

        for (let k = 0; k < recipe.ustensils.length; k++) {
            const ust = recipe.ustensils[k].toLowerCase();
            if (!ustensils.includes(ust)) ustensils.push(ust);
        }
    }
    setFiltersData(ingredients, appliances, ustensils);
}

// Stocke les données filtrées
function setFiltersData(ingredients, appliances, ustensils) {
    ingredientsList = ingredients;
    appliancesList = appliances;
    ustensilsList = ustensils;

    renderList("ingredients", ingredients);
    renderList("appliances", appliances);
    renderList("ustensils", ustensils);
}

// Générer la liste des eléments des filtres avancés
function renderList(type, items) {
    const container = document.getElementById(`${type}_container`);
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        const item = document.createElement("li");
        item.textContent = items[i];

        let isSelected = false;

        // Vérifie si le filtre est slectionné
        for (let j = 0; j < selectedFilters.length; j++) {
            if (selectedFilters[j].type === type && selectedFilters[j].value === items[i]) {
                isSelected = true;
                break;
            }
        }

        if (isSelected) {
            item.classList.add("selected_filter");
        }

        item.addEventListener("click", () => {
            addFilter(type, items[i]);
        });
        container.appendChild(item);
    }
}

// Initialisation des dropdowns
function initDropdowns() {
    const dropdownButtons = document.querySelectorAll(".dropdown");

    dropdownButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const wrapper = btn.closest(".dropdown_wrapper");
            const dropdownListContainer = wrapper.querySelector(".dropdown_list_container");

            const isDropdownOpen = dropdownListContainer.classList.contains("open");

            document.querySelectorAll(".dropdown_list_container").forEach(list => {
                list.classList.remove("open");
                list.closest(".dropdown_wrapper").querySelector(".dropdown").classList.remove("active");
            });

             if (!isDropdownOpen) {
                dropdownListContainer.classList.add("open");
                btn.classList.add("active");
             }
        });
    });
}

function initSearchClearButton() {
    const searchInputs = document.querySelectorAll("#search, .dropdown_search");

    searchInputs.forEach((input) => {
        const wrapper = input.closest(".search_input_wrapper, .dropdown_input_wrapper");
        const clearBtn = wrapper.querySelector(".icon_clear");

        if (!clearBtn) return;

        input.addEventListener("input", () => {
            if (input.value.trim().length > 0) {
                clearBtn.style.display = "flex";
            } else {
                clearBtn.style.display = "none";
            }
        });

        clearBtn.addEventListener("click", () => {
            input.value = "";
            clearBtn.style.display = "none";
            input.focus();

            applyFilters();

        });
    })
}

// Recherche dans la liste des filtres avancés
function initDropdownFilterSearch() {
    const dropdownSearchInputs = document.querySelectorAll(".dropdown_search");

    dropdownSearchInputs.forEach((input) => {
        input.addEventListener("input", () => {
            const searchValue = input.value.trim().toLowerCase();

            const dropdownWrapper = input.closest(".dropdown_wrapper");
            const listElement = dropdownWrapper.querySelector(".dropdown_list");
            const filterType = listElement.id;

            let sourceList = [];
            let type = "";

            if (filterType === "ingredients_container") {
                sourceList = ingredientsList;
                type = "ingredients";
            } else if (filterType === "appliances_container") {
                sourceList = appliancesList;
                type = "appliances";
            } else {
                sourceList = ustensilsList;
                type = "ustensils";
            }

            const filteredItems = [];

            for (let i = 0; i < sourceList.length; i++) {
                const item = sourceList[i];

                if (item.toLowerCase().includes(searchValue)) {
                    filteredItems.push(item);
                }
            }
            renderDropdownListItems(listElement, filteredItems, type);
        });
    });
}

// Affiche le resultat filtrés des dropdowns
function renderDropdownListItems(container, items, type) {
    container.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = items[i];

        listItem.addEventListener("click", () => {
            addFilter(type, items[i]);
        });
        container.appendChild(listItem);
    }
}

// Ajoute le filtre actif
function addFilter(type, value) {
    for (let i = 0; i < selectedFilters.length; i++) {
        if (selectedFilters[i].type === type && selectedFilters[i].value === value) {
            return;
        }
    }
    selectedFilters.push({type, value});
    renderSelectedFilters();
    applyFilters();
}

// Affiche les filtres selectionnés sous forme de tags
function renderSelectedFilters() {
    const tagContainer = document.querySelector(".labels_container");
    tagContainer.innerHTML = "";

    for (let i = 0; i < selectedFilters.length; i++) {
        const filter = selectedFilters[i];

        const tag =  document.createElement("div");
        tag.className = "labels";
        tag.textContent = filter.value;

        const closeIcon = document.createElement("i");
        closeIcon.className = "fa-solid fa-xmark";

        closeIcon.addEventListener("click", () => {
            removeFilter(filter);
        });
        tag.appendChild(closeIcon);
        tagContainer.appendChild(tag);
    }
}

// Supprime le filtre actif
function removeFilter(filterToRemove) {
    const newFilters = [];

    for (let i = 0; i < selectedFilters.length; i++) {
        const filter = selectedFilters[i];

        if (!(filter.type === filterToRemove.type && filter.value === filterToRemove.value)) {
            newFilters.push(filter);
        }
    }
    selectedFilters = newFilters;
    renderSelectedFilters();
    applyFilters();
}

// L'utilisateur choisis une recette
function selectRecipe(recipe) {
    console.log("Recette sélectionné :", recipe.name);
}

// Initialise l'application
async function init() {
    const data = await getRecipes();

    allRecipes = data;

    displayData(data);
    initDropdowns();
    initDropdownFilterSearch();
    initSearchClearButton();

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
        applyFilters();
    });
}

init();