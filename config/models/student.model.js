import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
        min: 0,
        max: 110,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match:[/.+@.+\..+/, 'Email inválido'],
    }
})

export default mongoose.model('Student', studentSchema);
