import {Router} from 'express';
import Student from '../config/models/student.model.js';
import mongoose from "mongoose";

const router = Router();

//Listar a todos los estudiantes
router.get('/', async (req, res) => {
    try {
        const student= await Student.find();
        res.status(200).json(student);
    }catch (error){
        res.status(500).json({error: `Error del servidor: ${error.message} 🐛`});
    }
});

//Subir un estudiante
router.post('/', async (req, res) => {
    try {
        const {firstName, lastName, age, email} = req.body;
        if (!firstName||!lastName||!age||!email){
            res.status(400).json({error:"Todos los datos son requeridos ❌"});
        }
        const student = new Student({firstName, lastName, age, email});
        await student.save();

        res.status(200).json({message:`El estudiante ${firstName} ha sido agregado ✅`});

    }catch (error){
        res.status(500).json({error: `Error del servidor: ${error.message} 🐛`});
    }
});

//Obtener estudiante por Id
router.get('/:id', async (req, res) => {
    try{
        const studentId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(studentId)){
            return res.status(400).json({error: "ID inválido ⚠️"})
        }

        const student = await Student.findById(studentId);
        if (!student){
            return res.status(404).json({error:`Estudiante con ID ${studentId} no encontrado ❌`})
        }
        res.status(200).json(student);

    }catch (error) {
        res.status(500).json({error: `Error del servidor: ${error.message} 🐛`});
    }
});

//Modificar estudiante
router.put('/:id', async (req, res) => {
    try{
        const studentId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(studentId)){
            return res.status(400).json({error: "ID inválido ⚠️"})
        }

        const student = await Student.findByIdAndUpdate(studentId, req.body, {
            new: true,
            runValidators: true
        });

        if (!student){
            return res.status(404).json({error:`Estudiante con ID ${studentId} no encontrado ❌`})
        }
        res.status(200).json({message: `Estudiante actualizado ✅`, student});

    }catch (error) {
        res.status(500).json({error: `Error del servidor: ${error.message} 🐛`});
    }
});

//Eliminar estudiante
router.delete('/:id', async (req, res) => {
    try{
        const studentId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(studentId)){
            return res.status(400).json({error: "ID inválido ⚠️"})
        }

        const student = await Student.findByIdAndDelete(studentId);
        if (!student){
            return res.status(404).json({error:`Estudiante con ID ${studentId} no encontrado ❌`})
        }
        res.status(200).json({message: `Estudiante eliminado ✅`, student});

    }catch (error) {
        res.status(500).json({error: `Error del servidor: ${error.message} 🐛`});
    }
});

export default router;
