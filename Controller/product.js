const mongoose = require('mongoose');
const product = require('../Models/product');
const bcrypt = require('bcryptjs');
const {response}= require('express');

const addProduct = async (req,res) =>{
    new product({
       ...req.body
    })
    .save()
    .then((async(response)=>{
        res.status(200).json({
            status:true,
            message:"product added succesfully"
        });
    })).catch((err)=>{
        res.status(500).json({
            status:true,
            message:"product error"
        });
    });
};

module.exports ={
    addProduct

}







