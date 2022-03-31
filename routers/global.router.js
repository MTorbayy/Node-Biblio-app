import express from "express"


//**************Router********************
const routerGlobal = express.Router()
//Paramètrage du routeur qui contiendra les différentes routes telles que définies ci dessous :

//***************Page d'accueil****************** 
routerGlobal.get('/', (requete, reponse) => {
    reponse.render("accueil.html.twig")
})

//***********************Gestion des erreurs****************** 

//Erreur 404
routerGlobal.use((requete, reponse, suite) => {
    const error = new Error("Page non trouvée") 
    error.status = 404 
    suite(error)
})

//Autres erreurs
routerGlobal.use((error, requete, reponse) => {
    reponse.status(error.status || 500) 
    reponse.end(error.message) 
})




export default routerGlobal
