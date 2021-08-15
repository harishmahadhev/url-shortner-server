import express, { json } from 'express';
import './database/db_connection.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { longurlRouter, shorturlRouter } from './routes/url_route.js';
import { loginRouter } from './routes/login_route.js';
import { validateToken } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use("/shorturl", validateToken, longurlRouter);
app.use("/login", loginRouter);
app.use("/", shorturlRouter);
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));