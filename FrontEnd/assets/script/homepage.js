////////////////////////////////////////
///// Gestion de la page d'accueil /////
////////////////////////////////////////

import { APIWorks, APICategories } from "./API.js";

////////////////////////////////////////
///// Génération des boutons filtre ////
////////////////////////////////////////

const createFilterButtons = async () => {
    const buttonsContainer = document.getElementById("buttons");
    
    try {
        // Récupérer les catégories depuis l'API
        const categories = await APICategories();
        
        // Ajouter le bouton "Tous" en premier
        const allButton = document.createElement("button");
        allButton.id = "0";
        allButton.className = "btn-filter btn-filterActive";
        allButton.textContent = "Tous";
        buttonsContainer.appendChild(allButton);

        // Générer les boutons pour chaque catégorie
        categories.forEach((category) => {
            const button = document.createElement("button");
            button.id = category.id;
            button.className = "btn-filter";
            button.textContent = category.name;
            buttonsContainer.appendChild(button);
        });

        // Ajouter les événements aux boutons
        const works = await APIWorks(); // Récupérer les données une seule fois
        const buttons = document.querySelectorAll(".btn-filter");
        buttons.forEach((button) =>
            button.addEventListener("click", (event) => btnFilter(event, works, buttons))
        );
    } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
    }
};

////////////////////////////////////////
///// Récupération et affichage ////////
////////////////////////////////////////

export const fetchWorks = async () => {
    try {
        const data = await APIWorks();
        const gallery = document.querySelector(".gallery");

        // Générer les images dynamiquement
        // Vider la galerie avant d'ajouter de nouvelles oeuvres
        gallery.innerHTML = "";

        // Parcourir les données et créer les éléments pour chaque oeuvre
        data.forEach((figure) => {
            // Créer un élément <figure> pour chaque oeuvre
            const figureElement = document.createElement("figure");
            figureElement.id = figure.id;

            // Créer un élément <img> pour l'image de l'oeuvre
            const imgElement = document.createElement("img");
            imgElement.src = figure.imageUrl;
            imgElement.alt = figure.title;

            // Créer un élément <figcaption> pour le titre de l'oeuvre
            const captionElement = document.createElement("figcaption");
            captionElement.textContent = figure.title;

            // Ajouter l'image et le titre à l'élément <figure>
            figureElement.appendChild(imgElement);
            figureElement.appendChild(captionElement);

            // Ajouter l'élément <figure> à la galerie
            gallery.appendChild(figureElement);
        });

        // Ajouter les événements aux boutons de filtre
        const buttons = document.querySelectorAll(".btn-filter");
        buttons.forEach((button) =>
            button.addEventListener("click", (event) => btnFilter(event, data, buttons))
        );
    } catch (err) {
        console.error("Erreur lors de la récupération des oeuvres :", err);
    }
};

////////////////////////////////////////
///// Gestion des filtres //////////////
////////////////////////////////////////

const btnFilter = (event, data, buttons) => {
    const categoryId = Number(event.target.id);

    // Activer le bouton sélectionné
    buttons.forEach((btn) => btn.classList.remove("btn-filterActive"));
    event.target.classList.add("btn-filterActive");

    // Filtrer les oeuvres
    const filteredData = categoryId === 0 ? data : data.filter((item) => item.categoryId === categoryId);

    // Afficher les oeuvres filtrées
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    filteredData.forEach((figure) => {
        const figureElement = document.createElement("figure");
        figureElement.id = figure.id;

        const imgElement = document.createElement("img");
        imgElement.src = figure.imageUrl;
        imgElement.alt = figure.title;

        const captionElement = document.createElement("figcaption");
        captionElement.textContent = figure.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(captionElement);
        gallery.appendChild(figureElement);
    });
};

////////////////////////////////////////
///// Gestion de la page en mode édition /////
////////////////////////////////////////

const editMode = () => {
    const editBanner = document.getElementById("edit-banner");
    const logintLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const filter = document.getElementById("buttons");
    const changeButton = document.querySelector("[data-open-modal");

    const userToken = sessionStorage.getItem("accessToken");

    const isTokenValide = !!userToken;

    if (isTokenValide) {
        editBanner.style.display = "flex";
        logintLink.style.display = "none";
        logoutLink.style.display = "flex";
        filter.style.display = "none";
        changeButton.style.display = "flex";
    } else {
        console.log("erreur");
    }
};
editMode();

const logoutUser = () => {
    sessionStorage.removeItem("accessToken");
    window.location.href = "index.html";
};

////////////////////////////////////////
///// Initialisation de la page ////////
////////////////////////////////////////

document.addEventListener("DOMContentLoaded", async () => {
    await createFilterButtons(); // Attendre que les boutons soient créés
    fetchWorks(); // Charger les oeuvres

    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            logoutUser();
        });
    }
});

