import express from "express"
import { auteur_affichage, auteurs_affichage } from '../controllers/auteur.controller.js'

//**************Router********************
const routerAuteur = express.Router()


//**************Affichage de la page auteur*********************
routerAuteur.get("/:id",auteur_affichage)

//**************Affichage de la page liste des auteurs******************
routerAuteur.get("/", auteurs_affichage)


export default routerAuteur