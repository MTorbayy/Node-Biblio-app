import mongoose from "mongoose"

const auteurSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom : String,
    prenom : String,
    age : Number,
    genre : Boolean 
})

//Création d'un virtual pour faire le lien entre l'auteur et les livres qu'il a écrit :
auteurSchema.virtual("livres", { //Param 1 : nom du champ qui nous permettra d'accéder aux livres
    ref : "Livre", //Collection concernée, définie dans le livreModel
    localField : "_id", //Champ présent dans cette collection qui permettra de faire le lien
    foreignField : "auteur"
}) 


const auteurModel = mongoose.model("Auteur", auteurSchema)  

export default auteurModel  