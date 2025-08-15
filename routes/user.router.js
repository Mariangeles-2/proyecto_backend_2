import {Router} from "express";
import {User} from "../config/models/user.model.js";
import bcrypt from "bcrypt";
import {alreadyloggedIn, requireLogin} from "../middleware/auth.middleware.js";


const router = Router();

router.post("/register", alreadyloggedIn, async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        if (!firstName || !lastName || !age || !password) {
            return res.status(400).json({error: "Todos los datos son requeridos ❌"})
        }

        const exists = await User.exists({ email });
        if (exists) {
            return res.status(400).json({error: "El email ya está registrado ⚠️"})
        }

        const hash = await bcrypt.hash(req.body.password, 12);
        const user = new User({ firstName, lastName, age, email, password: hash });
        await user.save();

        res.status(201).json({message: `Usuario ${firstName} creado con éxito ✅`});

    }catch(error) {
        res.status(500).json({error: error.message});
    }
})

router.post("/login", alreadyloggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado ❌" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Credenciales Incorrectas ⚠️" });

        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age
        };
        res.status(200).json({ message: "Login Exitoso! ✅", user: req.session.user })

    }catch(error) {
        res.status(500).json({error: error.message});
    }
})

router.post("/logout", requireLogin, async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({message: "Logout exitoso, hasta pronto!"});
    });
})

router.get("/", requireLogin,async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }catch(error) {
        res.status(500).json({error: error.message});
    }
})

export default router;
