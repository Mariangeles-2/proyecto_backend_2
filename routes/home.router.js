import {Router} from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send('Home desde el backend');
})

export default router;
