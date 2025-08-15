import { Router } from "express";
import { requireLogin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireLogin, (req, res) => {
    const { firstName, lastName, age, email } = req.session.user;
    res.status(200).json({ user: { firstName, lastName, email, age } })
})

export default router;
