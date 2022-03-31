import auteurModel from "../models/auteurs.model.js"
import mongoose from "mongoose"
import fs from 'fs'


//**************Affichage de la page auteur*********************
export const auteur_affichage = (req, rep) => {
 
    auteurModel.findById(req.params.id)
    .exec()
    .then(auteur => {
        console.log(auteur)
        rep.render("auteurs/auteur.html.twig", {auteur : auteur})
    })
    .catch(error => console.log(error))

}

//**************Affichage de la page liste des auteurs*********************
export const auteurs_affichage = (req, rep) => {
    rep.render("auteurs/liste.html.twig")
}
