import passport from "passport";

// Protege con passport-jwt leyendo la cookie 'access_token'
export const requiereJwtCookie = passport.authenticate('jwt-cookie', {session: false});

// Autorización por rol simple
export const requireRole = (...roles) => (req, res, next) => {
    // passport coloca al user en req.user
    if(!req.user) return res.status(401).json({error: 'No autorizado ⚠️'});
    if(!roles.includes(req.user.role)) return res.status(403).json({error: 'Prohibido el paso ❌'});
    next();
};
