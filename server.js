import express from "express"
import morgan from "morgan"
import routerGlobal from './routers/global.router.js'
import routerLivre from './routers/livres.router.js'
import routerAuteur from "./routers/auteurs.router.js"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import session from "express-session"

//***************BDD******************
mongoose.connect("mongodb://localhost:27017/biblio", {useNewUrlParser:true, useUnifiedTopology:true}) //Connection à la bdd en local. Les deux paramètres suivants évitent les erreurs.


//****************Paramètrage du dossier public comme dossier de récupération des fichiers JS et CSS*****************
//Pour pouvoir utiliser __dirname et __filename :
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const server = express();

server.use(express.static(__dirname + "/public"))


//*************Morgan*****************
server.use(morgan("dev"))
//Pour utiliser le morgan sur la dev. Cela permet d'avoir plus d'informations dans le terminal lors des différentes actions.


//************body-parser*******************
server.use(bodyParser.urlencoded({extended:false})) //urlencoded permet de traiter les url et les informations postées
//body-parser permet de récupérer les données d'un champs avec la méthode POST


//****************Session**************************

//Paramètrage conseillée dans la documentation :
server.set('trust proxy', 1)
server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } //durée de vie max du cookie
  }))


//A placer avant la définition de la route :
server.use((req, rep, suite) => { //mise en place de la variable de traitement
    rep.locals.message = req.session.message // récupération de la variable créée dans le router
    delete req.session.message // Permettra de supprimer une fois qu'elle est transmise, pour ne plus qu'elle s'affiche inutilement
    suite() //Passe à la suite
}) 


//Les variables de session permettent de transmettre des informations de page en page et ont une durée de vie limitée.
//Toutes les pages web utilisant la session auront accès à l'information enregistrée en variable de session.


//***********Définition des routes*****************
server.use("/livres/", routerLivre) //Doit être précisé avant le global
server.use("/auteurs/", routerAuteur)
server.use("/", routerGlobal)




server.listen(3000);
//Ecoute le port 3000

