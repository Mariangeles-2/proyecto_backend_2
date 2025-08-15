import express from 'express';
import homeRouter from "./routes/home.router.js";
import studentRouter from "./routes/student.router.js";
import {connectToMongoDBAtlas} from "./config/db/connect.config.js";
import logger from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import userRouter from "./routes/user.router.js";
import profileRouter from "./routes/profile.router.js";

const app = express();
const PORT = process.env.PORT || 8080;
const ATLAS_URL = "mongodb+srv://mariangelessomma:Mari.2010@cluster0.0jcsqe0.mongodb.net/";

app.use(express.json());
app.use(logger);
app.use(cookieParser('secret-key'));

app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: ATLAS_URL,
            ttl: 60 * 60, // 1hr
        }),
        cookie: {
            maxAge: 1 * 60 * 60 * 1000, // 1hr
            httpOnly: true,
            signed: true,
        },
    })
);

//Routers
app.use(`/`, homeRouter);
app.use(`/student`, studentRouter);
app.use('/auth', userRouter);
app.use('/auth/profile', profileRouter);

const startServer = async () => {
    await connectToMongoDBAtlas();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();
