import mongoose from "mongoose";

export const connectToMongoDBAtlas = async () =>{
    try{
        await mongoose.connect('mongodb+srv://mariangelessomma:Mari.2010@cluster0.0jcsqe0.mongodb.net/');
        console.log('MongoDBAtlas conectado ✅.');
    }catch(error){
        console.error(error)
        process.exit(1);
    }
};
