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
                prodData
            });
        })).catch((err) => {
            res.status(500).json({
                status: true,
                message: "product error",
                err
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
        {
            $group: {
                _id: "$prodCategory",
                count: {
                    $count: {}
                }
                //$count:{}

            }
        },
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
            msg: "product view succesfully :)",
            prodData
        }).catch((err) => {
            res.status(500).json({
                status: false,
                err: "error while fetching product details :(",
                err
            })
        })
    }))

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
            msg: "Non User Prod view succesfully :)",
            prodData,
            password: new mongoose.Types.ObjectId(req.user.password)
        })
    })).catch((err) => {
        res.status(500).json({
            status: false,
            error: "Non User Prod view failure :(",
            err
        })
    })
}
module.exports = {
    addProduct,
    getProduct,
    getNonUserProd


}







