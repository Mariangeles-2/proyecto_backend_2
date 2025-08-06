import {Router} from 'express';
import Student from '../config/models/student.model.js';

const router = Router();

//Listar a todos los estudiantes
router.get('/', async (req, res) => {
    try {
        const student= await Student.find();
        res.status(200).json(student);
    }catch (error){
        res.status(500).json({error:error.message});
    }
})

//Subir un estudiante
router.post('/', async (req, res) => {
    try {
        const {name, lastname, age, email} = req.body;
        if (!name||!lastname||!age||!email){
            res.status(400).json({error:"Todos los datos son requeridos."});
        }
        const student = new Student({name, lastname, age, email});
        await student.save();

        res.status(200).json({message:`El estudiante ${name} ha sido agregado.`});

    }catch (error){
        res.status(500).json({error:error.message});
    }
})
export default router;
