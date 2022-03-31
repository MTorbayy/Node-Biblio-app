import express from "express"
import multer from 'multer'
import { livres_affichage, ajout_livre, affichageLivre, modificationPage, modificationLivre, modificationImage, suprimerLivre } from "../controllers/livre.controller.js"

//*************Paramètrage de multer pour l'upload de fichiers********************
//Définition des variables de paramètrage storage et fileFilter
const storage = multer.diskStorage({
    destination : (requete, file, callback) => {
      callback(null, "./public/images/") //Définit la destination des images. Plus de détails : www.npmjs.com/package/multer
    },
    filename : (requete, file, callback) => {
        console.log(file)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*10000) //définition d'un nom unique
      callback(null, uniqueSuffix + file.originalname) //file.originalname est le nom de base du fichier
    }
  }) 
  
  const fileFilter = (requete, file, callback) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true)
    } else {
      callback(new Error("l'image n'est pas acceptée", false))
    }
  }
  
//Paramètrage de multer avec les variable définie précédemment
  const upload = multer({ //Définition des paramètres d'upload
    storage: storage, //destination et nom du fichier
    limits : {
      fileSize : 1024 * 1024 * 5 // = 5Mo
    },
    fileFilter : fileFilter //Définition du type de fichier accepté
  })

//**************Router********************
const routerLivre = express.Router() //Paramètrage du routeur qui contiendra les différentes routes telles que définies ci dessous :


//******************Affichage de la liste des livres sur la page livres************************* 
routerLivre.get('/', livres_affichage)


//*****************Ajouter un nouveau livre et son image************************ 
routerLivre.post("/", upload.single("image"), ajout_livre) 


//****************************Suprimer un livre*********************************
routerLivre.post('/delete/:id', suprimerLivre) 


//**************Affichage des détails d'un livre dans une nouvelle page***************************** 
routerLivre.get('/:id', affichageLivre)


//*******************Modifier un livre**************************

//Montrer la page de modification :
routerLivre.get('/modification/:id', modificationPage)

//MODIFICATION DU LIVRE
//Récupération des données de modification et modification de la bdd :
routerLivre.post('/modificationServer', modificationLivre)

//MODIFICATION DE L'IMAGE
routerLivre.post("/updateImage", upload.single("image"), modificationImage)


export default routerLivre
