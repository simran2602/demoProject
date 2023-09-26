const mongoose = require('mongoose');
const wishlist = require('../Models/wishlist');
const { response, json } = require('express');

const addToWishlist = async (req, res, next) => {
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
                    res.status(200).json({ status: true, msg: "item added to wishlist succesfully", data: wishlistData})
                })
                .catch((err) => {
                    res.status(500).json({ status: false, msg: "item not added to wishlist", error: err })
                })
        } else {
            wishlist.deleteOne({
                prodId: data.prodId

            }).then((wishlistData) => {
                res.status(200).json({ status: true, msg: "item already added to wishlist", data: wishlistData })
            })
              .catch((err) => {
                    res.status(500).json({ status: false, msg: "", error: err })
                })
        }


    }).catch((err) => {
        res.status(500).json({
            status:false,
            msg:"product not added",            error:err

        })
    })
    // new wishlist({
    //     ...req.body

    // }).save()   
    //     .then((wishlistData) => {
    //         res.status(200).json({
    //             status: true,
    //             msg: "add to wishlist succesfully ",
    //             data: wishlistData
    //         })
    //     })
    //         .catch((err) => {
    //             res.status(500).json({
    //                 status: false,
    //                 msg: "failure! item not added to wishlist ",
    //                 error: err

    //             });
    //         });



}

module.exports = {
    addToWishlist

}