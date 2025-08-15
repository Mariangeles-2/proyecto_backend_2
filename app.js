import express from 'express';

import homeRouter from "./routes/home.router.js";
import studentRouter from "./routes/student.router.js";
import userRouter from "./routes/user.router.js";
import profileRouter from "./routes/profile.router.js";

import logger from "./middleware/logger.middleware.js";

import {connectToMongoDBAtlas} from "./config/db/connect.config.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(logger);
app.use(cookieParser(process.env.SESSION_SECRET));



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

    //Routers
    app.use(`/`, homeRouter);
    app.use(`/student`, studentRouter);
    app.use('/auth', userRouter);
    app.use('/auth/profile', profileRouter);

    app.use((req, res) => {
        res.status(404).json({ error: "Página inexistente 📃" });
    })

    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT} ✅.`));
}

await startServer();
