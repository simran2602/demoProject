const mongoose = require('mongoose');
const wishlist = require('../Models/wishlist');
const { response, json } = require('express');

const addToWishlist = async (req, res, next) => {
    new wishlist({
        ...req.body
    })
        .save()
        .then(((wishlisted) => {
            res.status(200).json({
                status: true,
                msg: "add to wishlist succesfully ",
                data:wishlisted
            }).catch((err) => {
                res.status(500).json({
                    status: false,
                    msg: "failure! item not added to wishlist ",
                    error:err

                })
            })
        }))


}

module.exports = {
    addToWishlist

}