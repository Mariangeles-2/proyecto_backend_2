import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export function initPassport() {

    // Se inicia sesión de forma local: email + password
    passport.use(new LocalStrategy(
        { usernameField: "email", passwordField: "password", session: true },
        async (email, password, done) => {
            try {
                // Se busca usuario por email
                const user = await User.findOne({ email });
                // Se verifica contraseña con bcrypt
                if (!user || !user.password) return done(null, false, { message: "Credenciales inválidas" });
                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return done(null, false, { message: "Credenciales inválidas" });
                // Se retorna el usuario
                return done(null, {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    role: user.role
                });
            } catch (err) { return done(err); }
        }
    ));

    // Se inicia sesión con GitHub OAuth
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Se busca usuario por email
                const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
                let user = await User.findOne({ $or: [{ githubId: profile.id }, { email }] });
                // Se crea el usuario
                if (!user) {
                    user = await User.create({
                        first_name: profile.displayName || profile.username || "GitHub",
                        last_name: "User",
                        email,
                        age: 18,
                        githubId: profile.id
                    });
                }
                // Se retorna el usuario
                return done(null, {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    role: user.role
                });
            } catch (err) { return done(err); }
        }
    ));

// Se convierte al usuario completo en solo un ID para guardar en sesión
    passport.serializeUser((user, done) => done(null, user._id));
    // Se convierte ID en el usuario completo en cada petición
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).lean();
            if (!user) return done(null, false);
            done(null, { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, role: user.role });
        } catch (err) { done(err); }
    });
}
