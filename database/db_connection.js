import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const MongoUrl = process.env.MONGOURL
mongoose.connect(MongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => { if (err) console.log("error : ", JSON.stringify(err, undefined, 2)) });
const mongodb = mongoose.connection;
mongodb.on("open", () => console.log("MongoDb connected"))