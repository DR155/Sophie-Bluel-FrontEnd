//////////////////////////////////////
/// Gestion des appels à l'API ///////
//////////////////////////////////////

const URL = "http://localhost:5678/api"; // Base URL de l'API

//////////////////////////////////////
/// Récupération des oeuvres ////////
//////////////////////////////////////

export const APIWorks = async () => {
    try {
        const response = await fetch(`${URL}/works`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de la récupération des oeuvres :", err);
        throw err;
    }
};

//////////////////////////////////////
/// Gestion du login ////////////////
//////////////////////////////////////

export const APIConnection = async ({ email, password }) => {
    try {
        const response = await fetch(`${URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        throw err;
    }
};

//////////////////////////////////////
/// Suppression des oeuvres /////////
//////////////////////////////////////

export const APIDeletePicture = async (figureId, userToken) => {
    try {
        const response = await fetch(`${URL}/works/${figureId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return true;
    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        throw err;
    }
};

//////////////////////////////////////
/// Récupération des catégories /////
//////////////////////////////////////

export const APICategories = async () => {
    try {
        const response = await fetch(`${URL}/categories`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
        throw err;
    }
};

//////////////////////////////////////
/// Ajout des photos dans l'API /////
//////////////////////////////////////

export const APIAddPicture = async (formData) => {
    try {
        const response = await fetch(`${URL}/works`, {
            method: "POST",
            headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
            body: formData,
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de l'ajout de la photo :", err);
        throw err;
    }
};