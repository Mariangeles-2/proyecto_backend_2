import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
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
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    isActive:{
        type: Boolean,
        default: true,
    }
})

export default mongoose.model('Student', studentSchema);
