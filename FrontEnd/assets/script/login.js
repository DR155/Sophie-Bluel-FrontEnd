////////////////////////////
///// Gestion du login /////
////////////////////////////

    /////////////////////////////////
    ///// Récupération de l'API /////
    /////////////////////////////////

    import { APIConnection } from './API.js';

    //////////////////////////////////
    ///// Fonction de connection /////
    //////////////////////////////////

document.getElementById("submit").addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const oldError = document.querySelector(".error-message");
    if (oldError) {
        oldError.remove();
    }

    try {
        const data = await APIConnection({ email, password });
        const token = data.token;
        sessionStorage.setItem("accessToken", token);
 
        window.location.href = "index.html";

    } catch (error) { 
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
        errorMessage.classList.add("error-message"); 

        const form = document.querySelector("#login form");
        form.appendChild(errorMessage);
    }
});
