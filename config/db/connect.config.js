import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const baseMongooseOpts = {
    serverSelectionTimeoutMS: 10000,
}

export const connectToMongoDBAtlas = async () =>{
    const uri = process.env.MONGO_URI_ATLAS;
    if (!uri) throw new Error("Falta MONGO_URI_ATLAS en el .env");

    try{
        await mongoose.connect(uri, baseMongooseOpts)
        console.log('MongoDBAtlas conectado ✅.');
    }catch(error){
        console.error(error)
        process.exit(1);
    }
};

