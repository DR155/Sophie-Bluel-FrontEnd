////////////////////////////////
///// Gestion de la modale /////
////////////////////////////////

import { APIWorks, APIDeletePicture, APICategories, APIAddPicture } from "./API.js";
import { fetchWorks } from "./homepage.js";

////////////////////////////////////////
/// Récupération des oeuvres ///////////
////////////////////////////////////////

const updateWorks = async () => {
    try {
        const data = await APIWorks();
        console.log("Mise à jour des œuvres en cours...");
        
        // Mise à jour de la modale
        const modalGallery = document.querySelector(".modal-gallery");
        if (modalGallery) {
            modalGallery.innerHTML = "";
            data.forEach((figure) => {
                const figureElement = document.createElement("figure");
                figureElement.id = `modal-figure-${figure.id}`;

                const imgElement = document.createElement("img");
                imgElement.src = figure.imageUrl;
                imgElement.alt = figure.title;

                const deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash-can delete-btn";
                deleteIcon.dataset.id = figure.id;

                figureElement.appendChild(imgElement);
                figureElement.appendChild(deleteIcon);
                modalGallery.appendChild(figureElement);
            });
        }
        // Mise à jour de la galerie principale
        await fetchWorks();
        console.log("Mise à jour des œuvres terminée avec succès");
    } catch (err) {
        console.error("Erreur lors de la mise à jour des œuvres :", err);
    }
};

///////////////////////////////////////////////////////
///// Gestion ouverture / fermeture de la modale 1 ////
///////////////////////////////////////////////////////

const modal = document.querySelector("[data-modal1]");
const openButton = document.querySelector("[data-open-modal]");
openButton.addEventListener("click", () => {
    modal.showModal();
    updateWorks();
});

const closeButton = document.querySelector("[data-close-modal]");
closeButton.addEventListener("click", () => {
    modal.close();
});

///////////////////////////////////////////////////////
///// Gestion ouverture / fermeture de la modale 2 ////
///////////////////////////////////////////////////////

const modal2 = document.querySelector("[data-modal2]");

const openButton2 = document.querySelector("[data-open-modal2]"); 
openButton2.addEventListener("click", () => {
    modal.close();
    modal2.showModal();
});

const closeButton2 = document.querySelector("[data-close-modal2]");
closeButton2.addEventListener("click", () => {
    modal2.close();
});

modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.close();
    }
});

const returnButton = document.querySelector("[data-return-modal1]");
returnButton.addEventListener("click", () => {
    modal2.close();
    modal.showModal();
    updateWorks();
});

////////////////////////////////////////
/// Gestion de la suppression /////////
////////////////////////////////////////

const deleteMode = () => {
    const userToken = sessionStorage.getItem("accessToken");
    if (!userToken) return;

    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) =>
        btn.addEventListener("click", async (e) => {
            const figureId = e.target.getAttribute("data-id");
            try {
                const isDeleted = await APIDeletePicture(figureId, userToken);
                if (isDeleted) {
                    // Vérifier l'existence des éléments avant de les supprimer
                    const modalFigure = document.querySelector(`#modal-figure-${figureId}`);
                    const galleryFigure = document.querySelector(`.gallery figure[id="${figureId}"]`);

                    if (modalFigure) {
                        modalFigure.remove(); // Supprimer de la modale
                    }
                    
                    if (galleryFigure) {
                        galleryFigure.remove(); // Supprimer de la galerie
                    }

                    // Confirmer la suppression à l'utilisateur
                    await updateWorks();
                    console.log("L'image a été supprimée avec succès");
                
                }
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
            }
        })
    );
};

////////////////////////////////////
///// Gestion de l'ajout d'image /////
////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryDropdown();
    setupAddPhotoForm();
    updateWorks();
});

const setupCategoryDropdown = async () => {
    const categorySelect = document.getElementById("category");
    try {
        const categories = await APICategories();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        alert("Impossible de charger les catégories. Veuillez réessayer.");
    }
}

function setupAddPhotoForm() {
    const form = document.querySelector(".modal-form");
    const pictureInput = document.getElementById("picture");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const addPictureDiv = document.querySelector(".add-picture");
    const submitButton = form.querySelector("input[type='submit']");

    // Define updateSubmitButtonState first
    const updateSubmitButtonState = () => {
        if (pictureInput.files[0] && titleInput.value.trim() && categorySelect.value) {
            submitButton.classList.add("add-btnActive");
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove("add-btnActive");
            submitButton.disabled = true;
        }
    };

    // Then add the event listeners
    pictureInput.addEventListener("change", () => {
        const file = pictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addPictureDiv.style.backgroundImage = `url(${e.target.result})`;
                addPictureDiv.style.backgroundSize = "contain";
                addPictureDiv.style.backgroundPosition = "center";
                addPictureDiv.style.backgroundRepeat = "no-repeat";
                addPictureDiv.style.height = "169px";
                addPictureDiv.style.width = "100%";

                // Masquer les éléments du formulaire
                addPictureDiv.querySelector("label").style.opacity = "0";
                addPictureDiv.querySelector("i").style.opacity = "0";
                addPictureDiv.classList.add("image-loaded");
            };
            reader.readAsDataURL(file);
        }
        updateSubmitButtonState();
    });

    titleInput.addEventListener("input", updateSubmitButtonState);
    categorySelect.addEventListener("change", updateSubmitButtonState);
    form.addEventListener("submit", handleFormSubmit);

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", pictureInput.files[0]);
        formData.append("title", titleInput.value);
        formData.append("category", categorySelect.value);

        const userToken = sessionStorage.getItem("accessToken");
        if (!userToken) {
            alert("Vous devez être connecté pour ajouter une image");
            return;
        }

        APIAddPicture(formData, userToken)
            .then(() => {
                console.log("Nouvelle image ajoutée avec succès");
                resetForm(form, addPictureDiv);
                modal2.close();
                modal.showModal();
                updateWorks();
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de l'image:", error);
            });
    }
}

const resetForm = (form, addPictureDiv) => {
    form.reset(); 
    addPictureDiv.style.backgroundImage = ""; 
    addPictureDiv.querySelector("label").style.opacity = "1"; 
    addPictureDiv.querySelector("i").style.opacity = "1"; 
    addPictureDiv.classList.remove("image-loaded");
    
    const categorySelect = form.querySelector("#category");
    categorySelect.value = "";
}

// Ajouter après la déclaration des modales
modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.close();
    }
});

modal2.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal2.close();
    }
});
        deleteMode();
