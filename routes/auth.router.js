import {Router} from "express";
import {User} from "../config/models/user.model.js";
import bcrypt from "bcrypt";
import {alreadyLoggedIn, requireJWT, requireLogin} from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";


const router = Router();

//Registro de usuario - verifica que no esté ya logueado
router.post("/register", alreadyLoggedIn, async (req, res) => {
        //Se confirma o no existencia de usuario
        const { firstName, lastName, age, email, password } = req.body;
        if (!firstName || !lastName || !age || !password) {
            return res.status(400).json({error: "Todos los datos son requeridos ❌"})
        }
        const exists = await User.exists({ email });
        if (exists) {
            return res.status(400).json({error: "El email ya está registrado ⚠️"})
        }
        //Se hashea contraseña y se guarda usuario
        const hash = await bcrypt.hash(req.body.password, 12);
        await User.create({firstName, lastName, age, email, password:hash})

        res.status(201).json({message: `Usuario ${firstName} creado con éxito ✅`});
})

//Ingreso de sesión - verifica que no esté ya logueado
router.post("/login", alreadyLoggedIn, async (req, res, next) => {
    //Se llama a la estrategia local para verificaciones
    passport.authenticate("local", (error, user, info) =>{

        if (error) return next(error);
        if (!user) return res.status(401).json({error: info?.message || "Credenciales Incorrectas ⚠️"})

        //Se convierte al usuario en un Id
        req.logIn(user,{session:true}, (error2)=>{
            if(error2) return next(error2);
            //Se guarda en Mongo DB
            req.session.user = user;

            return res.json({message: "Usuario logeado ✅"})
        })
    })(req, res, next);
})

router.post("/logout", requireLogin, async (req, res, next) => {
    req.logout({keepSessionInfo: true}, (error) => {
        if (error) return next(error);

        if (req.session) {
            req.session.destroy((error2) =>{
                if (error2) return next(error);
                res.clearCookie("connect.sid");
                return res.json({message:"Logout exitoso ✅"});
            });
        }else {
            res.clearCookie("connect.sid");
            return res.json({message:"Logout exitoso (sin sesión activa)✅"})
        }
    });
});

router.get("/me", requireLogin, (req, res) => {
    res.json({user: req.session.user});
});

/** GitHub */
//Se envía a la página de GitHub al usuario para loguearse
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
//Pos-Login y confirmación
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth/github/fail" }),
    (req, res) => {
        req.session.user = req.user;
        res.json({ message: "Login exitoso con GitHub 😎", user: req.user });
    }
);
router.get("/github/fail", (req, res) => res.status(401).json({ error: "La autenticación con GitHub falló ❌" }));

/** JWT */
router.post("/jwt/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ error: "Credenciales inválidas ⚠️" });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(400).json({ error: "Contraseña inválida ⚠️" });

    const payloadJson = { userId: String(user._id), email: user.email, role: user.role };
    const token = jwt.sign(payloadJson, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login OK (JWT)", token });
});

router.get("/jwt/me", requireJWT, async (req, res) => {
    const user = await User.findById(req.jwt.userId).lean();
    if (!user) return res.status(404).json({ error: "Usuario no encontrado ❌" });
    const { firstName, lastName, email, age, role } = user;
    res.json({ firstName, lastName, email, age, role });
});

export default router;
