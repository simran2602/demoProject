const mongoose = require('mongoose');
const wishlist = require('../Models/wishlist');
const { response, json } = require('express');

const addToWishlist = async (req, res) => {
    wishlist.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id),//from middleware
                prodId: new mongoose.Types.ObjectId(req.body.prodId)//from req body
            },
        }
    ]).then((data) => {
        //console.log(data)
        if ((data.length) == 0) {
            new wishlist({
                userId: req.user._id,
                ...req.body
            }).save()
                .then((wishlistData) => {
                    res.status(200).json({ status: true, msg: "item added to wishlist succesfully", data: wishlistData })
                })
                .catch((err) => {
                    res.status(500).json({ status: false, msg: "item not added to wishlist", error: err })
                })
        }
        else {
            wishlist.deleteOne({
                userId: new mongoose.Types.ObjectId(req.user._id),//from middleware
                prodId: new mongoose.Types.ObjectId(req.body.prodId)//from req body

            }
            ).then((wishlistData) => {

                res.status(200).json({ status: true, msg: "item removed from wishlist", data: data })
            })
                .catch((err) => {
                    res.status(500).json({ status: false, msg: "server error", error: err })
                })
        }


    }).catch((err) => {
        res.status(500).json({
            status: false,
            msg: "product not added",
            error: err

        })
    })
}

module.exports = {
    addToWishlist

}