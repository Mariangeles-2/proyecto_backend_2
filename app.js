import express from 'express';
import homeRouter from "./routes/home.router.js";
import studentRouter from "./routes/student.router.js";
import {connectToMongoDB} from "./config/db/connect.config.js";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//Routers
app.use(`/`, homeRouter);
app.use(`/student`, studentRouter);

const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();
