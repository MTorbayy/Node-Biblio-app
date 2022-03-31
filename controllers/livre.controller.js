import livreModel from "../models/livres.model.js"
import auteurModel from "../models/auteurs.model.js"
import mongoose from "mongoose"
import fs from 'fs'

//******************Affichage de la liste des livres et des auteurs sur la page livres************************* 
export const livres_affichage = (requete, reponse) => { 

    auteurModel.find() //Pour trouver tous les auteurs
    .exec()
    .then(auteurs => {
    
        //Pour afficher les livres associés à cette route :
        livreModel.find() //Pour rechercher tous les livres
        .populate("auteur") //indique que je veux le développement du champ auteur. Donne accès aux propriétés du champ.
        .exec() //Pour exécuter la fonction find()
        .then(livres => { //Pour traier le résultat véhiculé par le paramètre livre
            reponse.render("livres/liste.html.twig", {
                liste : livres, //Récupération des livres
                auteurs : auteurs, //Récupération des auteurs pour la liste déroulante
                message : reponse.locals.message //Récupération du message de session
            }) 
        }) 
        .catch(error => console.log(error)) //Pour traiter les erreurs

    })
    .catch(error => console.log(error))
}


//*****************Ajouter un nouveau livre et son image************************
export const ajout_livre = (req, rep) => {
    console.log(req.file)
    const livre = new livreModel({ //Les champs doivent bien correspondre au modèle
        _id: new mongoose.Types.ObjectId(), //Création auto d'un id
        nom: req.body.titre,
        auteur: req.body.auteur,
        pages: req.body.pages,
        description: req.body.description, 
        image : req.file.filename 
    })
    
    livre.save() //Pour sauvegarder le nouvel objet
    .then(resultat => {
        console.log(resultat)
        rep.redirect("/livres") // Pour rediriger sur la page quand l'action est terminée
    })
    .catch (error => console.log(error))
}


//**************Affichage des détails d'un livre et de son auteur dans une nouvelle page***************************** */
export const affichageLivre = (req, rep) => {  

        livreModel.findById(req.params.id)
        .populate("auteur")
        .exec()
        .then(livre => rep.render("livres/livre.html.twig", {
            livre : livre,
            isModification : false}) )
        .catch(error => console.log(error))

}


//*******************Modifier un livre**************************

//Montrer la page de modification :
export const modificationPage = (req, rep) => {
    
    auteurModel.find()  
    .exec()
    .then(auteurs => {
        livreModel.findById(req.params.id)
        .populate("auteur")
        .exec()
        .then(livre => {   
            rep.render('livres/livre.html.twig', { 
            livre : livre,  
            auteurs : auteurs, 
            isModification:true
        })})
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))


}

//Modification du livre :
export const modificationLivre = (req, rep) => {
    const livreUpdate = {
        nom : req.body.titre,
        auteur : req.body.auteur,
        pages : req.body.pages,
        description : req.body.description //On ne rajoute pas l'identifiant car l'identifiant n'est pas à modifier
    }

    livreModel.updateOne({_id:req.body.identifiant}, livreUpdate) //J'indique que je veux modifier le livre correspondant à l'identifiant avec le contenu de la variable livreUpdate
    .exec()    
    .then(resultat => {
        console.log(resultat)
        if(resultat.matchedCount < 1) { //Gestion de l'erreur : aucune modification car id non reconnu. Si c'est vrai, on passe directement au catch.
            throw new Error('Requête de modification échouée') 
        } 

        req.session.message = {
            type : 'success',
            contenu : 'Modification effectuée'
        }
        rep.redirect("/livres")
    })
    .catch(error => {
        req.session.message = { //Pour envoyer un message d'erreur
            type : 'danger',
            contenu : error.message
        }
        rep.redirect("/livres") //Pour revenir sur la page livres en cas d'erreur
    })

}

export const modificationImage = (req, rep) => {
    
    const livre = livreModel.findById(req.body.identifiant)
    .select("image")
    .exec()
    .then(livre => {
        //Supression de l'image existante dans le dossier serveur :
        fs.unlink('./public/images/'+ livre.image, error => console.log(error))

        
        //Mise à jour de l'image et redirection :
        const imageUpdate = {
          image : req.file.filename  
        }

        livreModel.updateOne({_id:req.body.identifiant}, imageUpdate)
        .exec()
        .then(resultat => {
            rep.redirect("/livres/modification/" + req.body.identifiant)
        })
        .catch(error => console.log(error))
        })
}


//****************************Suprimer un livre*********************************
export const suprimerLivre = (req, rep) => {   

    const livre = livreModel.findById(req.params.id)
    .select('image') //Je récupère seulement le champ image
    .exec()
    .then(livre => {

        //Supression de l'image dans le serveur
        fs.unlink('./public/images/'+ livre.image, //fs doit avoir été importé au préalable pour supprimer le fichier indiqué
        error => console.log(error)) //en cas d'erreur

        //Supression du livre
        livreModel.remove({_id:req.params.id}) //On indique que l'id qu'on cherche correspond à celui qui est envoyé dans l'url
        .exec()
        .then(result => {
            req.session.message = { //Génération du message en variable de session
                type: 'success', //Permet de définir la couleur verte de l'alerte avec bootstrap
                contenu :'Suppression effectuée'
            }
            rep.redirect("/livres") // Pour rediriger sur la page quand l'action est terminée
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))

      
        
}


//Modification de l'image : 
// export const modificationImage = 