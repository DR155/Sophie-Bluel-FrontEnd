////////////////////////////////////////
///// Gestion de la page d'accueil /////
////////////////////////////////////////

import { APIWorks, APICategories } from "./API.js";

////////////////////////////////////////
///// Utilitaires /////////////////////
////////////////////////////////////////

// Fonction pour créer un élément figure
const createFigureElement = (figure) => {
    const figureElement = document.createElement("figure");
    figureElement.id = figure.id;

    const imgElement = document.createElement("img");
    imgElement.src = figure.imageUrl;
    imgElement.alt = figure.title;

    const captionElement = document.createElement("figcaption");
    captionElement.textContent = figure.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(captionElement);
    return figureElement;
};

// Fonction pour mettre à jour la galerie
const updateGallery = (data) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    data.forEach(figure => {
        gallery.appendChild(createFigureElement(figure));
    });
};

////////////////////////////////////////
///// Génération des boutons filtre ////
////////////////////////////////////////

const createFilterButtons = async () => {
    const buttonsContainer = document.getElementById("buttons");
    
    try {
        const [categories, works] = await Promise.all([
            APICategories(),
            APIWorks()
        ]);
        
        // Ajouter le bouton "Tous"
        const allButton = createButton(0, "Tous", ["btn-filter", "btn-filterActive"])
        buttonsContainer.appendChild(allButton);

        // Générer les boutons pour chaque catégorie
        categories.forEach(category => {
            const button = createButton(category.id, category.name, ["btn-filter"])
            buttonsContainer.appendChild(button);
        });

        // Ajouter les événements aux boutons
        const buttons = document.querySelectorAll(".btn-filter");
        buttons.forEach(button => 
            button.addEventListener("click", (event) => btnFilter(event, works, buttons))
        );
    } catch (err) {
        console.error("Erreur lors de l'initialisation des filtres :", err);
    }
};
const createButton = (id, content, classCss) => {
           const button = document.createElement("button");
        button.id = id;
        button.classList.add(...classCss);
        button.textContent = content;
        return button;
}
////////////////////////////////////////
///// Récupération et affichage ////////
////////////////////////////////////////

export const fetchWorks = async () => {
    try {
        const data = await APIWorks();
        updateGallery(data);
        
        // Mettre à jour les événements des boutons
        const buttons = document.querySelectorAll(".btn-filter");
        buttons.forEach(button => 
            button.addEventListener("click", (event) => btnFilter(event, data, buttons))
        );
    } catch (err) {
        console.error("Erreur lors de la récupération des œuvres :", err);
    }
};

////////////////////////////////////////
///// Gestion des filtres //////////////
////////////////////////////////////////

const btnFilter = (event, data, buttons) => {
    const categoryId = Number(event.target.id);

    // Mettre à jour l'état des boutons
    buttons.forEach(btn => btn.classList.remove("btn-filterActive"));
    event.target.classList.add("btn-filterActive");

    // Filtrer et afficher les œuvres
    const filteredData = categoryId === 0 
        ? data 
        : data.filter(item => item.categoryId === categoryId);
    
    updateGallery(filteredData);
};

////////////////////////////////////////
///// Gestion de la page en mode édition /////
////////////////////////////////////////

const editMode = () => {
    const elements = {
        editBanner: document.getElementById("edit-banner"),
        loginLink: document.getElementById("login-link"),
        logoutLink: document.getElementById("logout-link"),
        filter: document.getElementById("buttons"),
        changeButton: document.querySelector("[data-open-modal]")
    };

    const userToken = sessionStorage.getItem("accessToken");
    const isTokenValid = !!userToken;

    if (isTokenValid) {
        elements.editBanner.style.display = "flex";
        elements.loginLink.style.display = "none";
        elements.logoutLink.style.display = "flex";
        elements.filter.style.display = "none";
        elements.changeButton.style.display = "flex";
    }
};

const logoutUser = () => {
    sessionStorage.removeItem("accessToken");
    window.location.href = "index.html";
};

////////////////////////////////////////
///// Initialisation de la page ////////
////////////////////////////////////////

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await createFilterButtons();
        await fetchWorks();
        
        const logoutLink = document.getElementById("logout-link");
        if (logoutLink) {
            logoutLink.addEventListener("click", (event) => {
                event.preventDefault();
                logoutUser();
            });
        }
        
        editMode();
    } catch (err) {
        console.error("Erreur lors de l'initialisation de la page :", err);
    }
});

