
export function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "No autorizado" });
    }
    next();
}

export function alreadyloggedIn(req, res, next) {
    if (req.session.user) {
        return res.status(403).json({ error: "Ya estas logueado" });
    }
    next();
}
