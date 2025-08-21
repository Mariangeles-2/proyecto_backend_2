import express from 'express';

import homeRouter from "./routes/home.router.js";
import studentRouter from "./routes/student.router.js";
import authRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";

import logger from "./middleware/logger.middleware.js";

import {connectToMongoDBAtlas} from "./config/db/connect.config.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";

import {initPassport} from "./config/auth/passport.config.js";
import passport from "passport";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(logger);
app.use(cookieParser(process.env.SESSION_SECRET));

//Se configura la sesión
const startServer = async () => {
    await connectToMongoDBAtlas();

    const store = MongoStore.create({
        client: (await import("mongoose")).default.connection.getClient(),
        ttl: 60 * 60,
    })

    app.use(
        session({
            secret: process.env.SESSION_SECRET || "secret-key",
            resave: false,
            saveUninitialized: false,
            store,
            cookie: {
                maxAge: 1 * 60 * 60 * 1000, // 1hr
                httpOnly: true,
            },
        })
    );

    //Se inicializa Passport
    //Passport - Login
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    //Routers
    app.use(`/`, homeRouter);
    app.use(`/student`, studentRouter);
    app.use('/auth', authRouter);
    app.use('/auth/profile', profileRouter);

    app.use((req, res) => {
        res.status(404).json({ error: "Página inexistente 📃" });
    })

    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT} ✅.`));
}

await startServer();
