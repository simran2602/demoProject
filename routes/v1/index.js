// var express = require('express');
// var router = express.Router();
// var userController = require('../../Controller/user');

// router.post("/user/register",userController.);

// module.exports= router;


var express = require('express');
var router = express.Router();
var user = require("../../Controller/user");
var product = require("../../Controller/product");

//calling our middleware
var middleware = require('../../routes/service/middleware').middleware;

router.post("/user/register",user.userRegister);
router.get("/user/get-user",user.getUser);

router.post("/user/add-prod",product.addProduct);


router.use(middleware);

//from here after using middleware all defined routes will use middleware surely.
router.put('/user/update/:id',user.updateUser);
router.delete('/user/delete/:id',user.deleteUser);



module.exports = router;