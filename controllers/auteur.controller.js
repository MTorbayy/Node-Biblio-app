import auteurModel from "../models/auteurs.model.js"
import livreModel from "../models/livres.model.js"
import mongoose from "mongoose"
import fs from 'fs'


//**************Affichage de la page auteur*********************
export const auteur_affichage = (req, rep) => {          
 
    auteurModel.findById(req.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        console.log(auteur.livres)
        rep.render("auteurs/auteur.html.twig", {auteur : auteur, isModification : false})
    })
    .catch(error => console.log(error))   

}

//**************Affichage de la page liste des auteurs*********************
export const auteurs_affichage = (req, rep) => {

    auteurModel.find()
    .populate("livres") // Correspond à ce qui a été défini dans le virtual, param 1
    .exec()
    .then(auteurs => {
        rep.render("auteurs/liste.html.twig", {auteurs : auteurs} )
    })
    .catch(error => console.log(error))
    
}

//**************Ajout d'un nouvel auteur*********************
export const ajoutAuteur = (req, rep) => {
    const auteur = new auteurModel ({
        _id: new mongoose.Types.ObjectId(),
        nom : req.body.nom,
        prenom : req.body.prenom,
        age : req.body.age,
        genre : req.body.genre
    })

    auteur.save()
    .then(resultat => {
        rep.redirect("/auteurs")
    })
    .catch (error => console.log(error))
}

//**************Suppression d'un auteur*********************
export const suppressionAuteur = (req, rep) => {
    
    //Récupération de l'auteur anonyme :
    auteurModel.find()
    .where("nom").equals("anonyme") //La ou le champ nom correspond a la valeur anonyme
    .exec()
    .then(auteur => { //L'auteur correspond ici à un tableau contenant les résultats de la requête càd l'auteur anonyme

        //Récupération de tous les livres dont l'auteur a le même id que l'auteur à supprimer :
        //updateMany permet de modifier tous les livres qui ont cet auteur
        
        livreModel.updateMany({"auteur" : req.params.id}, //Param 1 : les livres correspondant à la requete
            {"$set": { "auteur" : auteur[0]._id}}, // param 2 : ce qu'on souhaite mettre à la place ($set permet d'indiquer que ça sera une modification)
            {"multi" : true}) //param 3 : pour indiquer qu'on veut modifier plusieurs champs 
        .exec()

        //Une fois que le remplacement de l'auteur supprimé par l'auteur anonyme est réalisé, on supprime l'auteur de la bdd :
        .then(
            auteurModel.deleteOne({_id : req.params.id})
            .exec()
            .then(rep.redirect("/auteurs"))
            .catch (error => console.log(error))
        )
        .catch (error => console.log(error))
    })
    .catch (error => console.log(error))

}

//**************Modification d'un auteur*********************
export const modificationAuteur = (req, rep) => {

    auteurModel.findById(req.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        rep.render("auteurs/auteur.html.twig", {auteur : auteur, isModification : true})
    })
    .catch (error => console.log(error))
}

export const modificationAuteurServeur = (req, rep) => {

    const auteurUpdate = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        age : req.body.age,
        genre : req.body.genre
    }

    auteurModel.updateOne({_id : req.body.identifiant}, auteurUpdate)
    .exec()
    .then(
        rep.redirect("/auteurs")
    )
}