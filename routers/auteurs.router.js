import express from "express"
import { auteur_affichage, auteurs_affichage, ajoutAuteur, suppressionAuteur, modificationAuteur, modificationAuteurServeur } from '../controllers/auteur.controller.js'

//**************Router********************
const routerAuteur = express.Router()


//**************Affichage de la page auteur*********************
routerAuteur.get("/:id",auteur_affichage)

//**************Affichage de la page liste des auteurs******************
routerAuteur.get("/", auteurs_affichage)

//**************Ajout d'un auteur******************
routerAuteur.post("/", ajoutAuteur)

//**************Suppression d'un auteur******************
routerAuteur.post("/delete/:id", suppressionAuteur) 

//**************Modification d'un auteur******************
routerAuteur.get("/modification/:id", modificationAuteur)
routerAuteur.post("/modificationServer", modificationAuteurServeur)


export default routerAuteur