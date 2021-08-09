import express, { json } from 'express';
import './database/db_connection.js'
import { longurlRouter, shorturlRouter } from './routes/url_route.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(json());
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use("/shorturl", longurlRouter);
app.use("/", shorturlRouter);
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));