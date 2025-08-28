import { Router } from "express";
import { requiereJwtCookie } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requiereJwtCookie, async (req, res) => {
    const { User } = await import('../config/models/user.model.js');
    const user = await User.findById(req.user._id).lean();
    if(!user) return res.status(404).json({error: 'Usuario no encontrado ❌'});
    const { first_name, last_name, email, age, role } = user;
    res.status(200).json({ user: { first_name, last_name, email, age, role } });
});

export default router;
