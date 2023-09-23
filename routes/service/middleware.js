//user object creation 
var user = {}

var userController = require('../../Controller/user');
var response = require('../../routes/service/response');

//MIDDLEWARE

//these urls does not need any middleware check
const permission = [

    {
        url: "/user/register"
    },
    {
        url: "/user/get-user"
    }

]

//definition of middleware
user.middleware = (req, res, next) => {
    if (permission.filter(item => item.url == req.url).length > 0) {
        next();
    } else {

        if (!req.headers.authorization) {
            return res.status(response.errorCode.requiredError).json({ error: "No Credentials Send", status: false, credentials: false })
        } else {
            let authorization = req.headers.authorization;
            let userData = null;

            let usertype = typeof (req.headers.usertype) != "undefined" ? req.headers.usertype : "user"

            if (usertype == "user") {
                userData = userController.getTokenData(authorization)
            }
            //now we have user data which we can use further

            if (userData && userData != null) {
                userData.password = null;
                userData.token = null;
                req.user = userData;
                req.usertype = usertype;
                next();
            } else {

                res.status(response.errorCode.authError).json({ error: "No Credentials Send", status: false, Credential: false })
            }

        }
    }

}

module.exports = {
    user
}


