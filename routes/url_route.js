import express from 'express';
import validUrl from 'valid-url';
import { urlModel } from '../database/model.js';
import shortid from 'shortid';
const longurlRouter = express.Router();
const shorturlRouter = express.Router();

longurlRouter.route("/")
    .get(async (req, res) => {
        const url = await urlModel.find();
        res.status(200).json(url);

    })
    .post(async (req, res) => {
        const { longurl } = req.body;
        var baseUrl = req.protocol + '://' + req.get('host');
        const urlCode = shortid.generate();

        if (!validUrl.isUri(baseUrl)) return res.status(401).json("Invalid base Url");

        if (validUrl.isUri(longurl)) {
            try {
                let url = await urlModel.findOne({ longurl });
                if (url) {
                    res.json(url);
                } else {
                    const shortUrl = baseUrl + "/" + urlCode;
                    url = new urlModel({ longurl, shorturl: shortUrl, date: new Date(), urlcode: urlCode })
                    await url.save();
                    res.json(url);
                }
            } catch (error) {
                console.log(error)
                res.status(500).json("Server Error")
            }
        } else {
            res.status(401).json("Invalid Long Url");
        }
    })
longurlRouter.route("/:id").delete(async (req, res) => {
    const { id } = req.params;
    try {
        const url = await urlModel.findByIdAndRemove(id);
        res.json({ message: "Deleted Successfully", url });
    } catch (error) {
        res.send(error)
    }
})
shorturlRouter
    .route("/").get(async (req, res) => {
        req.send("Welcome")
    })
shorturlRouter
    .route("/:code").get(async (req, res) => {
        try {
            const url = await urlModel.findOne({ urlcode: req.params.code });
            if (!url) {
                return res.status(404).json("Invalid URL")
            } else {
                return res.redirect(url.longurl)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("server Error")
        }
    })
export { longurlRouter, shorturlRouter };