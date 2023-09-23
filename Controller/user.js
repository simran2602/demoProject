const mongoose = require('mongoose');
const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');
//const user = require('../Models/user');

const saltRounds = 10;

//generate jsonwebtoken
function generateToken(userData) {
    return jwt.sign(userData, "userToken")
}

//get token data
function getTokenData(authorization) {
    return userModel.findOne({
        token: authorization
    })
}


const userRegister = async (req, res) => {
    var newPassword = await bcrypt.hash(req.body.password, saltRounds);
    new User({
        ...req.body,
        password: newPassword,
        token: generateToken(req.body)
        //createdOn:new Date(),
    })
        .save()
        .then((userData) => {
            console.log("111");

            res.status(200).json({
                status: true,
                message: "user register successfully",
                userData
            });
        }).catch((err) => {
            console.log("111", err)
            res.status(500).json({
                status: false,
                message: "Server error! Please try again !",
                err

            });
        });
};

// const getUser = (req,res,next) => {
//     User.find()
//     .then(async(response)=>{
//         res.status(200).json({
//             status:true,
//             message:"view succesfull",
//             data:response
//         });
//     }).catch((err)=>{
//         res.status(500).json({
//             status:false,
//             message:"user not found",
//         });
//     });
// };


const getUser = (req, res, next) => {
    User.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "userId",
                as: "Product",
                pipeline: [
                    {
                        $match: {
                            isDeleted: false
                        }
                    },
                    {
                        $project: {
                            userId: 0,
                            status: 0,
                            isDeleted: 0,
                            createdOn: 0,
                            __v: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$Product"
        },
        {
            $addFields: {
                productDesc: "$Product.prodDesc"
            },


        },

        {
            $project: {
                password: 0,
                status: 0,
                isDeleted: 0,
                createdOn: 0,
                __v: 0, Product: 0
            }
        }

    ]).then(((data) => {
        res.status(200).json({
            status: true,
            message: "view succesfull",
            data
        });
    })).catch((err) => {
        res.status(500).json({
            status: false,
            message: "user not found",
            err
        });
    });

};

const updateUser = (req, res, next) => {
    User.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(req.params.id)
        },
        {
            $set: {
                ...req.body
            }
        }
    ).then(((data) => {
        res.status(200).json({
            status: true,
            msg: 'user updated succesfully',
            data
        })
    }))
        .catch((error) => {
            res.status(200).json({
                status: false,
                error: 'user not updated',
                error,
            })
        })
}

const deleteUser = (req, res, next) => {
    User.findOneAndDelete(
        {
            _id: new mongoose.Types.ObjectId(req.params.id)
        },

    ).then(((data) => {
        res.status(200).json({
            status: true,
            isDeleted: true,
            msg: "user deleted succesfully",
            data
        })
    })).catch((error) => {
        res.status(500).json({
            status: false,
            error: "user not deleted",
            error
        })
    })

}





module.exports = {
    userRegister,
    getUser,
    updateUser,
    deleteUser,
    getTokenData,
    
};