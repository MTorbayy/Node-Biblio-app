import mongoose from "mongoose"

const livreSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom : String,
    auteur : {  
        type : mongoose.Schema.Types.ObjectId,
        ref : "Auteur", //Collection concernée, déclarée dans le modèle
        required : true //Tout livre doit avoir un auteur
    },
    pages : Number, 
    description : String,   
    image : String
}) // Définition de la structure des données    

const livreModel = mongoose.model("Livre", livreSchema) //Association du model et du schema pour afficher les données de la bdd


 export default livreModel