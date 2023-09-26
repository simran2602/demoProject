const mongoose = require('mongoose');
const product = require('../Models/product');
// var user = require("../../Controller/user");

// const bcrypt = require('bcryptjs');
const { response, json } = require('express');

const addProduct = async (req, res) => {
    new product({
        ...req.body
    })
        .save()
        .then((async (prodData) => {
            res.status(200).json({
                status: true,
                message: "product added succesfully",
                data: prodData
            });
        })).catch((err) => {
            res.status(500).json({
                status: true,
                message: "product error",
                error: err
            });
        });
};


//function for view of product

const getProduct = (req, res, next) => {

    product.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "user",
                pipeline: [
                    {
                        $match: {
                            isDeleted: false
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createdOn: 0,
                            __v: 0
                        }
                    },

                ]
            }
        },
        {
            $unwind: "$user"
        },
        // {
        //     $group: {
        //         _id: "$prodCategory",
        //         count: {
        //             $count: {}
        //         }
        //         //$count:{}

        //     }
        // },
        {
            $project: {
                status: 0,
                isDeleted: 0,
                createdOn: 0,
                __v: 0

            }

        },

    ]).then(((prodData) => {
        res.status(200).json({
            status: true,
            msg: "product view succesfully ",
            data: prodData
        }).catch((err) => {
            res.status(500).json({
                status: false,
                err: "error while fetching product details ",
                error: err
            })
        })
    }))

}

//view wishlist from product

const getWishlist = (req, res) => {
    product.aggregate([

        {
            $lookup: {
                from: "wishlists",
                foreignField: "prodId",
                localField: "_id",
                as: "WishListed",
                // pipeline:[
                //     {
                //         $unwind:"$WishListed"
                //     },
                //     {
                //         $addFields:{
                //             wishlist:"$WishListed"
                //         }
                //     }
                //     // {
                //     //     $cond: {
                //     //         if: { $gt: [ WishListed.length , 0 ] },then :{$addFields:{WishListed:true}}
                //     //     }
                //     // }

                // ]


            },
           


        },
        // {
        //     $unwind:"$WishListed"
        // },
        {
            $addFields:{
                wishlist:{$cond:{if:{$gt:[{$size:"$WishListed"},0]},then:true,else:false}
                    
                }
            }
        },
        {
            $project:{
                WishListed:0
            }
        }
        

    ]).then((prodData) => {
        // if (WishListed.length > 0) { }
        res.status(200).json({
            status: true,
            msg: "view wishlisted items successful",
            data: prodData
        })
    }).catch((err) => {
        res.status(500).json({
            status: false,
            msg: "not able to view wishlisted item",
            error: err
        })
    })

}

const getNonUserProd = (req, res, next) => {
    console.log("req.user._id", req.user._id)
    product.aggregate([
        // {
        //     $lookup: {
        //         from: "users",
        //         // foreignField: "userId",
        //         // localField: "_id",
        //         pipeline:[
        //             {
        //                 $match:{

        //                 }
        //             }
        //         ],
        //         as: "NonUserProd"

        //     }
        // }
        {
            $match: {
                userId: { $ne: new mongoose.Types.ObjectId(req.user._id) }
            }
        }

    ]).then(((prodData) => {
        res.status(200).json({
            status: true,
            msg: "Non User Prod view succesfully ",
            data: prodData,
            // console.log("password",req.user.password)

        })
    })).catch((err) => {
        res.status(500).json({
            status: false,
            msg: "Non User Prod view failure ",
            error: err
        })
    })
}


const updateProd = async (req, res, next) => {
    await product.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(req.params.id)
        },
        {
            $set: {
                ...req.body
            }
        }
    ).then(((prodData) => {
        res.status(200).json({
            status: true,
            msg: "product updated succesfully ",
            data: prodData
        }).catch((err) => {
            res.status(500).json({
                status: false,
                msg: "Sorry! product not updated ",
                error: err
            })
        })
    }))

}
module.exports = {
    addProduct,
    getProduct,
    getNonUserProd,
    updateProd,
    getWishlist


}







