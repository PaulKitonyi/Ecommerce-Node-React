const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        const { name, price, category, description, shipping, quantity} = fields;

        if(!name || !price || !category || !description || !shipping || !quantity){
            return res.status(400).json({
                error: "All fields should be present"
            });
        }

        let product = new Product(fields);

        if (files.photo) {
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image should be less than 1MB in size!!"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};