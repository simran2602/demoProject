// var express = require('express');
// var router = express.Router();
// var userController = require('../../Controller/user');

// router.post("/user/register",userController.);

// module.exports= router;


var express = require('express');
var router = express.Router();
var user = require("../../Controller/user");
var product = require("../../Controller/product");
var wishlist = require('../../Controller/wishlist');

//calling our middleware
var middleware = require('../../routes/service/middleware').middleware;

router.post("/user/register", user.userRegister);
router.get("/user/get-user", user.getUser);

router.post("/user/add-prod", product.addProduct);
router.get("/user/get-prod", product.getProduct);



router.use(middleware);

//from here after using middleware all defined routes will use middleware surely.
// router.put('/user/update/:id', user.updateUser); by using params
router.put('/user/update/', user.updateUser);
router.delete('/user/delete/', user.deleteUser);
router.get('/user/get-non-user-prod',product.getNonUserProd);
router.put('/user/update/:id', product.updateProd);
router.post('/user/add-to-wishlist',wishlist.addToWishlist)
router.get('/user/get-wishlist/',product.getWishlist)



module.exports = router;
