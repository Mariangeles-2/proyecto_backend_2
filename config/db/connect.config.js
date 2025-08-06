import mongoose from "mongoose";

export const connectToMongoDB = async () =>{
    try{
        await mongoose.connect('mongodb+srv://mariangelessomma:Mari.2010@cluster0.0jcsqe0.mongodb.net/students');
        console.log('✅ MongoDB conectado exitosamente.!!');
    }catch(error){
        console.error(error)
        process.exit(1);
    }
};
