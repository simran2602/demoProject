const mongoose = require('mongoose');
const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');
//const user = require('../Models/user');

const saltRounds = 10;

//generate jsonwebtoken
function generateToken(userData) {
     return  jwt.sign(userData, "userToken")
}

//get token data
// function getTokenData(authorization) {
//     const userData = User.findOne({
//         token: authorization
//     }).exec()
//     console.log("userData",userData)
//     return userData
// }
const getTokenData = async (authorization) => {
    const userData = await User.findOne({
        token: authorization
    }).exec() //handling exceptions here also can be done by then and catch
    // console.log("userData", userData)
    return userData
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
                message: "user register successfully ",
                data:userData
            });
        }).catch((err) => {
            console.log("111", err)
            res.status(500).json({
                status: false,
                message: "Server error! Please try again ! ",
                error:err

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


const getUser = (req, res) => {
    User.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: "products",
                foreignField: "userId",
                localField: "_id",
                as: "Product",
                pipeline: [
                    {
                        $match: {
                            isDeleted: false
                        }
                    },
                    // {
                    //     $group: {
                    //         _id: "$prodCategory",
                    //         //totalAmt: { $sum: "$prodAmt" }


                    //     }
                    // },

                    // {
                    //     $project: {
                    //         userId: 0,
                    //         status: 0,
                    //         isDeleted: 0,
                    //         createdOn: 0,
                    //         __v: 0
                    //     }
                    // }
                ]
            }
        },
        {
            $unwind: "$Product"
        },
        {
            $addFields: {
                productDesc: "$Product.prodDesc",
                //prodamt:"$product.prodCategory"
            },


        },

        {
            $project: {
                password: 0,
                status: 0,
                isDeleted: 0,
                createdOn: 0,
                __v: 0, //Product: 0
            }
        }

    ]).then(((userData) => {
        res.status(200).json({
            status: true,
            message: "view succesfull ",
            data:userData
        });
    })).catch((err) => {
        res.status(500).json({
            status: false,
            message: "user not found ",
            error:err
        });
    });

};



const updateUser = (req, res) => {
    User.findOneAndUpdate(
        {
            //_id: new mongoose.Types.ObjectId(req.params.id), here we are passing _id by using params
            //because its come under middleware we can directly use user id  by below code
            _id: req.user._id
            
        },
        {
            $set: {
                ...req.body
            }
        }
    ).then(((userData) => {
        res.status(200).json({
            status: true,
            msg: 'user updated succesfully ',
            data:userData
        })
    }))
        .catch((err) => {
            res.status(200).json({
                status: false,
                error: 'user not updated ',
                error:err
            })
        })
}

const deleteUser = (req, res, next) => {
    User.findOneAndDelete(
        {
            // _id: new mongoose.Types.ObjectId(req.params.id)
            _id:req.user._id
        },

    ).then(((userData) => {
        res.status(200).json({
            status: true,
            isDeleted: true,
            msg: "user deleted succesfully ",
            data:userData
        })
    })).catch((err) => {
        res.status(500).json({
            status: false,
            msg: "user not deleted ",
            error:err
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